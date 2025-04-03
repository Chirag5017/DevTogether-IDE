const express = require("express");
const app = express();


app.use("/", (req, res) => {
    res.send("Hello World");
})

app.listen(8001, (err) => {
    if(err) {
        console.error(`Error occurred while listening to the server : ${err}`);
    }else{
        console.log(`Server is listening at http://localhost:8001`);
    }
})