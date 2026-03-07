import cors from "cors"












const corsOptions = {
    origin: process.env.FRONTEND_URL,
    methods: ["GET","POST","PUT","PATCH","DELETE"],
}
export default corsOptions