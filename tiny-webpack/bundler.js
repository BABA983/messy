const fs = require("fs");
const path = require("path");
const babylon = require("babylon");
const traverse = require("babel-traverse").default;
const babel = require("babel-core");

let ID = 0;

function createAsset(filename) {
  const content = fs.readFileSync(filename, "utf-8");

  // https://astexplorer.net 查看 AST 树大概长什么样
  const ast = babylon.parse(content, { sourceType: "module" });

  // 当前这个模块依赖哪些模块
  const dependencies = [];

  // 想知道这个模块依赖了哪些模块，查看 AST 里面的 ImportDeclaration
  traverse(ast, {
    ImportDeclaration: ({ node }) => {
      dependencies.push(node.source.value);
    },
  });

  // 闭包，递归的时候累加
  const id = ID++;

  // 将代码转换为所有浏览器可运行的代码
  const { code } = babel.transformFromAst(ast, null, {
    presets: ["env"],
  });

  return {
    id,
    filename,
    dependencies,
    code,
  };
}

function createGraph(entry) {
  const mainAsset = createAsset(entry);

  const queue = [mainAsset];

  for (const asset of queue) {
    const dirname = path.dirname(asset.filename);
    asset.mapping = {};

    // 遍历依赖 dependencies: [ './message.js' ]
    asset.dependencies.forEach((relativePath) => {
      const absolutePath = path.join(dirname, relativePath);
      const child = createAsset(absolutePath);

      // mapping: { './message.js': 1 }，通过 id 来表达对应的依赖关系
      asset.mapping[relativePath] = child.id;

      // 继续遍历，直到 child.dependencies === []
      queue.push(child);
    });
  }
  return queue;
}

function bundle(graph) {
  let modules = "";

  /**
   * key: value 的形式
   * key 是每个模块的 id
   * value 的第一个值是 function 包着模块的代码，这样会有作用域而不会影响全局
   * '"use strict";\n' +
        '\n' +
        'Object.defineProperty(exports, "__esModule", {\n' +
        '  value: true\n' +
        '});\n' +
        '\n' +
        'var _name = require("./name.js");\n' +
        '\n' +
        'exports.default = "hello " + _name.name + "!";'
    * 可以看到 babel 转化的代码里面会有 require, module, exports 这些属于 CommonJs 的东西，是浏览器没有的，等下要在 IIFE 里面我们自己实现一个
    * 
    * 第二个值是模块对应的依赖，类似 { './relative/path': 1 }
    * 因为在转化的代码里面 require("./name.js")，它会调用依赖的模块，这样我们就会知道哪个 ID 是它依赖的模块了
   */
  graph.forEach((module) => {
    modules += `${module.id}:[
          function(require, module, exports) { ${module.code} },
          ${JSON.stringify(module.mapping)}
      ],`;
  });
  //   console.log(modules);

  /**
   * require 接收一个 ID，在方法里面解构上面塞进去的代码和依赖关系
   * localRequire 是为了让转化代码执行成功，localRequire("./name.js")
   * 然后我们根据它的id来获取对应的 module.exports
   */
  const result = `
      (function(modules) {
          function require(id) {
              const [fn, mapping] = modules[id];

              function localRequire(relativePath) {
                  return require(mapping[relativePath])
              };

              const module = { exports: {} };

              fn(localRequire, module, module.exports);

              return module.exports;
          }

          require(0);
      })({${modules}})
    `;
  return result;
}

const graph = createGraph("./entry.js");
// console.log(graph);
const result = bundle(graph);

// console.log(result);
