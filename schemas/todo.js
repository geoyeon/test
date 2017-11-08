'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const STATUS = ['TODO','IN_PROGRESS','DONE'];
const CONTEXT = ['NONE','WORK','HOME'];
const database = require('./database');
mongoose.Promise = global.Promise;

const todoSchema = new Schema({
    title:{type:String,required:true},
    status:{type:String,required:true,default:'TODO',enum: STATUS },
    context:{type:String,required:true,default:'NONE',enum:CONTEXT},
    dueDate:{type:Date},
    createdAt:{type:Date,required:true,default:Date.now},
    doneAt:{type:Date}
});

module.exports = database.model('todo', todoSchema);
module.exports.STATUS = STATUS;
module.exports.CONTEXT = CONTEXT;