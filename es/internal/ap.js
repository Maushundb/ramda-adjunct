import { ap as apR, curryN, pathSatisfies, both, either } from 'ramda';
import isFunction from '../isFunction';
import fl from '../fantasy-land/mapping';
var isFunctor = either(pathSatisfies(isFunction, ['map']), pathSatisfies(isFunction, [fl.map]));
var isApply = both(isFunctor, either(pathSatisfies(isFunction, ['ap']), pathSatisfies(isFunction, [fl.ap])));
var ap = curryN(2, function (applyF, applyX) {
  // return original ramda `ap` if not Apply spec
  if (!isApply(applyF) || !isApply(applyX)) {
    return apR(applyF, applyX);
  }

  try {
    // new version of `ap` starting from ramda version > 0.23.0
    return applyF.ap(applyX);
  } catch (e) {
    // old version of `ap` till ramda version <= 0.23.0
    return applyX.ap(applyF);
  }
});
export default ap;