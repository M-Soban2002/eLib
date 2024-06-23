import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true  
    },

    password: {
        type: String,
        required: true  
    },

    refreshToken: {type: String}
})

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = bcrypt.hash(this.password, salt);
        this.password = hashedPassword;
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};


const User = mongoose.model("User", userSchema)

export {User}