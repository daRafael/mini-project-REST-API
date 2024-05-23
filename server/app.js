// STATIC DATA
// Devs Team - Import the provided files with JSON data of students and cohorts here:
// ...
require('./db')

// INITIALIZE EXPRESS APP - https://expressjs.com/en/4x/api.html#express
const express = require("express");
const app = express();

// MIDDLEWARE
// Research Team - Set up CORS middleware here:
// ...
require('./config')(app);

// ROUTES - https://expressjs.com/en/starter/basic-routing.html
// Devs Team - Start working on the routes here:
// ...

//documentation route
app.get("/docs", (req, res) => {
  res.sendFile(__dirname + "/views/docs.html");
});

//STUDENT ROUTES
const studentRoutes = require('./routes/student.routes');
app.use('/api', studentRoutes);

// COHORT ROUTES
const cohortRoutes = require('./routes/cohort.routes');
app.use('/api', cohortRoutes);


require('./error-handling')(app);

module.exports = app;