const express = require('express');
const app = express();
const cors = require('cors')
const port = process.env.PORT || 8000;
require('dotenv').config()

// Middleware
app.use(cors())
app.use(express.json())

// MongoDB Setup

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fkarqx9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const db = client.db('careerCodeDB');
    const jobCollection = db.collection('jobs');
    const applicationsCollection = db.collection('applications');

    app.get('/', (req, res) => {
    res.send('Welcome to Career Code Server')
    } )

// ---------- Jobs Api -------------------

    // Post Job
    app.post('/jobs', async (req, res) => {
      const newJob = req.body;
      const result = await jobCollection.insertOne(newJob);
      res.send(result);
    })

    // Get All Jobs
    app.get('/jobs', async (req, res) => {
      const email = req.query.email;
      const query = {};
      if (email) {
        query.hr_email = email;
      }
      const result = await jobCollection.find(query).toArray();
      res.send(result)
    })

    // Get one Job
    app.get('/jobs/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await jobCollection.findOne(query);
      res.send(result)
    })

  // ------------ Applications Api -------------------

  // Post
  app.post('/applications', async (req, res) => {
    const applicationData = req.body;
    const result = await applicationsCollection.insertOne(applicationData);
    res.send(result)
  } )

// Get 
app.get('/applications', async (req, res) => {
  const email = req.query.email;
  const query = {};
  if (email) {
    query.email = email;
  }
  const result = await applicationsCollection.find(query).toArray();
  res.send(result)
} ) 



// Get Job Applications
app.get('/applications/job/:job_id', async (req, res) => {
  const id = req.params.job_id;
  const query = {jobId: id}  
  const result = await applicationsCollection.find(query).toArray();
  res.send(result)
})

// Update a data 
app.patch('/applications/:id', async (req, res) => {
  const id = req.params.id;
  const filter = { _id: new ObjectId(id) };
  const updateData = req.body.status;
  const updatedDoc = {
    $set: {
      status : updateData, 
    }
  }
  const result = await applicationsCollection.updateOne(filter, updatedDoc);
  res.send(result)
})


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.listen(port, ()=>{
    console.log('App is Running on Port :', port);
    
})