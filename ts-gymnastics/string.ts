const str = "  1234   ";
type TrimLeft<s extends string> = s extends `${" " | "\t" | "\n"}${infer Rest}`
  ? TrimLeft<Rest>
  : s;

type testTrimLeft = TrimLeft<typeof str>;

type TrimRight<s extends string> = s extends `${infer Rest}${" " | "\t" | "\n"}`
  ? TrimRight<Rest>
  : s;

type testTrimRight = TrimRight<typeof str>;

type testTrim = TrimLeft<TrimRight<typeof str>>;

/** replace */
type Replace<
  s extends string,
  s1 extends string,
  s2 extends string
> = s extends `${infer L}${s1}${infer R}` ? `${L}${s2}${R}` : s;

type testReplace = Replace<"===123===", "123", "abc">;

/**过滤 typeof === string 的索引 */
type FilterString<T> = {
  [Key in keyof T as T[Key] extends string ? Key : never]: T[Key];
};

type man = {
  name: string;
  age: number;
  address: string;
  phone: number;
  gender: boolean;
};

type testFilterString = FilterString<man>;

/** as 可以把索引转换 */
type Getters<T extends Record<any, any>> = {
  [Key in keyof T as `get${Capitalize<Key & string>}`]: T[Key];
};

type testGetters = Getters<man>;

type Flip<T extends Record<any, any>> = {
  [Key in keyof T as `${T[Key]}`]: Key;
};

type testFlip = Flip<man>;
