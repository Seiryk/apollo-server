"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.split = exports.min = void 0;
// like _.min
function min(arr) {
    return arr
        .map((item) => +item)
        .filter((item) => Number.isInteger(item))
        .reduce((current, next) => (current < next ? current : next));
}
exports.min = min;
function merge(list) {
    return list.join(' ').trim();
}
/**
 * split by multiple keywords in a sentence
 *
 * @example
   split('Price le 200 and Price gt 3.5 or length(CompanyName) eq 19', ['and', 'or'])
   [
     'Price le 200',
     'and',
     'Price gt 3.5',
     'or',
     'length(CompanyName) eq 19'
   ]
*/
function split(sentence, keys = []) {
    let keysArray = keys;
    if (!(keysArray instanceof Array)) {
        keysArray = [keysArray];
    }
    const { result, tmp } = sentence.split(' ').reduce((acc, word) => {
        if (keysArray.indexOf(word) > -1) {
            acc.result.push(merge(acc.tmp));
            acc.result.push(word);
            acc.tmp = [];
            return acc;
        }
        acc.tmp.push(word);
        return acc;
    }, { result: [], tmp: [] });
    result.push(merge(tmp));
    return result;
}
exports.split = split;
