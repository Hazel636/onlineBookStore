//mongodb url
var url ="mongodb+srv://Ying:Ying@cluster0.pityl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

const express =require('express');
const app =express();
const port=8889;

const http = require('http');
const socketio = require('socket.io');
const server = http.createServer(app);
const io = socketio(server);
const {userJoin} = require('./chatusers');

const mongoose = require('mongoose');
const cors =require('cors');
app.use(express.urlencoded({extended:true,limit:'50mb'}))

function wrapMessage(username,text){
    return{username,text};
  }

//const username = 'defaultUser';

io.on('connection', socket => {
    //console.log('connect');

    socket.on('joinRoom',({ username,room }) => {

        const user = userJoin(socket.id,username,room);


        //console.log(user);
        socket.join(user.room);

        //socket.emit('message',wrapMessage('Welcome to Chat room! ',user.username));
        socket.emit('message',wrapMessage('Chat Assistant',''+user.username+'，Welcome to Chat room! '));

        socket.broadcast.to(user.room).emit('message',wrapMessage('Chat Assistant','' +user.username+' just joined'));

        //socket.broadcast.to(user.room).emit('message',wrapMessage(user.username,' Just joined'));
        
        socket.on('chatMessage', (msg) =>{
            io.to(user.room).emit('message', wrapMessage(user.username,msg));
        })

        socket.on('disconnect',()=>{
           //io.to(user.room).emit('message',wrapMessage(user.username,' Just left'));
           io.to(user.room).emit('message',wrapMessage('Chat Assistant','' +user.username+' just left'));

            //socket.broadcast.to(user.room).emit('message',wrapMessage('Chat Assistant','' +user.username+' just left'));

       })
    




    })

});





const  expressHandlebars = require('express-handlebars');
app.engine('handlebars', expressHandlebars.engine({
    defaultLayout:'main',
    //////////
    partialsDir:'views/partials',
    helpers:{
        section:function(name,options){
            if(!this._sections) this._sections = {};
            this._sections[name] = options.fn(this);
            return null;
        }
}}));
app.set('view engine','handlebars');

//use bodyparser to generate json language
const bodyParser = require('body-parser');

//Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static('public'));


//Imports Routes
//users
const usersRoute = require('./routes/user');
app.use('/user',usersRoute);
const booksRoute = require('./routes/book');
app.use('/book',booksRoute);
const forumRoute = require('./routes/forum');
app.use('/forum',forumRoute);


//ROUTES   

app.get('/forum/:topic',(req,res)=>{
    const topic = req.params.topic;
    res.render('startchatview',{'topic':topic});
});

app.get('/forums/chat/',(req,res)=>{
    
    res.sendFile(__dirname+'/chat.html');
});

app.get('/',(req,res) => {
	res.render('homepageview');
});



app.use(function(req,res){
    res.status(404).render('404view');
});

//CONNECT TO DB

mongoose.connect(url,
	{useNewUrlParser: true },
	//()=> console.log('connect to DB')
	);

const db = mongoose.connection

db.on('error', (err) => { console.log('Database Connection Failed')})
    
db.on('open', () => { console.log('Database Connected')})


app.use((req, res) => {
    res.type('text/plain')
    res.status(404)
    res.send('404 - Not Found')
    })

//listen to server 
server.listen(port,() => {
	console.log(`listening on port ${port}`)


})

