import { server } from "./app.js"
import dotenv from "dotenv"

dotenv.config({ path : "./.env" })
const PORT = process.env.PORT || 9000

server.listen(PORT, () => {
    console.log(`Server is running on PORT : ${PORT}`)
})



