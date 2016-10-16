var express = require('express');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// define model =============
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TodoSchema = new Schema({
    text: String
});
var Todo = mongoose.model('Todo', TodoSchema);

module.exports = Todo;