var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BookSchema = new Schema({
  title: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'Author', required: true },
  summary: { type: String, required: true },
  isbn: { type: String, required: true },
  genre: [{ type: Schema.Types.ObjectId, ref: 'Genre' }],
  status: { 
    type: String, 
    required: true, 
    enum: ['available', 'loaned', 'reserved'],
    default: 'available'
  },
  due_back: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Book', BookSchema);