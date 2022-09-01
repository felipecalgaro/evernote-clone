const mongoose = require('mongoose');
mongoose.Promise = global.Promise

mongoose.connect('mongodb://localhost/javascriptNotes', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
}).then(() => console.log('connected to database'))
  .catch(err => console.log(err))