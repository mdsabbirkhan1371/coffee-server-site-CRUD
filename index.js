const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');



const app =express()
const port =process.env.Port||5000;

app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@coffee-master.7uufisy.mongodb.net/?retryWrites=true&w=majority&appName=Coffee-Master`;

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


    const coffeeCollection =client.db("CoffeeDB").collection("coffeeItem")

    // update section 

    // first part 
    // first get one element from db for update 
    app.get('/coffee/:id',async (req,res)=>{
      const id =req.params.id
      const query ={_id: new ObjectId(id)}
      const result = await coffeeCollection.findOne(query)
      res.send(result)
    })

    // second part 
    // second put method for update 
    
    app.put('/coffee/:id',async(req,res)=>{
        const id =req.params.id;
        const updateCoffee =req.body;
        const filter = {_id: new ObjectId(id)}
        const options= {upsert: true}

        const coffee ={
            $set:{
                name:updateCoffee.name,
                quantity:updateCoffee.quantity,
                supplier:updateCoffee.supplier,
                taste:updateCoffee.taste,
                category:updateCoffee.category,
                details:updateCoffee.details,
                photUrl:updateCoffee.photUrl

            }
        }

        const result = await coffeeCollection.updateOne(filter,coffee,options)

        res.send(result)

    })


    // second  part
    // get all coffee data from db and get method
    app.get('/coffee',async(req,res)=>{
      const cursor = coffeeCollection.find();
      const  result = await cursor.toArray();
      res.send(result)
    })


    // first part 
    // post coffee data or add coffee in server 
    app.post('/coffee', async(req,res)=>{
      const newCoffee =req.body;
      console.log(newCoffee)
      const result = await coffeeCollection.insertOne(newCoffee)
      res.send(result)
    })


    // third part
    // for delete item and find one 
    app.delete('/coffee/:id', async(req,res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await coffeeCollection.deleteOne(query)
        res.send(result)
    })


    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send('Coffee Server is Running')
})

app.listen(port,()=>{
    console.log(`Coffee Server Is Listening In Port ${port}`)
})