import assert from "assert";
import Eval from "../Eval";

export default (eva: Eval) => {
  // Math
  assert.strictEqual(eva.eval(["+", 1, 5]), 6);
  assert.strictEqual(eva.eval(["+", ["+", 3, 2], 5]), 10);
  assert.strictEqual(eva.eval(["+", ["*", 3, 2], 5]), 11);
};
