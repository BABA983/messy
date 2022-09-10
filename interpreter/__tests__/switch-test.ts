import Eval from "../Eval";
import { test } from "./test-util";

export default (eva: Eval) => {
  test(
    eva,
    `
  (begin
    (var x 10)
    (switch ((= x 10) 100)
            ((> x 10) 200)
            (else     300))
    )
`,
    100
  );
};
