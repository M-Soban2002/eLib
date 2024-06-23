import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";


const generateTokens = async (userId)=>{
try {
        const user = User.findById(userId)
        const accessToken = jwt.sign(
            {
            _id  :user.id,
            email : user.email,
            username : user.username
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    
        }
    )
    
        const refreshToken = jwt.sign(
            {
            _id : user.id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    
        }
    )
     user.refreshToken = refreshToken
    
     await user.save({ validateBeforeSave: false })
    
     return {accessToken, refreshToken}
} catch (error) {
    new ApiError(500, "something went wrong")
}

}



const register = async (req, res, next) => {
    const { username, email, password } = req.body;

    // Check if any field is empty
    if ([username, email, password].some((field) => !field || field.trim() === "")) {
        return next(new ApiError(400, "All fields are required"));
    }

    try {
        // Check if user already exists
        const existedUser = await User.findOne({ $or: [{ username }, { email }] });

        if (existedUser) {
            return next(new ApiError(409, "User with this username or email already exists"));
        }

        // Create new user
        const user = await User.create({ username, email, password });

        // Retrieve created user without password field
        const createdUser = await User.findById(user._id).select("-password");

        if (!createdUser) {
            return next(new ApiError(500, "Something went wrong while registering the user"));
        }

        // Send response
        return res.status(200).json({
            message: "Registered successfully!!!",
            status: 200,
            data: createdUser
        });
    } catch (error) {
        // Handle unexpected errors
        return next(new ApiError(500, error.message));
    }
}

const login = async (req, res, next) => {
    const { email, password } = req.body;

    if ([email, password].some((field) => !field || field.trim() === "")) {
        return next(new ApiError(409, "Email and password are required"));
    }

    try {
        const registeredUser = await User.findOne({ email });

        if (!registeredUser) {
            return next(new ApiError(400, "User does not exist"));
        }

        const isPasswordValid = await registeredUser.isPasswordCorrect(password);

        if (!isPasswordValid) {
            return next(new ApiError(401, "Invalid user credentials"));
        }

        const { accessToken, refreshToken } = generateTokens(registeredUser._id);

        // Save refresh token to user record
        registeredUser.refreshToken = refreshToken;
        await registeredUser.save();

        const loggedInUser = await User.findById(registeredUser._id).select("-password");

        if (!loggedInUser) {
            return next(new ApiError(500, "Something went wrong while logging in"));
        }

        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Secure cookie in production
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        };

        return res
            .status(200)
            .cookie("accessToken", accessToken, { ...options, maxAge: 15 * 60 * 1000 }) // 15 minutes for access token
            .cookie("refreshToken", refreshToken, options) // 7 days for refresh token
            .json(new ApiResponse(200, "Logged in successfully", { user: loggedInUser, accessToken, refreshToken }));
    } catch (error) {
        return next(new ApiError(500, error.message));
    }
}



// const logoutUser = async(req, res) => {
//     await User.findByIdAndUpdate(
//         req.user._id,
//         {
//             $unset: {
//                 refreshToken: 1 // this removes the field from document
//             }
//         },
//         {
//             new: true
//         }
//     )

//     const options = {
//         httpOnly: true,
//         secure: true
//     }

//     return res
//     .status(200)
//     .clearCookie("accessToken", options)
//     .clearCookie("refreshToken", options)
//     .json({})
// }


// const refreshAccessToken = async (req, res) => {
//     const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

//     if (!incomingRefreshToken) {
//         throw new ApiError(401, "unauthorized request")
//     }

//     try {
//         const decodedToken = jwt.verify(
//             incomingRefreshToken,
//             process.env.REFRESH_TOKEN_SECRET
//         )
    
//         const user = await User.findById(decodedToken?._id)
    
//         if (!user) {
//             throw new ApiError(401, "Invalid refresh token")
//         }
    
//         if (incomingRefreshToken !== user?.refreshToken) {
//             throw new ApiError(401, "Refresh token is expired or used")
            
//         }
    
//         const options = {
//             httpOnly: true,
//             secure: true
//         }
    
//         const {accessToken, newRefreshToken} = await generateTokens(user._id)
    
//         return res
//         .status(200)
//         .cookie("accessToken", accessToken, options)
//         .cookie("refreshToken", newRefreshToken, options)
//         .json(
//               {status: 200, },
//                 {accessToken, refreshToken: newRefreshToken},
//                 "Access token refreshed"
//         )
//     } catch (error) {
//         throw new ApiError(401, error?.message || "Invalid refresh token")
//     }

// }

export { 
    register,
    login
 }
