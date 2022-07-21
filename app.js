const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const path = require('path');
const cors = require('cors');
const passport = require('passport');

//Initialize the app
var app = express();

//Middlewares
//Form Data Middleware
app.use(bodyParser.urlencoded({
    extended: false
}));

//Json Body Middleware
app.use(bodyParser.json());

//Cors Middleware
app.use(cors());

//Setting up static directory
app.use(express.static(path.join(__dirname, 'public')));

//use the passport Middleware
app.use(passport.initialize());

//bring in the Strategy
require('./config/passport')(passport);


//Bring in the Database Config and connect with the database
const db = require('./config/keys').mongoURI;
mongoose.connect(db, { useNewUrlParser: true }).then(() => {
    console.log(`Database connected successfully ${db}`)
}).catch(err => {
    console.log(`Unable to connect with the database ${err}`)
});

// app.get('/', (req, res) => {
//     return res.send('<h1>Hello World</h1>');
// });

//Bring in the Users route
const users = require('./routes/api/users');
//const passport = require('./config/passport');
app.use('/api/users', users);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
})
//app.listen(5000);