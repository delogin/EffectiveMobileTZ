const express = require('express')
const router = express.Router()
const app = express()

const users = require('./routes/user')

const port = 3000
app.use(express.json())

app.use('/user', users)

app.use(function(err, req, res, next) {
    let responseData;

    if (err.name === 'JsonSchemaValidation') {
      console.log(err.message);
      res.status(400);

      responseData = {
        statusText: 'Bad Request',
        jsonSchemaValidation: true,
        validations: err.validations
      };


      res.json(responseData);
    } else {
      next(err);
    }
});

app.use((err, req, res, next) => {
    console.log(err)
    console.error(err.stack);
    res.status(err.status || 500).json({ error: err.message });
});

app.listen(port, () => {
    console.log(`app listening on port ${port}`)
})
