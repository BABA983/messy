import assert from "assert";
import Eval from "../Eval";

export default (eva: Eval) => {
  // Variables
  assert.strictEqual(eva.eval(["var", "x", 3]), 3);
  assert.strictEqual(eva.eval("x"), 3);
  assert.strictEqual(eva.eval(["var", "y", 123]), 123);
  assert.strictEqual(eva.eval("y"), 123);

  assert.strictEqual(eva.eval(["var", "isUser", "true"]), true);
  assert.strictEqual(eva.eval(["var", "z", ["*", 2, 3]]), 6);
  assert.strictEqual(eva.eval("z"), 6);

  assert.strictEqual(eva.eval("VERSION"), "0.1");
};
