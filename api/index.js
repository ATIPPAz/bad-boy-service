const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
// ตั้งค่า Express application ที่ใช้งาน SSE ได้ที่นี่


// app.js
app.get('/sse', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  let counter = 0;

  const interval = setInterval(() => {
    counter++;
    res.write(`data: ${counter}\n\n`);
  }, 1000);

  // จัดการการยุติการเชื่อมต่อของ client
  req.on('close', () => {
    clearInterval(interval);
    res.end();
  });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

