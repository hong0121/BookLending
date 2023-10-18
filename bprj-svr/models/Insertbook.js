const mongoose = require('mongoose');

// Insertbook 모델 정의
const insertbookSchema = new mongoose.Schema({
  id: String,
  author: String,
  country: String,
  imageLink: String,
  language: String,
  link: String,
  pages: Number,
  title: String,
  year: Number,
});

const Insertbook = mongoose.model('Insertbook', insertbookSchema);

module.exports = Insertbook;
