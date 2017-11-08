var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.query.num);

  let num = req.query.num;

  if(isNaN(num))
  {
    console.log("Not a Number");
  }
  else
  {
    for(let i=1;i<10;i++)
    {
      let gu_str = num + " * " + i + " = " + (num * i);

      console.log(gu_str);
    }
  }

   res.render('index', { title: 'Express' , num : num});
});

router.get('/test',function(req,res,next){
  console.log('Test');
  res.send('Test');
})

module.exports = router;