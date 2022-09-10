import assert from "assert";
import Eval from "../Eval";

// if <condition>
//    <consequent>
//    <alternate>
export default (eva: Eval) => {
  assert.strictEqual(
    eva.eval([
      "begin",
      ["var", "counter", 0],
      ["var", "result", 0],
      [
        "while",
        ["<", "counter", 10],
        [
          "begin",
          ["set", "result", ["+", "result", 1]],
          ["set", "counter", ["+", "counter", 1]],
        ],
      ],
      "result",
    ]),
    10
  );
};
