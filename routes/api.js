const express = require('express');
const router = express.Router();
const moment = require('moment');
moment.locale('ko');
//const mongoose = require('mongoose');
//mongoose.Promise = global.Promise;//생략가능
const todoLogic = require('../logic/todoLogic');

//할 일 입력
router.post('/todo',function(req,res,next)
{
    const { body = {} } = req;

    todoLogic.inputTodo(body)
    .then(function(ret)
    {
        res.send(ret);
    })
    .catch(function(err)
    {
        next(err);
    });
});


//할 일 조회
router.get('/todo',function(req,res,next)
{
    const { query = {} } = req;

    todoLogic.searchTodo(query)
    .then(function(ret)
    {
        const result = {items:ret,totalCount:ret.length};
        res.send(result);
    })
    .catch(function(err)
    {
        next(err);
    });
});

//할 일 상세 조회
router.get('/todo/:todoID',function(req,res,next)
{
    const { todoID } = req.params;

    todoLogic.searchTodoById(todoID)
    .then(function(ret)
    {
        res.send(ret);
    })
    .catch(function(err)
    {
        next(err);
    });
});

//할 일 변경 요청
router.put('/todo/:todoID',function(req,res,next)
{
    const { todoID } = req.params;
    const { body = {} } = req;

    todoLogic.updateTodo(todoID,body)
    .then(function(ret)
    {
        res.send(ret);
    })
    .catch(function(err)
    {
        next(err);
    });
});

//할 일 삭제
router.delete('/todo/:todoID',function(req,res,next)
{
    const { todoID } = req.params;
    
    todoLogic.deleteTodo(todoID)
    .then(function(ret)
    {
        res.send(ret);
    })
    .catch(function(err)
    {
        next(err);
    });

});

module.exports = router;