const express = require('express')
const {
    getAllTours,
    getTour,
    createTour,
    updateTour,
    deleteTour,
    checkID,
} = require('../controllers/tourController')

const router = express.Router()

// param() middleware function is used to add the callback triggers to route parameters.
router.param('id', checkID)

router.route('/').get(getAllTours).post(createTour)
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour)

module.exports = router
