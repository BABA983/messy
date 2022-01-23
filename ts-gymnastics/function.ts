type GetParams<f extends Function> = f extends (...params: infer P) => any
  ? P
  : never;

type testGetParams = GetParams<(a: number, b: string) => void>;

type GetReturnType<f extends Function> = f extends (...params: any) => infer R
  ? R
  : never;

type testGetReturnType = GetReturnType<(a: number, b: string) => void>;
