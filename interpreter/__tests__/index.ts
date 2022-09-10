import Eval from "../Eval";
import Env from "../Env";

const TEST_CASE = [
  require("./self-eval-test").default,
  require("./math-test").default,
  require("./variables-test").default,
  require("./block-test").default,
  require("./if-test").default,
  require("./while-test").default,
  require("./built-in-fn").default,
  require("./user-defined-fn-test").default,
  require("./lambda-fn-test").default
];
// -------- Test --------
const eva = new Eval(
  /* new Env({ */
  /*   null: null, */
  /*   true: true, */
  /*   false: false, */
  /*   VERSION: "0.1", */
  /* }) */
);

console.log(TEST_CASE);
TEST_CASE.forEach((test) => test(eva));
eva.eval(['print','"Hello"','"World"'])
console.log("All test passed!");
