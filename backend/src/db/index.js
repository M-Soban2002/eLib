import mongoose from "mongoose";

const connectDB = async ()=>{
try {
    const connectionInstance = await mongoose.connect("mongodb+srv://aoctyl:UQ2mIHQTimqBbSmD@cluster0.freisob.mongodb.net/Elib?retryWrites=true&w=majority&appName=Cluster0")
    console.log(`MongoDB server started at host ${connectionInstance.connection.host}`)
} catch (error) {
    console.log(`MongoDB error: ${error}`)
    process.exit(1)
}
}

export {connectDB}