type MyRecord<K extends string | number | symbol, T> = { [P in K]: T };

type MyReadonly<T> = {
  readonly [Key in keyof T]: T[Key];
};

type MyPartial<T> = {
  [Key in keyof T]?: T[Key];
};

type MyRequired<T> = {
  [Key in keyof T]-?: T[Key];
};

type NotReadOnly<T> = {
  -readonly [Key in keyof T]: T[Key];
};

type obj = {
  a: string;
  b: number;
  c: () => void;
};

type ReadonlyObj = MyReadonly<obj>;
type NotReadOnlyObj = NotReadOnly<ReadonlyObj>;
type PartialObj = MyPartial<obj>;
type RequiredObj = MyRequired<PartialObj>;
