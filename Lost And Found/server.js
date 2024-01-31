const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const path = require('path');


const bodyParser = require('body-parser');

const app = express();
const port = 5000;

// Configure and connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/mydb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;



db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Database Connected!');
});

// Configure sessions
app.use(
  session({
    secret: 'yourSecretKey', 
    resave: true,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: 'mongodb://127.0.0.1:27017/mydb' }),
  })
);

// Middleware for parsing request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Serve static files
app.use(express.static(__dirname + '/public'));
app.use('/uploads', express.static(__dirname + '/uploads'));
app.use(express.static(__dirname + '/views'));



// Set the view engine to use EJS
app.set('view engine', 'ejs');
app.engine('ejs', require('ejs').renderFile);
app.set('views', path.join(__dirname, 'views'));






// Include your routes
const routes = require('./router');
app.use('/', routes);

// Start the server
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
