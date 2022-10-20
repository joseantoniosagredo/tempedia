import type { RecursiveKeyOf } from "../ts/recursiveKeyOf";

const SPLIT_KEY = ".";
/**
 * recursive funcion
 * @param {Object | undefined} obj
 * @param {Array} array
 * @return {Array}
 */
function getFieldFromArray(
  obj: any,
  array: string[],
  initArray: string[]
): any[] {
  if (obj === undefined) {
    console.warn("obj is undefiend", initArray);
    if (array.length > 0) console.warn("WARN: fields", array, "not found");
    return [];
  }
  if (Array.isArray(obj)) {
    return obj.reduce(
      (arrayConcat, element) =>
        arrayConcat.concat(getFieldFromArray(element, array, initArray)),
      []
    );
  }
  if (array.length === 0) return [obj];
  const newArray = [...array];
  let key = newArray.shift();
  // validated key!== undefined in array.length===0
  return getFieldFromArray(obj[key!], newArray, initArray);
}
/**
 *
 * @param {Object} obj
 * @param {String} string
 * @param {String} splitKey default .
 */
export function getFieldFromString<
  T extends object,
  K extends string = typeof SPLIT_KEY
>(obj: T, string: RecursiveKeyOf<T, K>, splitKey: K = SPLIT_KEY as K) {
  const array = string.split(splitKey);
  return getFieldFromArray(obj, array, array);
}
