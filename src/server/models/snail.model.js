'use strict';

const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const snailLogSchema = new Schema({
  id: Schema.ObjectId,
  snailLog: [
    {
      c: { type: Date, required: true },
      h: { type: Number, required: true },
      u: { type: Number, required: true },
      d: { type: Number, required: true },
      f: { type: Number, required: true }
    }
  ]
});

snailLogSchema.set('toJSON', {
  getters: true,
  virtuals: true
});

module.exports = mongoose.model('snailLogSchema', snailLogSchema);
