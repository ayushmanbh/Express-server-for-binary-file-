const express = require('express')
const cors = require('cors')
const os = require('os')
const path = require('path')
const fs = require('fs')
const bodyParser = require('body-parser')

const app = express()
const PORT = 5000

app.use(bodyParser.raw({
  type: 'application/octet-stream'
}))

app.use(cors({
  origin: ['http://localhost:8000', 'http://localhost:3000']
}))

const pointcloudsFolder = path.join(os.homedir(), "sse-internal")

app.get('/pointcloud', (req, res) => {
  fs.readFile(`${path.join(os.homedir(), '/sse-images')}/${req.query.filename.slice(1)}`, (err, data) => {
    if (err) {
      console.log(err.message)
      return res.end()
    }
    res.writeHead(200, { 'Content-Type': 'application/octet-stream' });
    res.write(data)
    return res.end()
  })
})

app.get('/binaries', (req, res) => {
  fs.readFile(`${path.join(os.homedir(), '/sse-internal')}/${req.query.filename.slice(1)}`, (err, data) => {
    if (err) {
      console.log(err)
      return res.end()
    }
    res.writeHead(200, { 'Content-Type': 'application/octet-stream' });
    res.write(data)
    return res.end()
  })
})

app.post('/save', (req, res) => {
  const fileToSave = pointcloudsFolder + req.query.filename;
  const dir = fileToSave.match("(.*\/).*")[1];
  console.log(dir, fileToSave)
  fs.mkdir(dir, { recursive: true }, (error) => {
    if (error) console.log(error.message)
  });

  var wstream = fs.createWriteStream(fileToSave);
  wstream.write(req.body);
  wstream.end();
  res.setHeader('Content-Type', 'application/octet-stream');
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.end("Sent: " + fileToSave);
})

app.listen(PORT, () => {
  console.log('Server running on port: ' + PORT)
})