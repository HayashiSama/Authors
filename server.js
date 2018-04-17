// Require the Express Module
var express = require('express');
// Create an Express App
var app = express();
// Require body-parser (to receive post data from clients)
var bodyParser = require('body-parser');
// Integrate body-parser with our App
app.use(bodyParser.json());
// Require path
var path = require('path');
// Setting our Static Folder Directory

// Setting our Views Folder Directory
app.set('views', path.join(__dirname, './views'));
// Setting our View Engine set to EJS
app.set('view engine', 'ejs');
// Routes
// Root Request
app.use(express.static( __dirname + '/Authors/dist' ));


var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/authors');

var AuthorSchema = new mongoose.Schema({
    name: {type: String, required: true, minlength: 3}
}, {timestamps: true });

mongoose.model('Author', AuthorSchema)
var Author = mongoose.model('Author')

app.get('/authors', function(req, res) {
    Author.find({}, function(err, authors) {
        console.log(authors)
        if(err){
            res.json({message:"error", error: err})
        }
        else{
            res.json({message: "Success", data: authors})
        }
        
        
    }) 
})

app.post('/new', function(req, res){
	var newAuth = new Author(req.body);
	console.log("making new author");
	newAuth.save(function (err){
		if(err){
			console.log("error creating")
			res.json({message:"error creating"});
		}
		else{
			res.json({message:"Success", id: newAuth._id})
		}
	})
})

app.put('/edit', function(req, res){
	console.log("editing author")
	Author.findOne({_id: req.body.id}, function(err, author){
		console.log(author)
		author.name = req.body.name;
		author.save(function(err){
			if(err){
				console.log("error creating")
				res.json({message: err});
			}
			else{
				res.json({message:"Success", id: author._id})
			}
		})

	})
})

app.delete('/delete/:id', function(req, res){
	console.log("deleting author id: ", req.params.id)
	Author.remove({_id: req.params.id}, function(err){
		if(err){
			res.json({message: err})
		}
		else{
			res.json({message: "Success"})
		}
	})
})

app.all("*", (req,res,next) => {
  res.sendFile(path.resolve("./Authors/dist/index.html"))
});

app.listen(8000, function() {
    console.log("listening on port 8000");
})