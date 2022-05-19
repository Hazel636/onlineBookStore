
const express = require('express');

const router = express.Router();
//call User file from models folder
const Book = require ('../models/Book');

//GET BACK ALL THE BOOK
router.get ('/', async (req,res) => {

	Book.find({}).lean().exec(function(err,Book) {
		if(err){
            res.render('resultview',{'resultmessage':err});
            return;
        }
        res.render('bookview',{'docs':Book});	
	});
});

//FORM of CREATE BOOK 

router.get('/createbook',async(req,res)=>{
	res.render('postbookview');
})

//CREATE BOOK
router.post('/createbook', async (req,res)=>{

	const bookcount = await Book.count();
	const post = new Book
	
	({
		id:bookcount+1,
		title:req.body.title,
		inventory_count:req.body.inventory_count,
		chatroom:'/forum/'+req.body.title,
	});
	
	try{

	const savedPost = await post.save();
	res.redirect(307,'/book/createsuccess');

	}catch(err){
		res.render('resultview',{'resultmessage':err});
	}

});

//CREATE SUCCESS PAGE

router.post('/createsuccess', async (req,res)=>{
	
	Book.find({title:req.body.title}).lean().exec(function (err,Book) {
		if(err){
				res.render('resultview',{'resultmessage':err});
			return;
		}

		res.render('bookview',{'docs':Book});
		
})
	
});



//FORM of SEARCH BOOK 

router.get('/searchbook',async(req,res)=>{
	res.render('searchbookview');

})




//SEARCH BOOK
router.get('/searchbookinfo', async (req,res)=>{
try{
	Book.find({id:req.query.id}).lean().exec(function (err,Book) {

		if(Book.length==0){
			res.render('resultview',{'resultmessage':'Book does not exist'});
		
		}
		else{
			res.render('bookview',{'docs':Book});
		}

})
}catch(err){
	res.render('resultview',{'resultmessage':'Input not valid'});
}
});




//FORM of DELETE BOOK 

router.get('/deletebook',async(req,res)=>{
	res.render('deletebookview');

})


//DELETE BOOK 
router.post('/deletebook', async (req,res)=>{

	try{
		if (((await Book.find ({id: req.body.id})).length)!=0){

			const removedPost = await Book.deleteOne({id: req.body.id});

			res.redirect(307,'/book/deletesuccess');

		}
		else{
			res.render('resultview',{'resultmessage':'Book does not exist'});

		return;
		}
		

    }catch(err){
    		res.render('resultview',{'resultmessage':'Input not valid'});

    }

});

//DELETE SUCCESS PAGE


router.post('/deletesuccess', async (req,res)=>{
	Book.find().lean().exec(function (err,Book) {
		if(err){
			res.render('resultview',{'resultmessage':err});
			return;
		}

		res.render('bookview',{'docs':Book});
	
	
})
})
	

//FORM OF UPDATE BOOK
router.get('/updatebook',async(req,res)=>{
	res.render('updatebookview');

})


//UPDATE BOOK

router.post('/updatebook', async (req,res)=>{
	try{
	const opts = { runValidators: true };
	const updatedPost = await Book.updateOne(
		{id:req.body.id},
		{ $set: {title: req.body.title,inventory_count: req.body.inventory_count}},
		opts

	);

res.redirect(307,'/book/updatesuccess');
	
	}catch(err){
    		res.render('resultview',{'resultmessage':'Input not valid'});

    }

});

//UPDATE SUCCESS PAGE
router.post('/updatesuccess', async (req,res)=>{
	
	Book.find({title:req.body.title}).lean().exec(function (err,Book) {
		if(Book.length==0){
			res.render('resultview',{'resultmessage':'Book does not exist'});
			return;
		}

		res.render('bookview',{'docs':Book});
})
	
});






module.exports= router;
