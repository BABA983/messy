type Example = {
  a: 'a';
  a1: 'a1';
  a2: 'a2';
  b: 'b';
  b1: 'b1';
  b2: 'b2';
  ab: 'ab';
};

type ValueOfKeyStartsWith<Obj, x extends string> = {
  [Key in Extract<keyof Obj, `${x}${string}`>]: Obj[Key];
};

type UnionVerOfValueOfKeyStartsWith<Obj, x extends string> = {
  [Key in Extract<keyof Obj, `${x}${string}`>]: Obj[Key];
}[Extract<keyof Obj, `${x}${string}`>];

type UnionVerOfValueOfKeyStartsWith2<
  Obj,
  x extends string,
  //   ExtractKeys = Extract<keyof Obj, `${x}${string}`>
  ExtractKeys extends keyof Obj = Extract<keyof Obj, `${x}${string}`>
> = {
  // ts 2322 不能将类型“ExtractKeys”分配给类型“string | number | symbol”。
  // ts 2536
  [Key in ExtractKeys]: Obj[Key];
}[ExtractKeys];

type test = ValueOfKeyStartsWith<Example, 'a'>;

type test1 = UnionVerOfValueOfKeyStartsWith<Example, 'a'>;

type test2 = UnionVerOfValueOfKeyStartsWith2<Example, 'a'>;
