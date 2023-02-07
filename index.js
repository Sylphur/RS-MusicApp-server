require('dotenv').config();

// Listen on a specific host via the HOST environment variable
var host = process.env.HOST || '0.0.0.0';
// Listen on a specific port via the PORT environment variable
var port = process.env.PORT || 8080;
const EXPRESS = require('express');
const CORS = require('cors');
const MONGOOSE = require('mongoose');
const ROUTER = require('./router/index');
const cookieParser = require('cookie-parser');
const errorMiddleware = require('./middlewares/error-middleware');

const PORT = process.env.PORT || 5001;
const APP = EXPRESS();

APP.use(EXPRESS.json());
APP.use(cookieParser());
APP.use(CORS());
APP.use('/api', ROUTER); 
APP.use(errorMiddleware) //всегда последним!!

const start = async () => {
  try {
    await MONGOOSE.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    APP.listen(port, host, () => console.log(`Server started on port ${PORT}`))
  } catch (e){
    console.log(e);
  }
}
start();