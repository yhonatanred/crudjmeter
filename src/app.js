const path = require('path');
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');

const app = express();
db_name = 'crud-mongo'
    //provide a sensible default for local development
mongodb_connection_string = 'mongodb://127.0.0.1:27017/' + db_name;
//take advantage of openshift env vars when available:
if (process.env.OPENSHIFT_MONGODB_DB_URL) {
    mongodb_connection_string = process.env.OPENSHIFT_MONGODB_DB_URL + db_name;
}

// connection to db
mongoose.connect(mongodb_connection_string)
    .then(db => console.log('db connected'))
    .catch(err => console.log(err));

// importing routes
const indexRoutes = require('./routes/index');

// settings
app.set('port', process.env.OPENSHIFT_NODEJS_PORT || 9000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }))
    // routes
app.use('/', indexRoutes);

var server_ip_address = process.env.OPENSHIFT_NODEJS_IP ||
    'localhost'

var server_port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 9000

app.listen(server_port, () => {
    console.log(`server on port ${server_port}`);
});