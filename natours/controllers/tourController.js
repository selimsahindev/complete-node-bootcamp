const Tour = require('../models/tourModel');

// Read the dummy data from local file
// const tours = JSON.parse(
//     fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

const getAllTours = async (req, res) => {
    try {
        // 1.A) FILTERING
        // Destructure and create a new copy object.
        let queryObject = { ...req.query };
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        // Delete excluded fields.
        excludedFields.forEach((el) => delete queryObject[el]);

        // 1.B) ADVANCED FILTERING
        let queryString = JSON.stringify(queryObject);
        queryString = queryString.replace(
            /\b(gte|gt|lte|lt)\b/g,
            (match) => `$${match}`
        );
        queryObject = JSON.parse(queryString);

        let query = Tour.find(queryObject);

        // 2) SORTING
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        }

        // 3) FIELD LIMITING
        if (req.query.fields) {
            const fields = req.query.fields.split(',').join(' ');
            query = query.select(fields);
        } else {
            // For default, we want to exclude __v field. (We used minus before the field name).
            query = query.select('-__v');
        }

        // 4) PAGINATION
        // Multiplying by one is a nice and easy trick to convert the string to a number.
        // '|| 1' at the end indicates the 1 as a default value.
        const page = req.query.page * 1 || 1;
        const limit = req.query.limit * 1 || 100;
        const skip = (page - 1) * limit;
        query.skip(skip).limit(limit);

        // Throw an error if the page is not exists.
        if (req.query.page) {
            const numberOfTours = await Tour.countDocuments();
            if (skip > numberOfTours) {
                throw new Error('This page does not exist.');
            }
        }

        // EXECUTE QUERY
        const tours = await query;

        res.status(200).json({
            status: 'Success.',
            reuslts: tours.length,
            data: {
                tours,
            },
        });
    } catch (err) {
        res.status(404).json({
            status: 'Fail.',
            message: err,
        });
    }
};

const getTour = async (req, res) => {
    try {
        const tour = await Tour.findById(req.params.id);
        // This is the shorthand for writing:
        // Tour.findOne({ _id: req.params.id })

        res.status(200).json({
            status: 'Success.',
            data: {
                tour,
            },
        });
    } catch (err) {
        res.status(404).json({
            status: 'Fail',
            message: err,
        });
    }
};

const createTour = async (req, res) => {
    try {
        // We can create new tour like this
        // const newTour = new Tour({});
        // newTour.save();

        // OR
        const newTour = await Tour.create(req.body);

        res.status(201).json({
            status: 'Created Successfully.',
            data: {
                tour: newTour,
            },
        });
    } catch (err) {
        res.status(400).json({
            status: 'Fail',
            message: 'Invalid data sent!',
        });
    }
};

const updateTour = async (req, res) => {
    try {
        const updatedTour = await Tour.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        res.status(200).json({
            status: 'Updated Successfully.',
            data: {
                tour: updatedTour,
            },
        });
    } catch (err) {
        res.status(404).json({
            status: 'Fail',
            message: err,
        });
    }
};

const deleteTour = async (req, res) => {
    try {
        await Tour.findByIdAndDelete(req.params.id);

        res.status(204).json({
            status: 'Deleted Successfully.',
            data: null,
        });
    } catch (err) {
        res.status(404).json({
            status: 'Fail',
            message: err,
        });
    }
};

module.exports = {
    getAllTours,
    getTour,
    createTour,
    updateTour,
    deleteTour,
};
