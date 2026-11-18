import express from 'express'
import { MongoClient } from 'mongodb';
import 'dotenv/config'
import cors from 'cors'
//create express application
const app = express()
const PORT = 5000

app.use(cors())
app.use(express.json());

//connect mongodb
const client = new MongoClient(process.env.MONGODB_URI);

export async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("You successfully connected to MongoDB!");
    return client;
  } catch (err) {
    console.dir(err);
  }

}


const mongoClient = await connectToMongoDB();
//
const db = mongoClient.db("product-db");
const productCollection = db.collection("products");


app.post('/products',async(req,res)=>{
  //fontend e bole diyeche body te data pathabe so
  const data = req.body
  const result = await productCollection.insertOne(data);
  console.log(result);
  
  res.send(result)
  
})

// create api (kon route e gele ki pabe sheita)! (je receive korbe she ki pabe seitar method hocche get)
//Server-এর Root URL(/)-এ GET Request পাঠাবে, তখন এই Route কাজ করবে।
app.get('/', (req, res) => {
    res.send({msg:'Hello Backend'})
})

//(kon route e gele ki pabe sheita eikhane /about e gele ki pabe)
app.get('/author',(req,res)=>{
    res.send({author:'Tazbir Khan Prince'})
})

//http://localhost:8000/products
//server hishabe kaj kore , ekta address dibe ! server ta choltache kina sheita console e dekhabe
app.listen(PORT,()=>{
    console.log(`Server is running at ${PORT}`);
    
}) 
