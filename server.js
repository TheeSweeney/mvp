var express = require('express');
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.json());
// Parse forms (signup/login)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname));

console.log(__dirname);


console.log('Shortly is listening on 8000');
app.listen(process.env.PORT || 8000);