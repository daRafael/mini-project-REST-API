const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const PORT = 5005;

// STATIC DATA
// Devs Team - Import the provided files with JSON data of students and cohorts here:
// ...
const mongoose = require("mongoose");
const Cohort = require("./models/Cohort.model");
const Student = require("./models/Student.model")

mongoose
  .connect("mongodb://127.0.0.1:27017/cohort-tools-api")
  .then(x => console.log(`Connected to Database: "${x.connections[0].name}"`))
  .catch(err => console.error("Error connecting to MongoDB", err));


// INITIALIZE EXPRESS APP - https://expressjs.com/en/4x/api.html#express
const app = express();


// MIDDLEWARE
// Research Team - Set up CORS middleware here:
// ...
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());


// ROUTES - https://expressjs.com/en/starter/basic-routing.html
// Devs Team - Start working on the routes here:
// ...

//documentation route
app.get("/docs", (req, res) => {
  res.sendFile(__dirname + "/views/docs.html");
});

//STUDENT ROUTES

//post student
app.post('/api/students', (req, res) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    linkedinURL,
    languages,
    program,
    background,
    image,
    cohort
  } = req.body

  Student.create({
    firstName,
    lastName,
    email,
    phone,
    linkedinURL,
    languages,
    program,
    background,
    image,
    cohort
  })
    .then((student) => {
      console.log('Student created:', student);
      res.status(201).json(student);
    })
    .catch((err) => {
      console.log('Error creating student:', err);
      res.status(500).json({ error: 'Failed to create student' });
    });
});

//get students
app.get('/api/students', (req, res) => {
  Student.find({})
    .populate('cohort')
    .then((students) => {
      console.log("Retrived cohorts ->", students);
      res.json(students);
    })
    .catch((error) => {
      console.error("Error while retrieving students ->", error);
      res.status(500).json({error: "Failed to retrieve students"});
    })
})

//get students for a given cohort
app.get('/api/students/cohort/:id', (req, res) => {
  const { id } = req.params;

  Student.find({ cohort: id })
    .populate('cohort')
    .then((students) => {
      console.log(`"Retrived students fror cohort ${id}"`)
      res.json(students);
    })
    .catch((error) => {
      console.error('Error getting students of cohort', error)
      res.status(500).json({ error: "Failed to retrive students of cohort" })
    })
})

// get students by id
app.get("/api/students/:id", (req, res) => {
  const { id } = req.params;

  Student.findById(id)
    .populate('cohort')
    .then((student) => {
      if(!student) {
        return res.status(404).json({error: 'Student not found' })
      }

      res.status(200).json(student)
    })
    .catch((error)=> {
      console.error('Error getting student by Id', error);
      res.status(500).json({ error: 'Failed to get student by Id'});
    });
});
  
// update a student by id

app.put("/api/students/:id", (req, res) => {
  const { id } = req.params;
  const {
    firstName,
    lastName,
    email,
    phone,
    linkedinURL,
    languages,
    program,
    background,
    image,
    cohort
  } = req.body;

  Student.findByIdAndUpdate(id, 
    {
      firstName,
      lastName,
      email,
      phone,
      linkedinURL,
      languages,
      program,
      background,
      image,
      cohort
    },
    {new : true}
  )
  .then((student) => {
    if(!student){
      return res.status(404).json({error: 'Student not found'});
    }
    res.json(student)
  })
  .catch((error) => {
    console.error('Error updating student by Id', error);
    res.status(500).json({error: 'Fail to update student by Id'});
  })
})

// delete a student by Id

app.delete("/api/students/:id", (req,res)=> {
  const { id } = req.params;

  Student.findByIdAndDelete(id)
  .then((student)=>{
    if(!student){
      return res.status(404).json({error: 'Student not found'})
    }
    res.json(student)
  })
  .catch((error)=> {
    console.log(error('Error deleting student by Id', error));
    res.status(500).json({error: 'Fail to delete student by Id'})
  })
})

// COHORT ROUTES

//post cohort
app.post('/api/cohorts', (req, res) => {
  const {
    cohortSlug,
    cohortName,
    program,
    format,
    campus,
    startDate,
    enDate,
    inProgress,
    programManager,
    leadTeacher,
    totalHours
  } = req.body

  Cohort.create({
    cohortSlug,
    cohortName,
    program,
    format,
    campus,
    startDate,
    enDate,
    inProgress,
    programManager,
    leadTeacher,
    totalHours
  })
    .then((cohort) => {
      console.log('Cohort created:', cohort);
      res.status(201).json(cohort);
    })
    .catch((err) => {
      console.log('Error creating cohort:', err);
      res.status(500).json({ error: 'Failed to create cohort' });
    });
})

//get cohorts
app.get('/api/cohorts', (req, res) => {
  Cohort.find({})
    .then((cohorts) => {
      console.log("Retrived cohorts ->", cohorts);
      res.json(cohorts);
    })
    .catch((error) => {
      console.error("Error while retrieving cohorts ->", error);
      res.status(500).json({error: "Failed to retrieve cohorts"});
    })
})

//get cohort by id
app.get("/api/cohorts/:id", (req, res) => {
  const { id } = req.params;

  Cohort.findById(id)
    .then((cohort) => {
      if(!cohort) {
        return res.status(404).json({error: 'Cohort not found' })
      }

      res.status(200).json(cohort)
    })
    .catch((error)=> {
      console.error('Error getting cohort by Id', error);
      res.status(500).json({ error: 'Failed to get cohort by Id'});
    });
});

//update cohort by id
app.put("/api/cohorts/:id", (req, res) => {
  const { id } = req.params;
  const {
    cohortSlug,
    cohortName,
    program,
    format,
    campus,
    startDate,
    enDate,
    inProgress,
    programManager,
    leadTeacher,
    totalHours
  } = req.body;

  Cohort.findByIdAndUpdate(id, 
    {
      cohortSlug,
      cohortName,
      program,
      format,
      campus,
      startDate,
      enDate,
      inProgress,
      programManager,
      leadTeacher,
      totalHours
    },
    {new : true}
  )
  .then((cohort) => {
    if(!cohort){
      return res.status(404).json({error: 'Cohort not found'});
    }
    res.json(cohort)
  })
  .catch((error) => {
    console.error('Error updating cohort by Id', error);
    res.status(500).json({error: 'Fail to update cohort by Id'});
  })
})

//delete cohort by id
app.delete("/api/cohorts/:id", (req, res)=> {
  const { id } = req.params;

  Cohort.findByIdAndDelete(id)
  .then((cohort)=>{
    if(!cohort){
      return res.status(404).json({error: 'Cohort not found'})
    }
    res.json(cohort)
  })
  .catch((error)=> {
    console.log(error('Error deleting Cohort by Id', error));
    res.status(500).json({error: 'Fail to delete cohort by Id'})
  })
})


// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});