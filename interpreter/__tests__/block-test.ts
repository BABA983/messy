import assert from "assert";
import Eval from "../Eval";
import testUtil from "./test-util";

export default (eva: Eval) => {
  // Blocks
  assert.strictEqual(
    eva.eval([
      "begin",
      ["var", "x", 10],
      ["var", "y", 20],
      ["+", ["*", "x", "y"], 30],
    ]),
    230
  );

  // Block
  assert.strictEqual(
    eva.eval([
      "begin",
      ["var", "x", 10],
      ["begin", ["var", "x", 20], "x"],
      "x",
    ]),
    10
  );

  // Closure
  assert.strictEqual(
    eva.eval([
      "begin",
      ["var", "val", 10],
      ["var", "result", ["begin", ["var", "x", ["+", "val", 20]], "x"]],
      "result",
    ]),
    30
  );

  // Assignment
  assert.strictEqual(
    eva.eval([
      "begin",
      ["var", "data", 10],
      ["begin", ["set", "data", 100]],
      "data",
    ]),
    100
  );

  testUtil(
    eva,
    `
    (
      begin
        (var x 10)
        (var y 20)
        (+ (* x 10) y)
    )
    `,
    120
  );
};
