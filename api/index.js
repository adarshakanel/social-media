const express = require('express');
const app = express();

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const userRoute = require('./routes/users.js')
const authRoute = require('./routes/auth.js')
const postRoute = require('./routes/posts.js')

// to protect the env file
dotenv.config();

// connect to mongodb
mongoose.connect(process.env.MONGO_URL,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => {
        console.log("Connected to MongoDB");
    });

// middleware
app.use(express.json());                // to parse with json
app.use(helmet());
app.use(morgan("common"));

app.use('/api/user', userRoute)
app.use('/api/auth', authRoute)
app.use('/api/post', postRoute);

// connect to port 8800
app.listen(8800, () => {
    console.log("backend server is working");
})