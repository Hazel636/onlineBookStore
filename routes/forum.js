const express = require('express');

const router = express.Router();
//call User file from models folder
const Book = require ('../models/Book');


router.get('/',async(req,res) =>{
	Book.find({}).lean().exec(function(err,Book) {
		if(err){
            res.render('resultview',{'resultmessage':err});
            return;
        }
        res.render('forumview',{'docs':Book});	
	});
})



module.exports= router;