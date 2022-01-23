// 可遍历
const mapTag = "[object Map]";
const setTag = "[object Set]";
const arrayTag = "[object Array]";
const objectTag = "[object Object]";
const argsTag = "[object Arguments]";

// 不可遍历
const boolTag = "[object Boolean]";
const dateTag = "[object Date]";
const numberTag = "[object Number]";
const stringTag = "[object String]";
const symbolTag = "[object Symbol]";
const errorTag = "[object Error]";
const regexpTag = "[object RegExp]";
const funcTag = "[object Function]";

const deepTag = [mapTag, setTag, arrayTag, objectTag, argsTag];

/**
 * 
 * const keys = Array.isArray(target) ? undefined : Object.keys(target);
    forEach(keys || target, (value, key) => {
      if (keys) {
        key = value;
      }
      cloneTarget[key] = clone(target[key], map);
    });
 */
function forEach(array, iteratee) {
  let index = -1;
  const length = array.length;
  while (++index < length) {
    iteratee(array[index], index);
  }
  return array;
}

function isObject(target) {
  const type = typeof target;
  return target !== null && (type === "object" || type === "function");
}

function getType(target) {
  return Object.prototype.toString.call(target);
}

/**
 * const target={} 就是 const target=new Object()的语法糖。
 * 另外这种方法还有一个好处：因为我们还使用了原对象的构造方法，
 * 所以它可以保留对象原型上的数据，如果直接使用普通的 {}，那么原型必然是丢失了的。
 * https://mp.weixin.qq.com/s/ANjtVpcer23QqcJL6TF2tQ
 */
function getInit(target) {
  const Ctor = target.constructor;
  return new Ctor();
}

function cloneOtherType(target, type) {
  const Ctor = target.constructor;
  switch (type) {
    case boolTag:
    case numberTag:
    case stringTag:
    case errorTag:
    case dateTag:
      return new Ctor(target);
    case regexpTag:
      return cloneReg(target);
    case symbolTag:
      return cloneSymbol(target);
    case funcTag:
      return cloneFunction(target);
    default:
      return null;
  }
}
function cloneSymbol(target) {
  // https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol
  // 如果你真的想创建一个 Symbol 包装器对象 (Symbol wrapper object)，你可以使用 Object() 函数：
  return Object(Symbol.prototype.valueOf.call(target));
}
function cloneReg(target) {
  const reFlags = /\w*$/;
  // 返回一个值为当前正则表达式对象的模式文本的字符串，该字符串不会包含正则字面量两边的斜杠以及任何的标志字符
  // [ 'g', index: 5, input: '/\\d+/g', groups: undefined ]
  const result = new target.constructor(target.source, reFlags.exec(target));
  // RegExp 对象是有状态的，上次记录的匹配会存放在 lastIndex
  result.lastIndex = target.lastIndex;

  return result;
}
/**
 * 我们可以通过 prototype 来区分下箭头函数和普通函数，箭头函数是没有 prototype 的。
 * 我们可以直接使用 eval和函数字符串来重新生成一个箭头函数，注意这种方法是不适用于普通函数的。
 */
function cloneFunction(func) {
  const bodyReg = /(?<={)(.|\n)+(?=})/m;
  const paramReg = /(?<=\().+(?=\)\s+{)/;
  const funcString = func.toString();

  if (func.prototype) {
    console.log("普通函数");
    const param = paramReg.exec(funcString);
    const body = bodyReg.exec(funcString);
    if (body) {
      console.log("匹配到函数体：", body[0]);
      if (param) {
        const paramArr = param[0].split(",");
        console.log("匹配到参数：", paramArr);
        return new Function(...paramArr, body[0]);
      } else {
        return new Function(body[0]);
      }
    } else {
      return null;
    }
  } else {
    return eval(funcString);
  }
}

/**
 * 深拷贝不知道有多少层所以要遍历递归
 * 如果是原始类型，无需继续拷贝，直接返回
 * 如果是引用类型，创建一个新的对象，遍历需要克隆的对象，将需要克隆对象的属性执行深拷贝后依次添加到新对象上
 * const cloneTarget = Array.isArray(target) ? [] : {}; 兼容数组情况
 *
 * 解决循环引用问题，可以开一个内存空间来存放当前对象和拷贝对象之间的关系，要拷贝当前对象的时候，先去找有没有拷贝过，
 * 有的话直接返回，没有才进行拷贝, key-value 形式，key 可以是引用类型
 * 1、检查map中有无克隆过的对象
 * 2、有 - 直接返回
 * 3、没有 - 将当前对象作为key，克隆对象作为value进行存储
 * 4、继续克隆
 *
 * for、while、forin forin的效率最低
 *
 * 处了普通的 object 和 array 这两种引用类型
 * 还有 function 和 null
 */
function clone(target, map = new WeakMap()) {
  // 克隆原始类型
  if (!isObject(target)) {
    return target;
  }

  // 初始化

  const type = getType(target);
  let cloneTarget;
  if (deepTag.includes(type)) {
    cloneTarget = getInit(target);
  } else {
    return cloneOtherType(target, type);
  }

  // 防止循环引用
  if (map.get(target)) return target;
  map.set(target, cloneTarget);

  // 克隆set
  if (type === setTag) {
    target.forEach((value) => {
      cloneTarget.add(clone(value));
    });
    return cloneTarget;
  }

  // 克隆map
  if (type === mapTag) {
    target.forEach((value, key) => {
      cloneTarget.set(key, clone(value));
    });
    return cloneTarget;
  }

  // 克隆对象和数组
  for (const key in target) {
    //   if (Array.isArray(target[key]) === "object") console.log(target[key]);
    cloneTarget[key] = clone(target[key], map);
  }

  return cloneTarget;
}

const map = new Map();
map.set("a", "b");

const set = new Set();
set.add("a");
set.add("b");
const target = {
  field1: 1,
  field2: undefined,
  field3: "ConardLi",
  field4: {
    child: "child",
    child2: {
      child2: "child2",
    },
  },
  filed5: [1, 2, 3, [1, 2]],
  f: {
    f: { f: { f: { f: { f: { f: { f: { f: { f: { f: { f: {} } } } } } } } } } },
  },
  empty: null,
  map,
  set,
  bool: new Boolean(true),
  num: new Number(2),
  str: new String(2),
  symbol: Object(Symbol(1)),
  date: new Date(),
  reg: /\d+/g,
  error: new Error(),
  func1: () => {
    console.log("haha");
  },
  func2: function (a, b) {
    return a + b;
  },
};
// test 循环引用
target.target = target;

console.time();
console.log(clone(target));
console.timeEnd();
