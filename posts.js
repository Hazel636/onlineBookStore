const express = require('express');

const router = express.Router();


router.get('/user',(req,res) => {
	res.send("Hello");
});


router.get('/book',(req,res) => {
	res.send("Hellobook");
});



module.express =router;