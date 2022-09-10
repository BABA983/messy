import assert from "assert";
const evalParser = require("../parser/eval-parser.js");

import Eval from "../Eval";

export const test = (eva: Eval, code: string, expected: any) => {
  const exp = evalParser.parse(code);
  assert.strictEqual(eva.eval(exp), expected);
};

export default test
