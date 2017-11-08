'use strict';

const moment = require('moment');
moment.locale('ko');
const _ = require('lodash');
const todoSchema = require('../schemas/todo');
const co = require('co');

//할 일 추가
const inputTodo = function(body) {
    return co(function* () {
        const input = {
            title: body.title,
            status: body.status,
            context: body.context,
            dueDate: body.dueDate,
            doneAt: body.doneAt
        };

        const todoItem = new todoSchema(input);

        return yield todoItem.save();
    });
}

//할 일 검색
const searchTodo = function(body)
{
    return co(function* ()
    {
        const search = yield makeSearch(body);

        const query = todoSchema.find(search);

        return yield query.exec();
    });

};

//할 일 아이디로 검색
const searchTodoById = function(todoID)
{
    return co(function* ()
    {
        let check = yield checkTodoID(todoID);

        const query = todoSchema.findById(todoID);

        return yield query.exec();
    });
};

//할 일 갱신
const updateTodo = function(todoID,body)
{
    return co(function* ()
    {
        try
        {
            let check = yield checkTodoID(todoID);

            const query = todoSchema.findById(todoID);

            const item = yield query.exec();

            if (!item) {
                let err = new Error("CAN NOT FIND");
                err.status = 400;
                return Promise.reject(err);
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

            if (!isMod) return Promise.reject(Error("No Change"));
            else
            {
                return yield item.save();
            }
        }
        catch(err)
        {
            throw err;
        }
    });
};

//할 일 삭제
const deleteTodo = function(todoID)
{
    return co(function* ()
    {
        let check = yield checkTodoID(todoID);

        const query = todoSchema.findByIdAndRemove(todoID);

        return yield query.exec();
    });
};

//todoID 체크
const checkTodoID = function(todoID)
{
    return new Promise(function(resolve,reject)
    {
        if (!_.isNil(todoID))
        {
            resolve(true);
        }
        else
        {
            let err = new Error("Wrong todoID");
            err.status = 400;
            reject(err);
        }
    });
};

//검색 만들기
const makeSearch = function(body)
{
    return new Promise(function(resolve,reject)
    {
        const search = {};

        if(body.title && body.title.length > 0) search.title = new RegExp(body.title);

        if (todoSchema.STATUS.indexOf(body.status) > -1)
        {
            search.status = body.status;
        }

        if(todoSchema.CONTEXT.indexOf(body.context) > -1)
        {
            search.context = body.context;
        }

        const dueDate = searchDate(body.startDueDate,body.endDueDate);
        const doneAt = searchDate(body.startDoneAt,body.endDoneAt);
        const createdAt = searchDate(body.startCreatedAt,body.endCreatedAt);

        if([dueDate,doneAt,createdAt].indexOf(-1) > -1)
        {
            let err = new Error('Wrong Date Order');
            err.status = 400;
            reject(err);
        }
        else
        {
            if (dueDate !== null) search.duedate = dueDate;
            if (doneAt !== null) search.doneAt = doneAt;
            if (createdAt !== null) search.createdAt = createdAt;

            resolve(search);
        }
    });
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
module.exports.searchTodoByid = searchTodoById;
module.exports.updateTodo = updateTodo;
module.exports.deleteTodo = deleteTodo;