const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

console.log(process.env.NODE_ENV);

// *** MIDDLEWARES SECTION ***

// Run this middleware only in development.
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

// We can write custom middleware.
// Because we didn't specify any route, this middleware will be applied to each and every single request.
app.use((req, res, next) => {
    console.log('Boom! I am a middleware.');
    // Calling the next function is a must to prevent the middleware stack from getting stuck.
    next();
});

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

// *** MIDDLEWARES SECTION END ***

// *** ROUTES SECTION ***

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// *** ROUTES SECTION END ***

module.exports = app;
