'use strict';

const todoLogic = require('../logic/todoLogic');
const should = require('should');
const sinon = require('sinon');
const todoSchema = require('../schemas/todo');
//require('sinon-mongoose');

describe('GET /todo',function()
{
    before(function()
    {
        sinon.stub(todoSchema,'find').returns(
            {
                exec:sinon.stub().resolves([{
                    "_id": "59fc0164ac8fa42aff30970c",
                    "title": "Test1",
                    "__v": 0,
                    "doneAt": "2017-11-07T04:50:32.000Z",
                    "createdAt": "2017-11-03T05:40:52.011Z",
                    "context": "NONE",
                    "status": "DONE"
                }])
            });
    });

   const callback = sinon.spy(todoLogic,"searchTodo");

    it('조건 없이 todo 검색',()=>
   {
       const body = {};

       //return callback({}).should.eventually.have.keys(['items','totalCount']);
       //console.log(callback(body));
       callback(body)
       .then(function(ret)
       {
           ret.should.have.length(1);
       })
       .catch(function(err)
        {
            console.log(err);
        });
   });

   it('생성 일자로 todo 검색',()=>
   {
      //const callback = sinon.spy(todoLogic,"searchTodo");

      const body1 = {startCreatedAt:'2017-11-01',endCreatedAt:'2017-11-30'};

      callback(body1).should.eventually.have.Array();
   });

    it('생성 일자로 todo 검색 - 시작과 종료 반대로(Error)',()=>
    {
       // const callback = sinon.spy(todoLogic,"searchTodo");

        const body2 = {startCreatedAt:'2017-11-30',endCreatedAt:'2017-11-01'};

        (function(){callback(body2)}).should.throw('Wrong Date Order');
    });

    it('제목으로 todo 검색',()=>
    {
        const body3 = {title:'test'};

        callback(body3).should.resolved();
    });

    it('status로 검색',()=>
    {
        const body4 = {status:'TODO'};

        callback(body4).should.resolved();
    });

    it('정의 되지 않은 status로 검색',()=>
    {
       const body5 = {status:'TOODOIN'};

        (function(){callback(body5)}).should.throw('Wrong Status');
    });

    it('context로 검색',()=>
    {
       const body6 = {context:'NONE'};

       callback(body6).should.resolved();
    });

    it('정의 되지 않은 context로 검색',()=>
    {
       const body7 = {context:'COMPANY'};

        (function(){callback(body7)}).should.throw('Wrong Context');
    });
});

describe('POST /todo',()=>
{
    before(function()
    {
        sinon.stub(todoSchema.prototype,'save').returns(
        {
            then:sinon.stub().resolves({
                "_id": "59fc0164ac8fa42aff30970c",
                "title": "Test1",
                "__v": 0,
                "doneAt": "2017-11-07T04:50:32.000Z",
                "createdAt": "2017-11-03T05:40:52.011Z",
                "context": "NONE",
                "status": "DONE"
            })
        });
    });

   const callback = sinon.spy(todoLogic,"inputTodo");

   it('정상 입력',()=>
   {
      const body = {title:'테스트 코드 작성 테스트',status:'TODO',context:'WORK'};

      callback(body)
       .then(function(ret)
      {
         ret.should.have.key('title');
      });
   });

   it('title 없이',()=>
   {
      const body1 = {tile:'테스트 코드 작성 테스트',status:'TODO',context:'WORK'};

       (function(){callback(body1)}).should.throw('Title is Required');
   });

   it('Status 잘못된 종류',()=>
   {
       const body2 = {title:'테스트 코드 작성 테스트',status:'TOO',context:'WORK'};

       (function(){callback(body2)}).should.throw('Wrong Status Type');
   });

    it('Context 잘못된 종류',()=>
    {
        const body3 = {title:'테스트 코드 작성 테스트',status:'TODO',context:'WORKING'};

        (function(){callback(body3)}).should.throw('Wrong Context Type');
    });
});

describe('GET /todo/:todoID',()=>
{
    before(function()
    {
        sinon.stub(todoSchema,'findById').returns(
        {
            exec:sinon.stub().resolves({
                "_id": "59fc0164ac8fa42aff30970c",
                "title": "Test1",
                "__v": 0,
                "doneAt": "2017-11-07T04:50:32.000Z",
                "createdAt": "2017-11-03T05:40:52.011Z",
                "context": "NONE",
                "status": "DONE"
            })
        });
    });

    const callback = sinon.spy(todoLogic,"searchTodoById");

    it('정상 조회',()=>
    {
       const todoID = '59fc0164ac8fa42aff30970c';

       //callback(todoID).should.be.finally.have.keys('tle');
        callback(todoID)
        .then(function(ret)
        {
           ret.should.have.key('title');
        })
        .catch(function(err)
        {
            console.log(err);
        });
    });

    it('todoID 없을시',()=>
    {
        const todoID = null;

        (function(){callback(todoID)}).should.throw('Wrong Id');
    });

    after(function()
    {
        todoSchema.findById.restore();
    });
});

describe('DELETE /todo/:todoID',()=>
{
    before(function()
    {
        sinon.stub(todoSchema,'findByIdAndRemove').returns(
            {
                exec:sinon.stub().resolves({
                    "_id": "59fc0164ac8fa42aff30970c",
                    "title": "Test1",
                    "__v": 0,
                    "doneAt": "2017-11-07T04:50:32.000Z",
                    "createdAt": "2017-11-03T05:40:52.011Z",
                    "context": "NONE",
                    "status": "DONE"
                })
            });
    });

    const callback = sinon.spy(todoLogic,"deleteTodo");

    it('정상 조회',()=>
    {
        const todoID = '59fc0164ac8fa42aff30970c';

        //callback(todoID).should.be.finally.have.keys('tle');
        callback(todoID)
        .then(function(ret)
        {
            ret.should.have.keys('title');
        })
        .catch(function(err)
        {
            console.log(err);
        });
    });

    it('todoID 없을시',()=>
    {
        const todoID = null;

        (function(){callback(todoID)}).should.throw('Wrong ID');
    });
});

describe('PUT /todo/:todoID',()=>
{
    before(function()
    {
        const input = {title:'tnwjd'};

        const todoItem = new todoSchema(input);

        todoSchema.prototype.save.restore();

        sinon.stub(todoSchema,'findById').returns(
        {
            exec:sinon.stub().resolves(todoItem)
        });

        sinon.stub(todoItem,'save').returns(
        {
            then:sinon.stub().resolves({
                "_id": "59fc0164ac8fa42aff30970c",
                "title": "Test1",
                "__v": 0,
                "doneAt": "2017-11-07T04:50:32.000Z",
                "createdAt": "2017-11-03T05:40:52.011Z",
                "context": "NONE",
                "status": "DONE"
            })
        });
    });

    const callback = sinon.spy(todoLogic,"updateTodo");

    it('제목 수정',()=>
    {
        const todoID = '59fc0164ac8fa42aff30970c';
        const body = {title:'수정'};

        callback(todoID,body)
        .then(function(ret)
        {
           console.log(ret);
        });
    });
});