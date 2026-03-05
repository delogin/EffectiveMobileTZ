const express = require('express')
const router = express.Router()
const app = express()

const users = require("./routes/user")

const port = 3000
app.use(express.json())

app.get('/', (req, res) => {
  res.send('ахуенно')
})

app.get('/:string', (req, res) => {
    console.log(req.params.string)
    res.send('ща чекну')
})

app.use('/user', users)

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({ error: err.message });
});

app.listen(port, () => {
  console.log(`app listening on port ${port}`)
})
