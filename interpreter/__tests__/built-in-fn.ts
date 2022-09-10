import Eval from "../Eval";
import { test } from "./test-util";

export default (eva: Eval) => {
  // Math function
  test(eva, `(+ 1 5)`, 6);
  test(eva, `(+ (+ 2 3) 5)`, 10);
  test(eva, `(+ (* 2 3) 5)`, 11);

  // Comparison
  test(eva, `(> 1 5)`, false);
  test(eva, `(< 1 5)`, true);

  test(eva, `(>= 5 5)`, true);
  test(eva, `(<= 5 5)`, true);
  test(eva, `(= 5 5)`, true);
};
