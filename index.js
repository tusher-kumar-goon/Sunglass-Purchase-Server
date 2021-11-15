const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
require('dotenv').config()

const app = express()
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// connect to database
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.l9ihb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// function here
async function run() {
    try {
        await client.connect();
        const database = client.db('sunglassPurchase');
        const productsCollection = database.collection('products');


        // order confirm
        const orderCollection = database.collection('order');
        app.post('/orders', async (req, res) => {
            const orders = req.body;
            console.log('hit the post api', orders)
            const result = await orderCollection.insertOne(orders);
            console.log(result)
            res.json(result)
        });

        // get for order show in ui 
        app.get('/orders', async (req, res) => {
            const cursor = orderCollection.find({})
            const products = await cursor.limit(6).toArray()
            res.json(products)
        });



        // Get Api for get All product from db limit 6 for home
        app.get('/products', async (req, res) => {
            const cursor = productsCollection.find({})
            const products = await cursor.limit(6).toArray()
            res.json(products)
        });
        // explore page all product
        app.get('/allProducts', async (req, res) => {
            const cursor = productsCollection.find({})
            const products = await cursor.toArray()
            res.json(products)
        });

        // Get single Service
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting specific product', id);
            const query = { _id: ObjectId(id) };
            const product = await productsCollection.findOne(query)
            res.json(product);
        });

        //  POST API database insert product item for home
        app.post('/products', async (req, res) => {
            const product = req.body;
            console.log('hit the post api', product)


            const result = await productsCollection.insertOne(product);
            console.log(result)
            res.json(result)
        });

        // DELET API
        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productsCollection.deleteOne(query);
            res.json(result)
        });
        // delete singe order
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await orderCollection.deleteOne(query);
            res.send(result)
        });

        // rating post 
        const feedbackCollection = database.collection('feedback');
        app.post('/reviews', async (req, res) => {
            const feedback = req.body;
            console.log('hit the post api', feedback)
            const result = await feedbackCollection.insertOne(feedback);
            console.log(result)
            res.json(result)
        });

        // rating get 
        app.get('/reviews', async (req, res) => {
            const cursor = feedbackCollection.find({})
            const reviews = await cursor.toArray()
            res.json(reviews)
        });


    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello World!  sunglass')
});

app.listen(port, () => {
    console.log('Running sunglass server', port)
})