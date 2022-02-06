function a() {}

console.log(typeof a); // function

var date = new Date();
var error = new Error();
console.log(typeof date); // object
console.log(typeof error); // object

// 以下是11种：
var number = 1; // [object Number]
var string = "123"; // [object String]
var boolean = true; // [object Boolean]
var und = undefined; // [object Undefined]
var nul = null; // [object Null]
var obj = { a: 1 }; // [object Object]
var array = [1, 2, 3]; // [object Array]
var date = new Date(); // [object Date]
var error = new Error(); // [object Error]
var reg = /a/g; // [object RegExp]
var func = function a() {}; // [object Function]

function checkType() {
  for (var i = 0; i < arguments.length; i++) {
    console.log(Object.prototype.toString.call(arguments[i]));
  }
}

checkType(
  number,
  string,
  boolean,
  und,
  nul,
  obj,
  array,
  date,
  error,
  reg,
  func
);

console.log(Object.prototype.toString.call(Math)); // [object Math]
console.log(Object.prototype.toString.call(JSON)); // [object JSON]

function a() {
  console.log(Object.prototype.toString.call(arguments)); // [object Arguments]
}
a();
