const mongoose = require('mongoose');

//users data format gonna store in DB,this file under models folder

//

const BookSchema = mongoose.Schema({
	    id:{
            type:Number,

        },

		title: {
            type :String,
            required:[true,'title required']
        },

        inventory_count:{type : Number,
            min: 0,
            required:[true,'Number required']},
        
        date:{ type: Date ,default:Date.now},

        chatroom:{
            type:String,
        }

});



//the collection on DB name:books
module.exports =mongoose. model('Books',BookSchema);
