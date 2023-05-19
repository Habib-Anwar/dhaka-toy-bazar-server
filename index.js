const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res)=>{
    res.send('customer is buying toy from Dhaka Toy Bazar')
})

app.listen(port, ()=>{
    console.log(`Dhaka Toy Bazar is running on port ${port}`)
})