/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('../../models/tourModel');

// Set the environment variables we defined in the config.env file.
dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
);

mongoose
    .connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
    })
    .then(() => console.log('Successfully connected to DB.'));

// Read Json file
const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);

// Import data into database.
const importData = async () => {
    try {
        await Tour.create(tours);
        console.log('Data successfully loaded.');
    } catch (e) {
        console.log(e);
    }
    process.exit(); // An aggressive way of stopping an application.
};

// Delete all data from database.
const deleteData = async () => {
    try {
        await Tour.deleteMany();
        console.log('Data successfully deleted.');
    } catch (e) {
        console.log(e);
    }
    process.exit(); // An aggressive way of stopping an application.
};

// This is how we can use console arguments to call specific methods.
if (process.argv[2] === '--import') {
    importData();
} else if (process.argv[2] === '--delete') {
    deleteData();
}
