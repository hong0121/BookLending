//sudo mongod --port 27018 --dbpath ~/mongodb-data/db
const booksData = require('./books.json');
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var app = express(); // 이 부분을 추가해주세요.


var indexRouter = require('./routes/index');
var selectbookRouter = require('./routes/selectbook');
// var loginRouter = require('./routes/login');
var usersRouter = require('./routes/users');

const mongoose = require('mongoose');
const router = express.Router();
const Insertbook = require('./models/Insertbook'); // 모델 불러오기


// 접속관련 함수와 cors는 www파일에 있다.

// router.get('/', async (req, res) => {
//   try {
//     const books = await Book.find(); // 데이터베이스에서 모든 책을 가져옴
//     res.json(books); // JSON 형태로 응답
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });
// module.exports = router;

//mongoose connection1
// mongoose.connect('mongodb+srv://hong:zl7vXfxM1qv5rpaV@Cluster-Test-001/bprj?retryWrites=true&w=majority', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

//mongoose connection2
mongoose.connect('mongodb://localhost:27018/Cluster-Test-001', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected to MongoDB');
});

const documents = [booksData];

// insertbook
const insertData = async () => {
  try {
    const insertedDocuments = await Insertbook.insertMany(documents);
    console.log(`컬렉션에 ${insertedDocuments.length} 개의 문서가 추가되었습니다.`);
  } catch (error) {
    console.error(error);
  } finally {
    await mongoose.connection.close();
  }
}
insertData();

// 유저 정보를 담는 모델 정의
const User = mongoose.model('User', {
  username: String,
  password: String,
});

// /login 엔드포인트에서 POST 요청 처리
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // 데이터베이스에서 해당 유저 정보 조회
  const user = await User.findOne({ username, password });

  if (user) {
    // 유저가 존재하면 로그인 성공
    res.json({ success: true, message: 'Login successful' });
  } else {
    // 유저가 존재하지 않으면 로그인 실패
    res.json({ success: false, message: 'Login failed' });
  }
});

// app.listen(8080, () => {
//   console.log('Server is running on http://localhost:8080');
// });




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
