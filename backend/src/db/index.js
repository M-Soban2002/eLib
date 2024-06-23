import mongoose from "mongoose";

const connectDB = async ()=>{
try {
    const connectionInstance = await mongoose.connect("monsodb connection string dal lo apni ")
    console.log(`MongoDB server started at host ${connectionInstance.connection.host}`)
} catch (error) {
    console.log(`MongoDB error: ${error}`)
    process.exit(1)
}
}

export {connectDB}