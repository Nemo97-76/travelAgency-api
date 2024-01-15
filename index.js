import http from "http"
import app from "./app/app.js"
import { config } from "dotenv"
import path from "path"
config({
    path: path.resolve("./config/secureData.env")
})
///create the server
const server = http.createServer(app)
server.listen(3120, console.log(`sever running on port 3120`))