const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/test",{useMongoClient:true});
mongoose.Promise = global.Promise;

const db = mongoose.connection;

db.on("error",console.error.bind(console,"connection error:"));
db.once("open",function()
{
   console.log("Connect");
});

let kittySchema = mongoose.Schema({
    name:String
});

//let Kitten = mongoose.model('Kitten',kittySchema);

//let silence = new Kitten({name:'Silence'});
//console.log(silence.name);

kittySchema.methods.speak = function()
{
    let greeting = this.name
        ? "Meow name is " + this.name
        : "I don't have a name";
    console.log(greeting);
}

let Kitten = mongoose.model('Kitten',kittySchema);

let fluffy = new Kitten({name:'fluffy'});
fluffy.speak();

fluffy.save(function(err,fluffy)
{
   if(err) return console.error(err);
   fluffy.speak();
});

Kitten.find(function(err,kittens)
{
    if(err) return console.error(err);
    console.log(kittens);
});

Kitten.find({name:/^fluff/},function(err,kittens)
{
    if(err) return console.error(err);
    console.log(kittens);
});