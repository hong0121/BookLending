//sudo mongod --port 27018 --dbpath ~/mongodb-data/db
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var selectbookRouter = require('./routes/selectbook');
// var loginRouter = require('./routes/login');
var usersRouter = require('./routes/users');

const mongoose = require('mongoose');
const router = express.Router();
const Book = require('./models/book'); // 모델 불러오기

// 접속관련 함수와 cors는 www파일에 있다.

router.get('/', async (req, res) => {
  try {
    const books = await Book.find(); // 데이터베이스에서 모든 책을 가져옴
    res.json(books); // JSON 형태로 응답
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;

mongoose.connect('mongodb://localhost:27018/Cluster-Test-001', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected to MongoDB');
});


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
// selbook 라우터 추가
app.use('/selectbook', selectbookRouter);
// app.use('/login', loginRouter);
app.use('/users', usersRouter); // 대출한 도서 목록 등

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
