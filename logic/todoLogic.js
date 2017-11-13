'use strict';

const moment = require('moment');
moment.locale('ko');
const _ = require('lodash');
const todoSchema = require('../schemas/todo');

//할 일 추가
const inputTodo = function(body)
{
    if(_.isNil(body.title))
    {
        throw new Error('Title is Required');
    }

    if(!_.isNil(body.status) && todoSchema.STATUS.indexOf(body.status) < 0)
    {
        throw new Error('Wrong Status Type');
    }

    if(!_.isNil(body.context) && todoSchema.CONTEXT.indexOf(body.context) < 0)
    {
        throw new Error('Wrong Context Type');
    }

    const input = {
        title: body.title,
        status: body.status,
        context: body.context,
        dueDate: body.dueDate,
        doneAt: body.doneAt
    };

    const todoItem = new todoSchema(input);

    return todoItem.save();
};

//할 일 검색
const searchTodo = function(body)
{
    const search = makeSearch(body);

    if(search instanceof Error)
    {
        //throw new Error("Wrong Search Date");
        throw search;
        //return Promise.reject(search);
    }

    const query = todoSchema.find(search);

    return query.exec();
};

//할 일 아이디로 검색
const searchTodoById = function(todoID)
{
    if (!checkTodoID(todoID))
    {
        throw new Error("Wrong Id");
    }
    else
    {
        const query = todoSchema.findById(todoID);

        return query.exec();
    }
};

//할 일 갱신
const updateTodo = function(todoID,body)
{
    if(!checkTodoID(todoID))
    {
        throw new Error("Wrong Id");
    }
    else
    {
        const query = todoSchema.findById(todoID);

        query.exec()
        .then(function (item) {
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
                return item.save();
            }
        })
    }
};

//할 일 삭제
const deleteTodo = function(todoID)
{
    if(!checkTodoID(todoID))
    {
        throw new Error("Wrong ID");
    }
    else
    {
        const query = todoSchema.findByIdAndRemove(todoID);

        return query.exec();
    }
};

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

    if(start) searchDate.$gte = moment(start);
    if(end) searchDate.$lte = moment(end);

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