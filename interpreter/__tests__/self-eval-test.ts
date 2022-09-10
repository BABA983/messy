import assert from "assert";
import Eval from "../Eval";

export default (eva: Eval) => {
  assert.strictEqual(eva.eval(1), 1);
  assert.strictEqual(eva.eval('"hello world"'), "hello world");
};
