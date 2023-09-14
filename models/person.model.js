const mongoose = require('mongoose');
const autoIncrement = require('mongoose-sequence')(mongoose);
const personSchema = mongoose.Schema({
  id: {
    type: Number,
    default: 0
  },
  name: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});
const Person = mongoose.model('personSchema', personSchema);

module.exports = Person;
