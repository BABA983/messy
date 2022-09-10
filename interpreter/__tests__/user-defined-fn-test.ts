import Eval from "../Eval";
import { test } from "./test-util";

export default (eva: Eval) => {
  test(
    eva,
    `
    (begin
      (
        def square (x)
        (* x x)
      )
      (square 2)
    )
    `,
    4
  );
  test(
    eva,
    `
    (begin
      (def calc (x y)
      (begin
        (var z 30)
        (+ (* x y) z)
      ))
      (calc 10 20)
    )
    `,
    230
  );

  /**
   * {
   *    var value = 100
   *    function calc(x, y) {
   *        var z = 30
   *        function inner(foo){
   *          return foo + z + value
   *        }
   *        return inner
   *    }
   *    var fn = calc(10, 20)
   *    fn(30)
   * }
   *
   */
  test(
    eva,
    `
    (begin
      (var value 100)
      (def calc (x y)
      (begin
        (var z 30)
        (def inner (foo)
          (+ (+ foo z) value))
        inner
      ))
      (var fn (calc 10 20))
      (fn 30)
    )
    `,
    160
  );

  // Recursive
  /* test( */
  /*   eva, */
  /*   ` */
  /*   (begin  */
  /*     (def factorial (x)  */
  /*       (if (= x 1) */
  /*       1 */
  /*       (* x (factorial (- x 1))))) */
  /*   (factorial 5)) */
  /**/
  /*   `, */
  /*   120 */
  /* ); */
};
