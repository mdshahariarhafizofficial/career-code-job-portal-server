const express = require('express');
const app = express();
const port = process.env.PORT || 8000;

app.get('/', (req, res) => {
    res.send('Welcome to Career Code Server')
} )
app.listen(port, ()=>{
    console.log('App is Running on Port :', port);
    
})