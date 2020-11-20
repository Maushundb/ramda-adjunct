function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

import { bind } from 'ramda';
import isIterable from '../../isIterable';
import isNotUndefined from '../../isNotUndefined';
import isNotNil from '../../isNotNil';
import isNotFunction from '../../isNotFunction';

var copyArray = function copyArray(items, mapFn, thisArg) {
  var boundMapFn = isNotUndefined(thisArg) ? bind(mapFn, thisArg) : mapFn;
  return isNotUndefined(mapFn) ? _toConsumableArray(items).map(boundMapFn) : _toConsumableArray(items);
};

var fromArray = function fromArray(items, mapFn, thisArg) {
  if (items == null) {
    throw new TypeError('Array.from requires an array-like object - not null or undefined');
  }

  if (isNotNil(mapFn) && isNotFunction(mapFn)) {
    throw new TypeError('Array.from: when provided, the second argument must be a function');
  }

  if (isIterable(items)) {
    return copyArray(items, mapFn, thisArg);
  }

  return [];
};

export default fromArray;