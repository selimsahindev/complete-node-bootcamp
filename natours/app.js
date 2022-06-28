const fs = require('fs')
const express = require('express')

const app = express()

// Middlewares
app.use(express.json())

const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
)

// Routes
app.get('/api/v1/tours', (req, res) => {
    res.status(200).json({
        status: 'success',
        reuslts: tours.length,
        data: { tours },
    })
})

app.get('/api/v1/tours/:id', (req, res) => {
    console.log(req.params)

    // We make sure that it turns into a number by multiplying it by 1.
    const id = req.params.id * 1
    const tour = tours.find((el) => el.id === id)

    if (!tour) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID',
        })
    }

    res.status(200).json({
        status: 'success',
        data: {
            tour,
        },
    })
})

app.post('/api/v1/tours', (req, res) => {
    // console.log(req.body)

    const newId = tours[tours.length - 1].id + 1
    const newTour = Object.assign({ id: newId }, req.body)

    tours.push(newTour)
    fs.writeFile(
        `${__dirname}/dev-data/data/tours-simple.json`,
        JSON.stringify(tours),
        (err) => {
            res.status(201).json({
                status: 'success',
                data: {
                    tour: newTour,
                },
            })
        }
    )
})

app.delete('/api/v1/tours/:id', (req, res) => {
    if (req.params.id * 1 > tours.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID',
        })
    }

    res.status(204).json({
        status: 'success',
        data: null,
    })
})

const port = 3000
app.listen(port, () => {
    console.log(`App is running on port ${port}...`)
})
