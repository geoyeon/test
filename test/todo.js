'use strict';

const should = require('should');
const sinon = require('sinon');
//require('sinon-mongoose');

describe('TODO TEST',()=> {

    const sandbox = sinon.sandbox.create();

    let mongoose;
    let todoSchema;
    let todoLogic;

    let findStub,findStub2,findStub3,findStub4;

    before(function () {
        mongoose = require('mongoose');
        mongoose.on = () => {
        };
        mongoose.createConnection = () => mongoose;
        todoSchema = require('../schemas/todo');
        todoLogic = require('../logic/todoLogic');
    });

    beforeEach(() => {
        findStub = sandbox.stub(todoSchema, 'find').returns(
        {
            exec: () => (Promise.resolve([{
                "_id": "59fc0164ac8fa42aff30970c",
                "title": "Test1",
                "__v": 0,
                "doneAt": "2017-11-07T04:50:32.000Z",
                "createdAt": "2017-11-03T05:40:52.011Z",
                "context": "NONE",
                "status": "DONE"
            }])),
        });

        findStub2 = sandbox.stub(todoSchema.prototype,'save').returns(
               Promise.resolve({"_id": "59fc0164ac8fa42aff30970c",
                "title": "Test1",
                "__v": 0,
                "doneAt": "2017-11-07T04:50:32.000Z",
                "createdAt": "2017-11-03T05:40:52.011Z",
                "context": "NONE",
                "status": "DONE"})
        );

        findStub3 = sandbox.stub(todoSchema, 'findById').returns(
        {
            exec: () => (Promise.resolve([{
                "_id": "59fc0164ac8fa42aff30970c",
                "title": "Test1",
                "__v": 0,
                "doneAt": "2017-11-07T04:50:32.000Z",
                "createdAt": "2017-11-03T05:40:52.011Z",
                "context": "NONE",
                "status": "DONE"
            }])),
        });

        findStub4 = sandbox.stub(todoSchema, 'findByIdAndRemove').returns(
            {
                exec: () => (Promise.resolve([{
                    "_id": "59fc0164ac8fa42aff30970c",
                    "title": "Test1",
                    "__v": 0,
                    "doneAt": "2017-11-07T04:50:32.000Z",
                    "createdAt": "2017-11-03T05:40:52.011Z",
                    "context": "NONE",
                    "status": "DONE"
                }])),
            });
    });

    afterEach(() => {
        sandbox.restore();
    });

    after(() => {
        sandbox.restore();
    });

    describe('GET /todo', function () {
        it('조건 없이 todo 검색', () => {
            const body = {};

            //return callback({}).should.eventually.have.keys(['items','totalCount']);
            //console.log(callback(body));
            const promise = todoLogic.searchTodo(body);

            const expectedArgs = {};

            return promise.should.fulfilled().then(() => {
                findStub.calledOnce.should.be.true();
                findStub.getCall(0).args[0].should.deepEqual(expectedArgs);
            });
        });

        it('생성 일자로 todo 검색', () => {
            //const callback = sinon.spy(todoLogic,"searchTodo");

            const body1 = {startCreatedAt: '2017-11-01', endCreatedAt: '2017-11-30'};

            const promise = todoLogic.searchTodo(body1);

            const expectedConditaion = {
                createdAt: {
                    $gte: new Date('2017-11-01T00:00:00+09:00'),
                    $lte: new Date('2017-11-30T00:00:00+09:00'),
                }
            };

            return promise.should.be.fulfilled().then(() => {
                findStub.calledOnce.should.be.true();
                findStub.getCall(0).args[0].should.deepEqual(expectedConditaion);
            });
        });

        it('생성 일자로 todo 검색 - 시작과 종료 반대로(Error)', () => {
            // const callback = sinon.spy(todoLogic,"searchTodo");

            const body = {startCreatedAt: '2017-11-30', endCreatedAt: '2017-11-01'};

            const promise = todoLogic.searchTodo(body);

            return promise.should.rejectedWith(Error, {
                message: 'Wrong Date Order',
            }).then(() => {
                findStub.notCalled.should.be.true();
            });
        });

        it('제목으로 todo 검색', () => {
            const body3 = {title: 'test'};

            const promise = todoLogic.searchTodo(body3);

            const expectedCondition = {title: /test/ };


            return promise.should.be.fulfilled().then(() => {
                findStub.calledOnce.should.be.true();
                findStub.getCall(0).args[0].should.deepEqual(expectedCondition);
            })
        });

        it('status로 검색',()=>
        {
            const body4 = {status:'TODO'};

            const promise = todoLogic.searchTodo(body4);

            const expectedCondition = {status:'TODO'};

            return promise.should.be.fulfilled()
            .then(()=>{
                findStub.calledOnce.should.be.true();
                findStub.getCall(0).args[0].should.deepEqual(expectedCondition);
            });

        });

        it('정의 되지 않은 status로 검색',()=>
        {
           const body5 = {status:'TOODOIN'};

            //(function(){callback(body5)}).should.throw('Wrong Status');
            const promise = todoLogic.searchTodo(body5);

            //const expectedCondition = {status:/TODOIN/};

            return promise.should.rejectedWith(Error,{message:'Wrong Status'})
            .then(()=>{
               findStub.notCalled.should.be.true();
            });
        });

        it('context로 검색',()=>
        {
           const body6 = {context:'NONE'};

           const promise = todoLogic.searchTodo(body6);

           const expectedCondition = {context:'NONE'};

           return promise.should.be.fulfilled()
            .then(()=>{
               findStub.calledOnce.should.be.true();
               findStub.getCall(0).args[0].should.deepEqual(expectedCondition);
           })
        });

        it('정의 되지 않은 context로 검색',()=>
        {
           const body7 = {context:'COMPANY'};

           const promise = todoLogic.searchTodo(body7);

           return promise.should.rejectedWith(Error,{message:'Wrong Context'})
           .then(()=>{
              findStub.notCalled.should.be.true();
           });

            //(function(){callback(body7)}).should.throw('Wrong Context');
        });
    });

    describe('POST /todo',()=>
    {
       it('정상 입력',()=>
       {
          const body = {title:'테스트 코드 작성 테스트',status:'TODO',context:'WORK'};

          const promise = todoLogic.inputTodo(body);

          return promise.should.be.fulfilled()
           .then(()=>{
              findStub2.calledOnce.should.be.true();
          });
       });

       it('title 없이',()=>
       {
          const body1 = {tile:'테스트 코드 작성 테스트',status:'TODO',context:'WORK'};

          const promise = todoLogic.inputTodo(body1);

          return promise.should.be.rejectedWith('Title is Required')
           .then(()=>{
              findStub2.notCalled.should.be.true();
          });

       });

       it('Status 잘못된 종류',()=>
       {
           const body2 = {title:'테스트 코드 작성 테스트',status:'TOO',context:'WORK'};

           const promise = todoLogic.inputTodo(body2);

           return promise.should.be.rejectedWith('Wrong Status Type')
           .then(()=>{
               findStub2.notCalled.should.be.true();
           });
       });

        it('Context 잘못된 종류',()=>
        {
            const body3 = {title:'테스트 코드 작성 테스트',status:'TODO',context:'WORKING'};

            const promise = todoLogic.inputTodo(body3);

            return promise.should.be.rejectedWith('Wrong Context Type')
            .then(()=>{
                findStub2.notCalled.should.be.true();
            });
        });
    });

    describe('GET /todo/:todoID',()=>
    {
        it('정상 조회',()=>
        {
           const todoID = '59fc0164ac8fa42aff30970c';

           const promise = todoLogic.searchTodoById(todoID);

           return promise.should.be.fulfilled()
            .then(()=>{
              findStub3.calledOnce.should.be.true();
              findStub3.getCall(0).args[0].should.be.deepEqual(todoID);
           });
        });

        it('todoID 없을시',()=>
        {
            const todoID = null;

            const promise = todoLogic.searchTodoById(todoID);

            return promise.should.be.rejectedWith('Wrong Id')
            .then(()=>{
                findStub3.notCalled.should.be.true();
            });
        });
    //
    //     after(function()
    //     {
    //         todoSchema.findById.restore();
    //     });
    });
    //
    describe('DELETE /todo/:todoID',()=>
    {
        it('정상 조회',()=>
        {
            const todoID = '59fc0164ac8fa42aff30970c';

            const promise = todoLogic.deleteTodo(todoID);

            return promise.should.be.fulfilled()
            .then(()=>{
               findStub4.calledOnce.should.be.true();
            });
        });

        it('todoID 없을시',()=>
        {
            const todoID = null;

            const promise = todoLogic.deleteTodo(todoID);

            return promise.should.be.rejectedWith('Wrong ID')
            .then(()=>{
                findStub4.notCalled.should.be.true();
            });
        });
    });

    describe('PUT /todo/:todoID', () => {
          //const callback = sinon.spy(todoLogic, "updateTodo");

        it('제목 수정', () => {
            const todoID = '59fc0164ac8fa42aff30970c';
            const body = {title: '수정'};
            const body2 = {title: '수정2'};

            /*findStub.returns({
                exec: () => Promise.resolve(null),
            });*/

            todoSchema.findById.restore();

            findStub = sandbox.stub(todoSchema,'findById').returns({
                exec: () => Promise.resolve(new todoSchema(body))
            });

            const promise = todoLogic.updateTodo(todoID, body2);

            return promise.should.fulfilled()
            .then(() => {
                findStub.calledOnce.should.be.true();
                findStub2.calledOnce.should.be.true();
            });

        });
    });
});