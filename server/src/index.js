import { app } from "./app.js";
import dotenv from "dotenv";

export { app };
dotenv.config(
    {
        path: "./.env"
    }
)

app.listen(process.env.PORT, ()=>{
    console.log(`server is running at PORT: ${process.env.PORT}`)
});