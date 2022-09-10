import Env from "./Env";
import Transformer from "./transform/Transformer";

export default class Eval {
  private global: Env;
  private _transformer: Transformer;
  constructor(global = GlobalEnvironment) {
    this.global = global;
    this._transformer = new Transformer();
  }
  eval(exp: unknown, env: Env = this.global): any {
    // Self-evaluating expression
    if (isNumber(exp)) {
      return exp;
    }
    if (isString(exp)) {
      return exp.slice(1, -1);
    }

    // Math operations
    /* if (isArray(exp) && exp[0] === "+") { */
    /*   return this.eval(exp[1], env) + this.eval(exp[2], env); */
    /* } */
    /* if (isArray(exp) && exp[0] === "*") { */
    /*   return this.eval(exp[1], env) * this.eval(exp[2], env); */
    /* } */

    // Comparison operators
    /* if (isArray(exp) && exp[0] === ">") { */
    /*   return this.eval(exp[1], env) > this.eval(exp[2], env); */
    /* } */
    /* if (isArray(exp) && exp[0] === ">=") { */
    /*   return this.eval(exp[1], env) >= this.eval(exp[2], env); */
    /* } */
    /* if (isArray(exp) && exp[0] === "<") { */
    /*   return this.eval(exp[1], env) < this.eval(exp[2], env); */
    /* } */
    /* if (isArray(exp) && exp[0] === "<=") { */
    /*   return this.eval(exp[1], env) <= this.eval(exp[2], env); */
    /* } */
    /* if (isArray(exp) && exp[0] === "=") { */
    /*   return this.eval(exp[1], env) === this.eval(exp[2], env); */
    /* } */

    // Block: sequence of expressions
    if (isArray(exp) && exp[0] === "begin") {
      const blockEnv = new Env({}, env);
      return this._evalBlock(exp, blockEnv);
    }

    // Variables declaration: var x 10
    if (isArray(exp) && exp[0] === "var") {
      const [_, name, value] = exp;
      return env.define(name, this.eval(value, env));
    }

    // Variables update: set x 20
    if (isArray(exp) && exp[0] === "set") {
      const [_, name, value] = exp;
      return env.assign(name, this.eval(value, env));
    }

    // Variables access
    if (isVariablesName(exp)) {
      return env.lookup(exp);
    }

    // if expression
    if (isArray(exp) && exp[0] === "if") {
      const [_tag, condition, consequent, alternate] = exp;
      if (this.eval(condition)) {
        return this.eval(consequent, env);
      }
      return this.eval(alternate, env);
    }

    // while expression
    if (isArray(exp) && exp[0] === "while") {
      const [_tag, condition, body] = exp;
      let result;
      while (this.eval(condition, env)) {
        result = this.eval(body, env);
      }
      return result;
    }

    // Function declaration: (def square x (* x x))
    // (def foo () x)
    // (def bar ()
    //  (begin
    //    (var x 20)
    //    (+ (foo) x)))
    // (bar) -> result should be 30
    // Syntactic sugar for: (var square (lambda (x) (* x x)))
    if (isArray(exp) && exp[0] === "def") {
      const [_tag, name, params, body] = exp;

      // JIT-transpile to a variable declaration
      const varExp = this._transformer.transformDefToLambda(exp);
      return this.eval(varExp, env);
      /* const fn = { */
      /*   params, */
      /*   body, */
      /*   env, // Closure */
      /* }; */
      /* return env.define(name, fn); */
    }

    // Syntactic sugar for nested if-expressions
    if (isArray(exp) && exp[0] === "switch") {
      const ifExp = this._transformer.transformSwitchToIf(exp);
      return this.eval(ifExp, env);
    }

    // Syntactic sugar for: (begin init (while condition (begin body modifer)))
    /* if (isArray(exp) && exp[0] === "for") { */
    /*   const whileExp = this._transformer.transformForToWhile(exp); */
    /*   return this.eval(whileExp, env); */
    /* } */

    // Syntactic sugar for: (set foo (+ foo 1))
    /* if (isArray(exp) && exp[0] === "++") { */
    /*   const setExp = this._transformer.transformIncToSet(exp); */
    /*   return this.eval(setExp, env); */
    /* } */
    /* if (isArray(exp) && exp[0] === "+=") { */
    /*   const setExp = this._transformer.transformIncValToSet(exp); */
    /*   return this.eval(setExp, env); */
    /* } */
    /* if (isArray(exp) && exp[0] === "-=") { */
    /*   const setExp = this._transformer.transformDecToSet(exp); */
    /*   return this.eval(setExp, env); */
    /* } */

    // Lambda function: (lambda (x) (* x x))
    if (isArray(exp) && exp[0] === "lambda") {
      const [_tag, params, body] = exp;
      return {
        params,
        body,
        env, // Closure
      };
    }

    // Function call
    // (print "hello world")
    // (+ x 5)
    // (> foo bar)
    if (isArray(exp)) {
      const fn = this.eval(exp[0], env);
      const args = exp.slice(1).map((arg) => this.eval(arg, env));

      // Native function
      if (typeof fn === "function") {
        return fn(...args);
      }

      // TODO User define function
      // store the local variables for the params
      const activationRecord = {};
      fn.params.forEach((param, index) => {
        activationRecord[param] = args[index];
      });

      const activationEnv = new Env(
        activationRecord,
        //env // ? - dynamic scope
        fn.env // static scope
      );

      return this._evalBody(fn.body, activationEnv);
    }

    throw `Unimplemented: ${JSON.stringify(exp)}`;
  }

  _evalBody(body, env) {
    if (isArray(body) && body[0] === "begin") {
      return this._evalBlock(body, env);
    }
    return this.eval(body, env);
  }

  _evalBlock(block: any[], env: Env) {
    let result;
    const [_tag, ...expressions] = block;

    expressions.forEach((exp) => {
      result = this.eval(exp, env);
    });

    return result;
  }
}

const GlobalEnvironment = new Env({
  null: null,
  true: true,
  false: false,
  VERSION: "0.1",
  "+"(op1, op2) {
    return op1 + op2;
  },
  "*"(op1, op2) {
    return op1 * op2;
  },
  "-"(op1, op2) {
    if (op2 === null) {
      return -op1;
    }
    return op1 - op2;
  },
  "/"(op1, op2) {
    return op1 / op2;
  },
  ">"(op1, op2) {
    return op1 > op2;
  },
  "<"(op1, op2) {
    return op1 < op2;
  },
  "="(op1, op2) {
    return op1 === op2;
  },
  ">="(op1, op2) {
    return op1 >= op2;
  },
  "<="(op1, op2) {
    return op1 <= op2;
  },
  print(...args) {
    console.log(...args);
  },
});

function isNumber(num: unknown) {
  return typeof num === "number";
}

function isString(str: unknown): str is string {
  return (
    typeof str === "string" && str[0] === '"' && str[str.length - 1] === '"'
  );
}

function isArray(arr: unknown): arr is any[] {
  return Array.isArray(arr);
}

function isVariablesName(exp: unknown) {
  return typeof exp === "string" && /^[+\-*/<>=a-zA-Z0-9_]*$/.test(exp);
}
