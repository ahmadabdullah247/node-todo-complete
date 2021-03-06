// required modules ======================================================================
var express = require('express');
var mongoose = require('mongoose');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

var port = process.env.PORT || 2000;
var Schema = mongoose.Schema;
var app = express();

// configuration =========================================================================
//mongoose.connect('mongodb://localhost:27017/tododb'); // connect to local mongoDB database 
mongoose.connect('mongodb://ahmad:123456@ds059316.mlab.com:59316/todo');

mongoose.connection.once('connected', function() {
    console.log("Connected to database")
});

app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users
app.use(morgan('dev')); // log every http request to the console
app.use(bodyParser.urlencoded({ 'extended': 'true' })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride()); //Lets you use HTTP verbs such as PUT or DELETE in places where the client doesn't support it.


// define model =========================================================================
var TodoSchema = new Schema({
    text: String
});
var Todo = mongoose.model('Todo', TodoSchema);

// routes (actions) ===============================================================================
// get all todos
app.get('/api/todos', function(req, res) {
    // use mongoose to get all todos in the database
    Todo.find(function(err, todos) {
        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err)
            res.send(err)
        res.json(todos); // return all todos in JSON format
    });
});
// create todo and send back all todos after creation
app.post('/api/todos', function(req, res) {
    // create a todo, information comes from AJAX request from Angular
    Todo.create({
        text: req.body.text
    }, function(err, todo) {
        if (err)
            res.send(err);
        // get and return all the todos after you create another
        Todo.find(function(err, todos) {
            if (err)
                res.send(err)
            res.json(todos);
        });
    });

});
// delete a todo
app.delete('/api/todos/:todo_id', function(req, res) {
    Todo.remove({
        _id: req.params.todo_id
    }, function(err, todo) {
        if (err)
            res.send(err);
        // get and return all the todos after you create another
        Todo.find(function(err, todos) {
            if (err)
                res.send(err)
            res.json(todos);
        });
    });
});

// view  ===============================================================================
app.get('*', function(req, res) {
    res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
});

// start server  ===============================================================================
app.listen(port);
console.log('Server listening on port :' + port);