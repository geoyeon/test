const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let blogSchema = new Schema(
{
    title:String,
    author:String,
    body:String,
    comments:[{body:String,date:Date}],
    date:{type:Date,default:Date.now},
    hidden:Boolean,
    meta:{
        votes:Number,
        favs:Number
    }
});

let Blog = mongoose.model('Blog',blogSchema);