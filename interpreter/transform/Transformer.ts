export default class Transformer {
  /**
   * Translates `def` expression (function declaration)
   * into a variable declaration with a lambda
   * expression
   */
  transformDefToLambda(exp: any[]) {
    const [_tag, name, params, body] = exp;
    return ["var", name, ["lambda", params, body]];
  }

  transformSwitchToIf(exp: any[]) {
    const [_tag, ...cases] = exp;
    const ifExp = ["if", null, null, null];
    let current = ifExp;
    // last one is else
    for (let i = 0; i < cases.length - 1; i++) {
      const [currentCond, currentBlock] = cases[i];

      current[1] = currentCond;
      current[2] = currentBlock;

      const next = cases[i + 1];
      const [nextCond, nextBlock] = next;

      current[3] = nextCond === "else" ? nextBlock : ["if"];

      current = current[3] as any;
    }

    return ifExp;
  }
}
