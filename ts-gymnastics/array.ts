type pop<T extends unknown[]> = T extends [...infer Rest, infer R]
  ? [...Rest]
  : never;

type testPop = pop<[1, 2, 3, 4]>;

type shift<T extends unknown[]> = T extends [infer R, ...infer Rest]
  ? [...Rest]
  : never;

type testShift = shift<[1, 2, 3, 4]>;
