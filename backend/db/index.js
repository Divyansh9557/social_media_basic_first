import mongoose from "mongoose"


const connectDB= async ()=>{
    try {
        const connectionInstance= await mongoose.connect(process.env.MONGO_URI);
        console.log(` data base connect succesfully host: ${connectionInstance.connection.host}`)
    } catch (error) {
        console.log("error while connecting database");
    }
}

export default connectDB