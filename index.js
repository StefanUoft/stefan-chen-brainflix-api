require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs-extra');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 8080;
const dataFilePath = './data/videos.json';

app.get('/', (req, res) => {
    res.send('Welcome to the Video API backend page created by Stefan!');
});

app.get('/videos', async (req, res) => {
  try {
    const videos = await fs.readJSON(dataFilePath);
    const videoSummaries = videos.map(({ id, title, image }) => ({ id, title, image }));
    res.json(videoSummaries);
  } catch (err) {
    res.status(500).send('Error reading video data');
  }
});

app.get('/videos/:id', async (req, res) => {
  try {
    const videos = await fs.readJSON(dataFilePath);
    const video = videos.find((vid) => vid.id === req.params.id);
    if (!video) return res.status(404).send('Video not found');
    res.json(video);
  } catch (err) {
    res.status(500).send('Error reading video data');
  }
});

app.post('/videos', async (req, res) => {
  try {
    const videos = await fs.readJSON(dataFilePath);
    const newVideo = {
      id: uuidv4(),
      title: req.body.title,
      description: req.body.description,
      image: '/images/Upload-video-preview.jpg',
      views: "0",
      likes: "0",
      duration: "0:00",
      video: "https://example.com/default-video.mp4",
      timestamp: Date.now(),
      comments: []
    };
    videos.push(newVideo);
    await fs.writeJSON(dataFilePath, videos);
    res.status(201).json(newVideo);
  } catch (err) {
    res.status(500).send('Error saving video');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
