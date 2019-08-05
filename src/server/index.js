// const http = require('http')
const express = require('express')

const app = express()
app.use(express.urlencoded({ extended: true }))

// const server = http.createServer((req, res) => {
//   console.log(req)
//   res.writeHead(200, { 'Content-Type': 'text/plain' })
//   res.end('okay')
// })

app.post('/', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' })
  console.log(req.body.file)
  res.end('okay')
})

app.listen(8081, '127.0.0.1', () => {
  console.log('Server successfully started')
})
