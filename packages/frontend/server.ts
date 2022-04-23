const express = require('express')
const port = process.env.PORT || 10082
const app = express()

import { readFileA, readFileB } from './loadData';

app.use(express.json())

app.use(function (req, res, next) {
    console.log("== Request received")
    console.log("  - METHOD:", req.method)
    console.log("  - URL:", req.url)
    console.log("  - HEADERS:", req.headers)
    next()
})

// Get the project file
app.get('/api/projects/shared/:name', function (req, res, next) {
    const name = req.params.name
    readFileA(name).then(blob => {
        res.status(200).send(blob);
    }).catch(err => {
        res.status(404).send({ err: err }) 
    })
})

app.use('*', function (req, res, next) {
    res.status(404).send({
        err: "This URL was not recognized: " + req.originalUrl
    })
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})


// == Request received
//   - METHOD: POST
//   - URL: /api/authentication

// == Request received
//   - METHOD: GET
//   - URL: /api/projects/shared/settings
//   - HEADERS: {
