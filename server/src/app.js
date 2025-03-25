import express from "express"
import path from "path"
import fs from "fs"

const app = express()

app.use(cors({
    origin : [process.env.CORS_ORIGIN],
    credential : true
}))


app.use(express.urlencoded({extended : true}))
app.use(express.static("public"))


export { app }