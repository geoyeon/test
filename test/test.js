const should = require('should');
const sinon = require('sinon');

/*describe('Array',function()
{
   describe('#indexOf()',function()
   {
       it('should return -1 when the value is not present',function()
       {
           should.equal(-1,[1,2,3].indexOf(4));
       })
   });
});*/

function once(fn)
{
    var returnValue,called = false;
    return function()
    {
        if(!called)
        {
            called = true;
            returnValue = fn.apply(this,arguments);
        }

        return returnValue;
    };
}

it('calls the original function',function()
{
    var callback = sinon.spy();

    var proxy = once(callback);

    proxy();
    proxy();

    should(callback.calledOnce);
});

it('calls original function with right this and args',function()
{
   var callback = sinon.spy();
   var proxy = once(callback);
   var obj = {};

   proxy.call(obj,1,2,3);

   should(callback.calledOn(obj));
   should(callback.calledWith(1,2,3));
});

it('returns the return value form the original function',function()
{
   var callback = sinon.stub().returns(42);
   var proxy = once(callback);

    should.equal(proxy(),42);
});