'use strict';

const co = require('co');
const moment = require('moment');
moment.locale('ko');
const _ = require('lodash');
const todoSchema = require('../schemas/todo');

//할 일 추가
const inputTodo = function(body)
{
    return new Promise(function(resolve,reject)
    {
        if (_.isNil(body.title)) {
            throw reject(new Error('Title is Required'));
        }

        if (!_.isNil(body.status) && todoSchema.STATUS.indexOf(body.status) < 0) {
            throw reject(new Error('Wrong Status Type'));
        }

        if (!_.isNil(body.context) && todoSchema.CONTEXT.indexOf(body.context) < 0) {
            throw reject(new Error('Wrong Context Type'));
        }

        const input = {
            title: body.title,
            status: body.status,
            context: body.context,
            dueDate: body.dueDate,
            doneAt: body.doneAt
        };

        const todoItem = new todoSchema(input);

        resolve(todoItem.save());
    });
};

//할 일 검색
const searchTodo = (body) => new Promise((resolve, rejected) =>
{
    const search = makeSearch(body);

    if(search instanceof Error)
    {
        //throw new Error("Wrong Search Date");
        throw rejected(search);
        //return Promise.reject(search);
    }

    const query = todoSchema.find(search);

    resolve(query.exec());
});

//할 일 아이디로 검색
const searchTodoById = (todoID) => new Promise((resolve,reject)=>
{
    if (!checkTodoID(todoID))
    {
        throw reject(new Error("Wrong Id"));
    }
    else
    {
        const query = todoSchema.findById(todoID);

        resolve(query.exec());
    }
});

//할 일 갱신
const updateTodo = (todoID, body) => co(function* ()
{
    if(!checkTodoID(todoID))
    {
        throw new Error("Wrong Id");
    }
    else
    {
        const query = todoSchema.findById(todoID);

        const item = yield query.exec();

        if (!item) {
            let err = new Error("CAN NOT FIND");
            err.status = 400;
            throw err;
        }

        let isMod = false;

        if (body.title && body.title !== item.title) {
            item.title = body.title;
            isMod = true;
        }

        if (body.status && todoSchema.STATUS.indexOf(body.status) > -1 && body.status !== item.status) {
            item.status = body.status;
            isMod = true;

            if (item.status === "DONE") item.doneAt = moment().format();
        }

        if (body.context && todoSchema.CONTEXT.indexOf(body.context) > -1 && body.context !== item.context) {
            item.context = body.context;
            isMod = true;
        }

        if (body.dueDate && body.dueDate !== item.dueDate) {
            item.dueDate = body.dueDate;
            isMod = true;
        }

        if (!isMod) throw new Error("No Change");
        else {
            const ret = yield item.save();
            //return item.save();
            return ret;
        }
    }
});

//할 일 삭제
const deleteTodo = (todoID) => new Promise((resolve,reject)=>
{
    if(!checkTodoID(todoID))
    {
        throw reject(new Error("Wrong ID"));
    }
    else
    {
        const query = todoSchema.findByIdAndRemove(todoID);

        resolve(query.exec());
    }
});

//todoID 체크
const checkTodoID = function(todoID)
{
    if (!_.isNil(todoID))
    {
        return true;
    }
    else
    {
        return false;
    }
};

//검색 만들기
const makeSearch = function(body)
{
    const search = {};

    if(body.title && body.title.length > 0) search.title = new RegExp(body.title);

    if(!_.isNil(body.status)) {
        if (todoSchema.STATUS.indexOf(body.status) > -1) {
            search.status = body.status;
        }
        else {
            return new Error('Wrong Status');
        }
    }

    if(!_.isNil(body.context)) {
        if (todoSchema.CONTEXT.indexOf(body.context) > -1) {
            search.context = body.context;
        }
        else {
            return new Error('Wrong Context');
        }
    }

    const dueDate = searchDate(body.startDueDate,body.endDueDate);
    const doneAt = searchDate(body.startDoneAt,body.endDoneAt);
    const createdAt = searchDate(body.startCreatedAt,body.endCreatedAt);

    if([dueDate,doneAt,createdAt].indexOf(-1) > -1)
    {
        /*let err = new Error('Wrong Date Order');
        err.status = 400;
        reject(err);*/

        return new Error('Wrong Date Order');
    }
    else
    {
        if (dueDate !== null) search.duedate = dueDate;
        if (doneAt !== null) search.doneAt = doneAt;
        if (createdAt !== null) search.createdAt = createdAt;

        return search;
    }
};

//날짜 검색
const searchDate = function(start,end)
{
    let searchDate = {};

    if(start) searchDate.$gte = moment(start).toDate();
    if(end) searchDate.$lte = moment(end).toDate();

    if((searchDate.$gte && searchDate.$lte) && searchDate.$gte > searchDate.$lte)
    {
        return -1;
    }
    else if(!(searchDate.$gte && searchDate.$lte))
    {
        return null;
    }
    else
    {
        return searchDate;
    }
};


module.exports.inputTodo = inputTodo;
module.exports.searchTodo = searchTodo;
module.exports.searchTodoById = searchTodoById;
module.exports.updateTodo = updateTodo;
module.exports.deleteTodo = deleteTodo;