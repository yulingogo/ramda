import _isPlaceholder from './_isPlaceholder';


/**
 * Optimized internal one-arity curry function.
 *
 * @private
 * @category Function
 * @param {Function} fn The function to curry.
 * @return {Function} The curried function.
 */
export default function _curry1(fn) { //参数只有一个的函数柯里化
  return function f1(a) {
    if (arguments.length === 0 || _isPlaceholder(a)) {  //传入的参数为空或者为占位符的时候返回柯里化的函数，否则返回函数执行结果。
      return f1;
    } else {
      return fn.apply(this, arguments);
    }
  };
}
