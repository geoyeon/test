const express = require('express');
const router = express.Router();
const moment = require('moment');
moment.locale('ko');
const co = require('co');

const todoLogic = require('../logic/todoLogicCo');
//할 일 입력
router.post('/todo',function(req,res,next)
{
    co(function* ()
    {
        try
        {
            const { body = {} } = req;

            const ret = yield todoLogic.inputTodo(body);

            res.send(ret);
        }
        catch(err)
        {
            next(err);
        }
    });
});

//할 일 조회
router.get('/todo',function(req,res,next)
{
    const { body = {} } = req;

    co(function* ()
    {
        try
        {
            const ret = yield todoLogic.searchTodo(body);

            const result = {items:ret,totalCount:ret.length};

            res.send(result);
        }
        catch(err)
        {
            next(err);
        }
    });
});

//할 일 상세 조회
router.get('/todo/:todoID',function(req,res,next)
{
    const { todoID } = req.params;

    co(function* ()
    {
        try
        {
            const ret = yield todoLogic.searchTodoByid(todoID);

            res.send(ret);
        }
        catch(err)
        {
            next(err);
        }
    });
});

//할 일 변경 요청
router.put('/todo/:todoID',function(req,res,next)
{
    const { todoID } = req.params;
    const { body = {} } = req;

    co(function* ()
    {
        try
        {
            const ret = yield todoLogic.updateTodo(todoID,body);

            res.send(ret);
        }
        catch(err)
        {
            next(err);
        }
    })
});

//할 일 삭제
router.delete('/todo/:todoID',function(req,res,next)
{
    const { todoID } = req.params;

    co(function* ()
    {
        try
        {
            const ret = yield todoLogic.deleteTodo(todoID);

            res.send(ret);
        }
        catch(err)
        {
            next(err);
        }
    });
});

module.exports = router;