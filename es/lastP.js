function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

import { bind, last, map, curryN } from 'ramda';
import allP from './allP';
import lengthEq from './lengthEq';
import lengthGte from './lengthGte';
import rejectP from './rejectP';
import resolveP from './resolveP';
/**
 * Returns a promise that is fulfilled by the last given promise to be fulfilled,
 * or rejected with an array of rejection reasons if all of the given promises are rejected.
 *
 * @func lastP
 * @memberOf RA
 * @category Function
 * @since {@link https://char0n.github.io/ramda-adjunct/2.23.0|v2.23.0}
 * @sig [Promise a] -> Promise a
 * @param {Iterable.<*>} iterable An iterable object such as an Array or String
 * @return {Promise} A promise that is fulfilled by the last given promise to be fulfilled, or rejected with an array of rejection reasons if all of the given promises are rejected.
 * @see {@link RA.anyP|anyP}
 * @example
 *
 * const delayP = timeout => new Promise(resolve => setTimeout(() => resolve(timeout), timeout));
 * delayP.reject = timeout => new Promise((resolve, reject) => setTimeout(() => reject(timeout), timeout));
 * RA.lastP([
 *   1,
 *   delayP(10),
 *   delayP(100),
 *   delayP.reject(1000),
 * ]); //=> Promise(100)
 */

var lastP = curryN(1, function (iterable) {
  var fulfilled = [];
  var rejected = [];
  var onFulfill = bind(fulfilled.push, fulfilled);
  var onReject = bind(rejected.push, rejected);
  var listOfPromises = map(function (p) {
    return resolveP(p).then(onFulfill)["catch"](onReject);
  }, _toConsumableArray(iterable));
  return allP(listOfPromises).then(function () {
    if (lengthEq(0, fulfilled) && lengthEq(0, rejected)) {
      return undefined;
    }

    if (lengthGte(1, fulfilled)) {
      return last(fulfilled);
    }

    return rejectP(rejected);
  });
});
export default lastP;