const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db')
const mongoSanitize=require('express-mongo-sanitize');
const helmet=require('helmet');
const {xss}=require('express-xss-sanitizer');
const rateLimit=require('express-rate-limit');
const hpp=require('hpp');
const cors=require('cors');
const swaggerJsDoc=require('swagger-jsdoc');
const swaggerUI=require('swagger-ui-express');

//Route file
const dentists = require('./routes/dentists');
const auth = require('./routes/auth');
const bookings = require('./routes/bookings');

//Load env vars
dotenv.config({path:'./config/config.env'});

//Connect to database
connectDB();

const app=express();

//Body parser
app.use(express.json());

//Cookir parser
app.use(cookieParser());

//Sanitize data
app.use(mongoSanitize());

//Set security headers
app.use(helmet());

//Prevent XSS attacks
app.use(xss());

//Rate Limiting
const limiter=rateLimit({
    windowsMs:10*60*1000, //10 mins
    max: 100
});
app.use(limiter);

//Prevent http param pollutions
app.use(hpp());

//Enable CORS
app.use(cors());

//Mount routers
app.use('/api/v1/dentists',dentists);
app.use('/api/v1/auth',auth);
app.use('/api/v1/bookings',bookings);

const PORT=process.env.PORT || 5000;
const Server = app.listen(PORT, console.log('Server running in ', process.env.NODE_ENV, ' mode on port ', PORT));

//Handie unhandled promise rejections
process.on('unhandledRejection', (err,promise) => {
    console.log(`Error: ${err.message}`);
    //Close server & exit process
    Server.close(()=>process.exit(1));
});