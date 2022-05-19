const express = require('express');

const router = express.Router();

//MODELS
const User = require ('../models/User');
const Book = require ('../models/Book');

//GET BACK ALL THE POST
router.get('/', async (req,res) => {

	User.find().lean().exec(function (err,doc) {
		if(err){
            res.render('resultview',{'resultmessage':err});
            return;
        }

		res.render('userview',{'docs':doc});

	
})
});

//FORM of CREATE USER
router.get('/createuser',async (req,res) => {
	res.render('postuserview');
})


//CREATE USER
router.post('/createuser', async (req,res)=>{
	
		const post = new User
		({
			username:req.body.username,
			phone:req.body.phone,
			borrowlimit:3
	
		});
		
		try{
	
		const savedPost = await post.save();
		res.redirect(307,'/user/createsuccess');
		

		
		}catch(err){
			res.render('resultview',{'resultmessage':err});
		}
	
	});

router.post('/createsuccess', async (req,res)=>{
	
	User.find({username:req.body.username}).lean().exec(function (err,User) {
		if(err){
				res.render('resultview',{'resultmessage':err});
			return;
		}

		res.render('userview',{'docs':User});
		
})
	
});

//FORM of SEARCH USER 
router.get('/searchuser',async(req,res)=>{
	res.render('searchuserview');

})

//SEARCH USER
router.get('/searchuserinfo', async (req,res)=>{
try{
	User.find({username:req.query.username}).lean().exec(function (err,User) {
		
		if(User.length==0){
				res.render('resultview',{'resultmessage':'User does not exist'});
			return;
		}
		res.render('userview',{'docs':User});
		
})
}catch(err){
	res.render('resultview',{'resultmessage':err});
}
});

//FORM of DELETE USER
router.get('/deleteuser',async(req,res)=>{
	res.render('deleteuserview');

})


//DELETE USER
router.post('/deleteuser', async (req,res)=>{


	try{
		if(((await User.find({username:req.body.username})).length)!=0){
		
		const removedPost = await User.deleteOne({username: req.body.username});

		res.redirect(307,'/user/deletesuccess');
	}
	else{
		res.render('resultview',{'resultmessage':'User does not exist'});
			return;
	}


    }catch(err){
		res.render('resultview',{'resultmessage':err});

    }

});

//DELETE SUCCESS PAGE


router.post('/deletesuccess', async (req,res)=>{
	
	
		User.find().lean().exec(function (err,User) {
		
		if(err){
			res.render('resultview',{'resultmessage':err});
			return;
		}	

		res.render('userview',{'docs':User});
	
	
	
})
})

//FORM OF UPDATE USER
router.get('/updateuser',async(req,res)=>{
	res.render('updateuserview');

})


//UPDATE USER

router.post('/updateuser', async (req,res)=>{
	try{
	const opts = { runValidators: true };
	const updatedPost = await User.updateOne(
		{username:req.body.username},
		{ $set: {phone: req.body.phone}},
		opts

	);
	

	res.redirect(307,'/user/updatesuccess');
	
	}catch(err){
    		res.render('resultview',{'resultmessage':err});

    }

});

//UPDATE SUCCESS PAGE
router.post('/updatesuccess', async (req,res)=>{
	try{
	User.find({username:req.body.username}).lean().exec(function (err,User) {
		if(User.length==0){
			res.render('resultview',{'resultmessage':'User does not exist'});
			return;
		}

		res.render('userview',{'docs':User});
})
}catch(err){
	res.render('resultview',{'resultmessage':err});
}
	
});



//form of userinfo
router.get('/userinfo',async (req,res) => {
	res.render('userinfoview');
})

//check userinfo
router.get('/checkuserinfo', async (req,res)=>{
	User.find({username:req.query.username}).lean().exec(function (err,doc) {
		if(err){
			res.render('resultview',{'resultmessage':err});
			return;
		}

		res.render('userview',{'docs':doc});
})
	
});










//form of borrowbook
router.get('/borrowbook',async (req,res) => {
	res.render('borrowview');
})


//BORROWING BOOK

router.post('/borrow', async (req,res)=>{

    const reqUser = req.body.username;
    const reqBook = req.body.id;

	try{
		const bookdata = await Book.find({id:reqBook});
        const inventory = bookdata[0].inventory_count;
        const booktitle = bookdata[0].title;
        const bookid = bookdata[0].id;
		const userdata = await User.find({username:reqUser});
		const ublimit = userdata[0].borrowlimit;
			

		if(inventory>0 && ublimit>0){
			const updateuser = await User.findOneAndUpdate(
				{username:reqUser},
				{$push:{borrowedBook:booktitle,borrowedid:bookid},
				$inc:{borrowlimit:-1}},{new:true});
				
			const updatebook = await Book.findOneAndUpdate(
				{id:reqBook},
				{$inc:{inventory_count:-1}},{new:true});
			
			res.render('1resultview',{'resultmessage':'Successfully borrowed book ：' + '《'+ booktitle+ '》'});
			
		}else if(inventory<=0){
			res.render('resultview',{'resultmessage':'This book is out of stock'});
		}else if(ublimit<=0){
			res.render('resultview',{'resultmessage':'Reach your borrowing limit (3)'});
		}

    }catch(err){
    	res.render('resultview',{'resultmessage':'Username or Book ID does not exist'});
    }
});



//form of return book
router.get('/returnbook',async (req,res) => {
	res.render('returnview');
})

//RETURNNING BOOK

router.post('/return', async (req,res)=>{
    const reqUser = req.body.username;
    const reqBook = req.body.id;
    
    try{

        const bookdata = await Book.find({id:reqBook});
        const inventory = bookdata[0].inventory_count;
        const booktitle = bookdata[0].title;
        const bookid = bookdata[0].id;
        const userdata = await User.find({username:reqUser});
        const ublimit = userdata[0].borrowlimit;

        const iffind = User.find({username:reqUser,borrowedid: bookid});

		if((await iffind).length==0){
			res.render('resultview',{'resultmessage':'User does not exist or has not borrowed this book'});
			return;
			}

        const returnuser = await User.findOneAndUpdate(
		           {username:reqUser},
			      {$pull:{borrowedBook:booktitle,borrowedid:bookid},
				      $inc:{borrowlimit:+1}},{new:true});
		const returnbook = await Book.findOneAndUpdate(
			      {id:reqBook},
			      {$inc:{inventory_count:+1}},{new:true});
		res.render('1resultview',{'resultmessage':'Successfully returned book :' + '《'+booktitle+ '》'});
    
    }catch(err){
    	res.render('resultview',{'resultmessage':'User does not exist or has not borrowed this book'});
    }

});
       

//FORM OF BORROWED BOOK
router.get('/borrowinfo',async (req,res) => {
	res.render('borrowinfoview');
})

//BORROWED BOOKS
router.get('/userborrowed', async (req,res)=>{
	try{
		 User.find({username:req.query.username}).lean().exec(function (err,User) {
			if( User.length==0){
				res.render('resultview',{'resultmessage':'User does not exist'});
				return;
			}
			else{
			var bbooktitle = User[0].borrowedBook;
			res.render('ubookview',{'docs':bbooktitle});
		}
		})
	}catch(err){
		res.render('resultview',{'resultmessage':err});
	}
	})



module.exports =router;