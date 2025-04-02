import express from "express"
import cors from "cors"

const app = express()

app.use(cors())


app.use(express.urlencoded({extended : true}))
app.use(express.static("public"))

import router from "./routes/ide.routes.js"

app.use("/api" , router)


export { app }