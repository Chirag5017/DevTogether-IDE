const express = require("express")
const app = express()

app.get("/",(req,res) => {
  res.json({
    message:"Welcome to DevTogether"
  })
})

app.listen(8000,() =>{
  console.log("server listenning on 8000")
})