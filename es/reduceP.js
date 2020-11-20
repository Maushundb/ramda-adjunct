function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

import { curryN, reduce, length } from 'ramda';
import isUndefined from './isUndefined';
import resolveP from './resolveP';
import allP from './allP';
/* eslint-disable max-len */

/**
 * Given an `Iterable`(arrays are `Iterable`), or a promise of an `Iterable`,
 * which produces promises (or a mix of promises and values),
 * iterate over all the values in the `Iterable` into an array and
 * reduce the array to a value using the given iterator function.
 *
 * If the iterator function returns a promise, then the result of the promise is awaited,
 * before continuing with next iteration. If any promise in the array is rejected or a promise
 * returned by the iterator function is rejected, the result is rejected as well.
 *
 * If `initialValue` is `undefined` (or a promise that resolves to `undefined`) and
 * the `Iterable` contains only 1 item, the callback will not be called and
 * the `Iterable's` single item is returned. If the `Iterable` is empty, the callback
 * will not be called and `initialValue` is returned (which may be undefined).
 *
 * This function is basically equivalent to {@link http://bluebirdjs.com/docs/api/promise.reduce.html|bluebird.reduce}.
 *
 * @func reduceP
 * @memberOf RA
 * @since {@link https://char0n.github.io/ramda-adjunct/1.13.0|v1.13.0}
 * @category List
 * @typedef MaybePromise = Promise.<*> | *
 * @sig ((Promise a, MaybePromise b) -> Promise a) -> MaybePromise a -> MaybePromise [MaybePromise b] -> Promise a
 * @param {Function} fn The iterator function. Receives two values, the accumulator and the current element from the list
 * @param {*|Promise.<*>} acc The accumulator value
 * @param {Array.<*>|Promise.<Array<*|Promise.<*>>>} list The list to iterate over
 * @return {Promise} The final, accumulated value
 * @see {@link http://ramdajs.com/docs/#reduce|R.reduce}, {@link RA.reduceRightP|reduceRightP}, {@link http://bluebirdjs.com/docs/api/promise.reduce.html|bluebird.reduce}
 * @example
 *
 * RA.reduceP(
 *   (total, fileName) => fs
 *     .readFileAsync(fileName, 'utf8')
 *     .then(contents => total + parseInt(contents, 10)),
 *   0,
 *   ['file1.txt', 'file2.txt', 'file3.txt']
 * ); // => Promise(10)
 *
 * RA.reduceP(
 *   (total, fileName) => fs
 *     .readFileAsync(fileName, 'utf8')
 *     .then(contents => total + parseInt(contents, 10)),
 *   Promise.resolve(0),
 *   ['file1.txt', 'file2.txt', 'file3.txt']
 * ); // => Promise(10)
 *
 * RA.reduceP(
 *   (total, fileName) => fs
 *     .readFileAsync(fileName, 'utf8')
 *     .then(contents => total + parseInt(contents, 10)),
 *   0,
 *   [Promise.resolve('file1.txt'), 'file2.txt', 'file3.txt']
 * ); // => Promise(10)
 *
 * RA.reduceP(
 *   (total, fileName) => fs
 *     .readFileAsync(fileName, 'utf8')
 *     .then(contents => total + parseInt(contents, 10)),
 *   0,
 *   Promise.resolve([Promise.resolve('file1.txt'), 'file2.txt', 'file3.txt'])
 * ); // => Promise(10)
 *
 */

/* esline-enable max-len */

var reduceP = curryN(3, function (fn, acc, list) {
  return resolveP(list).then(function (iterable) {
    var listLength = length(iterable);

    if (listLength === 0) {
      return acc;
    }

    var reducer = reduce(function (accP, currentValueP) {
      return accP.then(function (previousValue) {
        return allP([previousValue, currentValueP]);
      }).then(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            previousValue = _ref2[0],
            currentValue = _ref2[1];

        if (isUndefined(previousValue) && listLength === 1) {
          return currentValue;
        }

        return fn(previousValue, currentValue);
      });
    });
    return reducer(resolveP(acc), iterable);
  });
});
export default reduceP;