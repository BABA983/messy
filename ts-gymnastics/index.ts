/**
 * 判断 A 数组的长度是否为传入的 L，不是的话 push 进数组并递归
 */
type createArr<L, E, A extends E[] = []> = A["length"] extends L
  ? A
  : createArr<L, E, [E, ...A]>;

type arr = createArr<30, "a">;

type fruitStr = `apple,banana`;

/** 推断出 rest 变量 */
type fruit = fruitStr extends `apple,${infer rest}` ? rest : never;

/** 加法 */
type Add<A extends number, B extends number> = [
  ...createArr<A, "a">,
  ...createArr<B, 0>
]["length"];

type addTest = Add<3, 7>;

/**
 * 通过数组来计算次数
 * S 要重复的字符串
 * C 重复次数
 * A 用来计算次数的数组
 * RS 生成的字符串
 */
type RepeatStr<
  S extends string,
  C,
  A extends S[] = [],
  RS extends string = ""
> = A["length"] extends C ? RS : RepeatStr<S, C, [S, ...A], `${S}${RS}`>;

type testRepeatStr = RepeatStr<"apple|", 3>;

type Chars =
  | "0"
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "a"
  | "b"
  | "c"
  | "d"
  | "e"
  | "f"
  | "g"
  | "h"
  | "i"
  | "j"
  | "k"
  | "l"
  | "m"
  | "n"
  | "o"
  | "p"
  | "q"
  | "r"
  | "s"
  | "t"
  | "u"
  | "v"
  | "w"
  | "x"
  | "y"
  | "z"
  | "A"
  | "B"
  | "C"
  | "D"
  | "E"
  | "F"
  | "G"
  | "H"
  | "I"
  | "J"
  | "K"
  | "L"
  | "M"
  | "N"
  | "O"
  | "P"
  | "Q"
  | "R"
  | "S"
  | "T"
  | "U"
  | "V"
  | "W"
  | "X"
  | "Y"
  | "Z";

/**
 * 用来存储结果
 */
type StoreParseResult<T extends string, R extends string> = {
  token: T;
  rest: R;
};

/**
 * 判断第一个字符是不是 Chars 里面的，是就递归
 */
type ParseFunctionName<
  SourceStr extends string,
  RestStr extends string = ""
> = SourceStr extends `${infer FirstStr}${infer RestChar}`
  ? FirstStr extends Chars
    ? ParseFunctionName<RestChar, `${RestStr}${FirstStr}`>
    : StoreParseResult<RestStr, SourceStr>
  : never;

type testParseFunctionName = ParseFunctionName<"getList(1,10)">;
