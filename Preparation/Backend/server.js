const express = require('express');
const fs = require('fs');
const zlib = require('zlib');
// const path = require('path');
const status = require('express-status-monitor');

const app = express();
const port = 8000;

fs.createReadStream("./sample.txt").pipe(zlib.createGzip()).pipe(fs.createWriteStream("./sample.zip")
).on("finish", () => {
    console.log("File compressed successfully");
});

app.use(status());

// app.get("/", (req, res) => {
//     fs.readFile("./sample.txt", (err,data) => {
//         res.end(data);
//         // console.log(err)
//     })
// })

app.get("/", (req, res) => {
    const stream = fs.createReadStream("./sample.txt", "utf-8");
    stream.on("data", (chunk) => {
        res.write(chunk);
    });
    stream.on("end", () => {
        res.end();
    });
})

app.listen(port, ()=> {
    console.log(`Server is running on port ${port}`);
})