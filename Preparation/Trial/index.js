const express = require("express");
const cors = require("cors");
const compression = require('compression')
const dotenv = require('dotenv')
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.unsubscribe(compression());

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

// ✅ Endpoint to list video files
app.get("/videos", (req, res) => {
    const videoDir = path.join(__dirname, "videos");
    if (!fs.existsSync(videoDir)) return res.status(404).send("Video folder not found");

    const files = fs.readdirSync(videoDir).filter(file => file.endsWith(".mp4"));
    if (files.length === 0) return res.status(404).send("No video files found");

    res.json(files);
});

// ✅ Stream selected video file
app.get("/videos/:filename", (req, res) => {
    const range = req.headers.range;
    if (!range) return res.status(400).send("Requires Range header");

    const videoPath = path.join(__dirname, "videos", req.params.filename);
    
    // Check if file exists first
    if (!fs.existsSync(videoPath)) {
        return res.status(404).send("Video not found");
    }

    const videoSize = fs.statSync(videoPath).size;
    const CHUNK_SIZE = 10 ** 6; // 1MB

    // Validate range format
    const rangeMatch = range.match(/bytes=(\d+)-(\d*)/);
    if (!rangeMatch) {
        return res.status(416).header("Content-Range", `bytes */${videoSize}`).send();
    }

    const start = parseInt(rangeMatch[1], 10);
    const end = rangeMatch[2] 
        ? parseInt(rangeMatch[2], 10) 
        : Math.min(start + CHUNK_SIZE, videoSize - 1);

    const contentLength = end - start + 1;

// In your video streaming endpoint
    const headers = {
    "Content-Range": `bytes ${start}-${end}/${videoSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": contentLength,
    "Content-Type": "video/mp4",
    "Cache-Control": "public, max-age=31536000" // 1 year cache for chunks
    };

    res.writeHead(206, headers);
    const stream = fs.createReadStream(videoPath, { start, end });
    stream.pipe(res);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
