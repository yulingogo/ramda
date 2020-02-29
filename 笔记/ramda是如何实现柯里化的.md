#### 1. 什么是柯里化

柯里化的意思是将一个多元函数，转换成一个依次调用的单元函数。

`curry`版本的`add`函数：

```javascript
var add = function(x){
  return function(y) {
    return x + y;
  }
}
```

这种形式的柯里化函数参数只能依次传入，add(1)(2)。与我们平常调用第三方库的柯里化函数的形式不同。`ramda`库的add函数还可以支持add(1,2)的形式。

#### 2. ramda库柯里化的特点

其实，这些库的`curry`函数都做了优化，我们可以称为高级柯里化。`ramda`库中的`curry`函数就可以根据我们的输入，返回一个柯里化的函数或者结果值。也即，如果我们给定的参数满足了函数条件，返回具体的结果值，不足则返回一个柯里化的函数。这样就可以避免只使用(a)(b)(c)的形式传参。

例如一个三个参数的函数柯里化的传参方式可以如下:

```javascript
cF(a)(b)(c)
cF(a,b)(c)
cF(a)(b,c)
cF(a,b,c)
```

为了在传入足够参数之后返回结果值，这需要我们知道传入部分参数返回的柯里化函数有几个参数。既可以得到一个确定参数个数的函数。

在`ramda`中，还有一个占位符的概念。即可以用占位符代替某个参数，先传入之后的参数，然后再在后续传参中补上这个参数。同样是三个参数的函数柯里化。

```javascript
cF(__,b,c)(a) //先用占位符代替a的位置，传入b,c，随后第二次传参传入a.
cF(__, __, c)(__, b)(a)
```

这种实现需要我们传入参数的位置必须和接受的参数位置保持一致。

那么`ramda`库实现柯里化的两个问题是：

+ 调用柯里化返回的函数无法确定函数参数的个数
+ 传入参数的位置必须可接受的参数位置保持一致

#### 3. 获取不到函数参数的个数问题

`ramda`函数中有一个`_arity`函数，这是一个内部的辅助函数，帮助我们得到一个确定参数个数的函数。

```javascript
function _arity(n, fn) {
  switch(n){
    case 0:
      return function() {return fn.apply(this, arguments)};
    case 1:
      return function(a0) {return fn.apply(this, arguments)};
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
```

有了这个函数，我们就可以实现柯里化后传入部分参数返回一个确定参数个数的函数。

```javascript
/**
* length:待柯里化函数的参数个数
* received:柯里化后的函数已接收的参数
* fn:待柯里化的函数
**/

function _curryN(length, received, fn) {
  return function() {
    var args = [].slice.call(arguments);
    var combined = received.concat(args);
    var left = length - combined.length;
    return left <= 0 ? fn.apply(this, combined) :
    									_arity(left,_curryN(length, combined, fn))
    //参数满足个数，返回结果值，不满足条件，返回一个确定参数个数的柯里化函数
  }
}
```

#### 4. 传入参数的位置与可接受的参数保持一致

先看看`ramda`中占位符的实现

```javascript
var __ = {'@@functional/placeholder': true}
```

`ramda`中判断参数是否为占位符的方法

```javascript
function _isPlaceholder(a) {
  return typeof a === 'object' && a != null
  	&& a['@@functional/placeholder'] === true
}
```



```javascript
function _curryN(length, received, fn) {
  return function() {
    var combined = [],
    		combinedIdx = 0,
        argxIdx = 0,
        left = length;
		while(combinedIdx <= received.length || argxIdx <= arguments.length){
       var result;
      if(combinedIdx <= received.length && !isPlaceholder(received[combinedIdx])){
        result = received[combinedIdx];
      }else{
        result = arguments(argsIdx);
        argxIdx++;
      }
      if(!isPlaceholder(result)){
        left --;
      }
      combined[combinedIdx] = result;
      combinedIdx ++
    }
    return left <= 0 ? fn.apply(this,combined) :
    	_arity(left, _curry(length, combined, fn));
  }
}
```

这样就可以实现使用占位符，先传入后续参数的功能。

#### 5. ramda柯里化的实现

```javascript
function curry(fn) {
  return fn.length === 1 ? _curry1(fn) :
  	_curryN(fn.length, [], fn)
}
```

`_curryN`函数主要是针对多参数时出现第一次传参只传入部分参数的问题，会返回一个带有确定参宿个数的柯里化函数。如果参数只有一个的话则不需要考虑这个问题。

以下是`_curry1`函数的实现。

```javascript
function _curry1(fn) {
  return function f1(a) {
    if(arguments.length === 0 || isPalceholder(a)) {
      return f1;
    }else{
      return fn.apply(this, arguments)
    }
  }
}
```

#### 6. ramda的其它柯里化函数

在`ramda`中还有几个内部的柯里化函数，包括前面的`_curry1`.

```javascript
function _curry2(fn) {
  return function f2(a,b){
    switch(arguments.length) {
      case 0: return f2;
      case 1: return isPlaceholder(a) ? f2 : function(_b){ return fn(a, _b)};
      case 2: return isPlaceholder(a) && isPlaceholder(b) ? f2 :
      	isPlaceholder(a) ? function(_a){return fn(_a, b)}:
      	isPlaceholder(b) ? function(_b){return fn(a, _b)} : 
      	fn.apply(this, arguments) 	
    }
  }
}
```

结合`_curry1`和`_curry2`，发现这两个函数的关注点也仍是

+ 参数的个数问题，参数不足则返回一个柯里化的函数（明确参数个数）
+ 参数对应问题。

通过解决这两个问题就可以实现一个柯里化函数。