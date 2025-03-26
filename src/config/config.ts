import dotenv from "dotenv";
dotenv.config();
const config = {
    PORT: process.env.PORT || 5000,
    REDIS_URL: process.env.REDIS_URL || "redis://localhost:6379",
    BASE_URL: process.env.BASE_URL || "http://localhost:5000",

}
export default config