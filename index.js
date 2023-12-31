const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

console.log(process.env.DB_PASSWORD)





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.87bzbwh.mongodb.net/?retryWrites=true&w=majority`;

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

    const bazarCollection = client.db('dhakaToy').collection('bazar');
    const addingToyCollection = client.db('dhakaToy').collection('addingToy')

    app.get('/bazar', async(req, res)=>{
        const cursor = bazarCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })

    app.get('/bazar/:id', async(req, res) =>{
        const id = req.params.id;
        const query = { _id: new ObjectId(id)}

        const options = {
            projection: { name:1, price: 1, picture:1, category:1, details:1},
        };
        const result = await bazarCollection.findOne(query, options);
        res.send(result);
    })

    app.get('/addingToy', async (req, res) =>{
        console.log(req.query.email);
        let query = {};
        if(req.query?.email) {
            query = {email: req.query.email}
        }
        const result = await addingToyCollection.find(query).toArray();
        res.send(result);
    })

    app.post('/addingToy', async(req, res) =>{
        const adding = req.body;
        console.log(adding);
        const result = await addingToyCollection.insertOne(adding);
        res.send(result);
    })

    app.patch('/addingToy/:id', async (req, res) =>{
      const id = req.params.id;
      const filter = { _id: new ObjectId(id)};
      const updatedToy = req.body;
      console.log(updatedToy);
      const updateDoc = {
        $set: {
          status: updatedToy.status
        },
      };
      const result = await addingToyCollection.updateOne(filter, updateDoc);
      res.send(result);
    })

    app.delete('/addingToy/:id', async (req, res) =>{
      const id = req.params.id;
      const query = { _id: new ObjectId(id)}
      const result = await addingToyCollection.deleteOne(query);
      res.send(result);
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


app.get('/', (req, res)=>{
    res.send('customer is buying toy from Dhaka Toy Bazar')
})

app.listen(port, ()=>{
    console.log(`Dhaka Toy Bazar is running on port ${port}`)
})