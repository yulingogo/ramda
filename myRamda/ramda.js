var __ = {'@@functional/placeholder': true}; //占位符

function _isPlaceholder(a) {  //判断是否是占位符
  return a !== null &&
         typeof a === 'object' &&
         a['@@functional/placeholde'] === true
}

function _curry1(fn) {
  return function f1(a){
    if(arguments.length === 0 || _isPlaceholder(a)){ //参数不够或者是占位符就返回柯里化的函数，参数够了就返回函数执行结果。
      return f1;
    }else{
      return fn.apply(this, arguments);
    }
  }
}

function _curry2(fn) {
  return function f2(a,b){
    switch (arguments.length) { 
      case 0:
        return f2;
      case 1:
        return _isPlaceholder(a) ? f2
              : _curry1(function(_b) { return fn(a, _b)});
      default:
        return _isPlaceholder(a) && _isPlaceholder(b) ? f2
              : _isPlaceholder(a) ? _curry1(function(_a){ return fn(_a, b)})
              : _isPlaceholder(b) ? _curry1(function(_b) { return fn(a, _b)})
              : fn(a, b);
    }
  }
}

//根据函数的参数个数，返回一个接收n个参数的函数
function _arity(n, fn) {
  switch(n) {
    case 0: return function() { return fn.apply(this, arguments)};
    case 1: return function(a0) {return fn.apply(this, arguments)}; //返回一个接受一个参数的函数
    case 2: return function(a0, a1) { return fn.apply(this, arguments); };
    case 3: return function(a0, a1, a2) { return fn.apply(this, arguments); };
    case 4: return function(a0, a1, a2, a3) { return fn.apply(this, arguments); };
    case 5: return function(a0, a1, a2, a3, a4) { return fn.apply(this, arguments); };
    case 6: return function(a0, a1, a2, a3, a4, a5) { return fn.apply(this, arguments); };
    case 7: return function(a0, a1, a2, a3, a4, a5, a6) { return fn.apply(this, arguments); };
    case 8: return function(a0, a1, a2, a3, a4, a5, a6, a7) { return fn.apply(this, arguments); };
    case 9: return function(a0, a1, a2, a3, a4, a5, a6, a7, a8) { return fn.apply(this, arguments); };
    case 10: return function(a0, a1, a2, a3, a4, a5, a6, a7, a8, a9) { return fn.apply(this, arguments); };
    default: throw new Error('First argument to _arity must be a non-negative integer no greater than ten');
  }
}

/**
 * 
 * @param {Number} length 函数的参数个数
 * @param {}} received 之前已经接收的参数个数
 * @param {*} fn 函数
 */
function _curryN(length, received, fn) {
  return function() {
    var combined = []
  }
}