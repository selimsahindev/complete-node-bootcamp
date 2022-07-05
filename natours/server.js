const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

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

// Start the server.
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`App is running on port ${port}...`));
