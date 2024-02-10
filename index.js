const express = require('express')
require('./db/config')
const User = require('./db/Users')
const Product=require('./db/Products')
const cors = require('cors')
require('dotenv').config();

const app = express();
app.use(cors())
app.use(express.json());
port=process.env.PORT

app.post('/register', async (req, resp) => {
    try {
        let user = new User(req.body);
        let result = await user.save();
        result = result.toObject();
        delete result.password
        resp.send(result)
    }
    catch
    {
        resp.send({ error: 'An error occurred while processing your request.' })
        console.log(error)

    }

})

app.post('/login', async (req, resp) => {

    if (req.body.password && req.body.email) {
        let user = await User.findOne(req.body).select("-password");
        if (user) {
            resp.send(user)
        }
        else {
            resp.send({ result: "No user found" })
        }
    }
    else {
        resp.send({ result: "Please enter the valid details" })
    }

})


app.post('/product', async (req, resp) => {
    try {
        let product = new Product(req.body);
        let result = await product.save();
        resp.send(result)
    }
    catch
    {
        resp.send({ error: 'An error occurred while processing your request.' })
        console.log(error)

    }

})

app.get('/product', async(req, resp)=>{
    let products=await Product.find();

    if(products.length>0)
    {
        resp.send(products)
    }
    else{
        resp.send({result:"No product found"})
    }
})

app.delete('/product/:_id', async(req, resp)=>{
    let result=await Product.deleteOne({_id: req.params._id})
    resp.send(result)
})

app.put('/product/:id',async(req,resp)=>{
    let result=await Product.updateOne(
        {_id:req.params.id},
        {
            $set: req.body
        }
    )
    resp.send(result)
})

app.get("/search/:key", async(req,resp)=>{
    let result=await Product.find({
        "$or":[
            {name:{$regex:req.params.key}},
            {company:{$regex:req.params.key}},
            {category:{$regex:req.params.key}}
        ]
    })
    resp.send(result)
})

app.get("/product/:id", async(req,resp)=>{
    let result=await Product.findOne({_id: req.params.id});
    if(result)
    {
        resp.send(result)
    }
    else
    {
        resp.send({result:"No record found"})
    }
})

app.listen(port, ()=>{
    console.log(`server is running on port ${port}`)
});