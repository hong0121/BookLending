var express = require('express');
var router = express.Router();
var cors = require('cors');
var fs = require("fs");
var dummy = JSON.parse(fs.readFileSync("./public/book.json", "UTF8"));
// npm start 서버 홈 위치로부터
// console.log(dummy) // 정상 작동
// DB 구성 후 mongodb에서 받아와야 한다.

/* GET eBook API */
router.get('/', cors(), (req, res, next) => {
  // console.log(dummy);
  res.json(dummy);
  // res.send("port opened")
});

module.exports = router;
