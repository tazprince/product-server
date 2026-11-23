import express from 'express'
import { MongoClient, ObjectId } from 'mongodb';
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

//ধরো, Frontend থেকে User Form Submit করেছে।
//অর্থাৎ Frontend-কে আমরা একটা Address দিচ্ছি, যেখানে সে Product-এর Data পাঠাতে পারবে।
//Frontend থেকে যে Data পাঠানো হয়েছে, Backend সেই Data গ্রহণ করছে।(req.body)
//এই Data-টা আমার products Collection-এ Insert করে দাও। (database)
//Database থেকে যে Result পেয়েছি, সেটি Backend-এর মাধ্যমে আবার Frontend-এ পাঠিয়ে দিচ্ছি।(res.send(result))
app.post('/products',async(req,res)=>{
  const data = req.body
  const result = await productCollection.insertOne(data);
  console.log(result);
  
  res.send(result)
  
})

app.get("/products", async (req, res) => {
  const result = await productCollection.find().toArray();

  res.send(result);
});

//single product (products/id )
app.get('/products/:id',async(req,res)=>{
  const {id} = req.params;
  const result = await productCollection.findOne({_id: new ObjectId(id)});
  res.send(result)
})
//edit or update 
app.patch("/products/:id", async (req, res) => {
  const data = req.body;
  const {id} = req.params

  const result = await productCollection.updateOne(
    {_id: new ObjectId(id)},
    {$set: data}
  )
  
  res.send(result);
});
//delete api
app.delete('/products/:id', async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await productCollection.deleteOne(query);
  res.send(result);
});


//create api (kon route e gele ki pabe sheita)! (je receive korbe she ki pabe seitar method hocche get)
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
