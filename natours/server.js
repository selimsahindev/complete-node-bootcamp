const dotenv = require('dotenv');

// Set the environment variables we defined in the config.env file.
dotenv.config({ path: './config.env' });

const app = require('./app');

//console.log(process.env)

// Start the server.
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`App is running on port ${port}...`));
