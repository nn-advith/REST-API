const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB");

const articleSchema = {
  title: String,
  content: String
};

const Article = mongoose.model("Article", articleSchema);

/////////////////////////All Articles///////////////////////////////////

app.route("/articles")

.get(function(req, res){
    Article.find(function(err, foundArticles){
        if(!err){
            res.send(foundArticles);
        }else{
            res.send(err);
        }
        
    })
})

.post( function(req, res){

    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });

    newArticle.save((err)=>{
        if(!err){
            res.send("Added");
        }else{
            res.send(err);
        }
    });
})

.delete(function(req, res){
    Article.deleteMany(function(err){
        if(!err){
            res.send("success");
        }else{
            res.send(err);
        }
    })
});


/////////////////////////Individual Articles///////////////////////////////////

app.route("/articles/:title")

.get(function(req, res){
    
    Article.findOne({title: req.params.title}, function(err, fa){
        if(fa){
            res.send(fa);
        }else{
            res.send("NOne FOund");
        }
    })
})

.put(function(req, res){
    Article.updateOne(
        {title: req.params.title},
        {title: req.body.title, content: req.body.content},
        {overwrite: true},
        function(err){
            if(!err){
                res.send("Sucess Update");
            }else{
                res.send(err);
            }
        }
    )
})

.patch(function(req, res){
    Article.updateOne(
        {title: req.params.title},
        {$set: req.body},
        function(err){
            if(!err){
                res.send("Success udt");
            }else{
                res.send(err);
            }
        }
    )
})

.delete(function(req, res){
    Article.deleteOne(
        {title: req.params.title},
        function(err){
            if(!err){
                res.send("siccess");
            }else{
                res.send(err);
            }
        }
    )
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});