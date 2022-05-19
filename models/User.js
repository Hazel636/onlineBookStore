const mongoose = require('mongoose');

//users data format gonna store in DB,this file under models folder

//

const UserSchema = mongoose.Schema({
	username:{

		type: String,
		index: true,
		unique: true,
		required:[true,'username required']
	},
	phone:{

        type: String,
        validate:{
            validator: function(pNumber){
                return /\d{3}-\d{3}-\d{4}$/.test(pNumber);
            },
            message: props => `${props.value} is not valid`
        },
        required:[true,'User phone number required']
    },
	borrowedBook:{

		type: Array,

	},
	borrowedid:{

		type: Array,

	},
	borrowlimit:{

		type: Number,
		min:0,
		max:[3,'Cannot borrow more than 3 books']

	},

});



//the collection on DB name:users
module.exports =mongoose. model('Users',UserSchema);
