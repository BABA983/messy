type DispatchEvent =
  | {
      type: 'LOG_IN';
      payload: {
        userId: string;
      };
    }
  | {
      type: 'LOG_OUT';
    };

const oldDispatch = (type: DispatchEvent['type'], payload?: any) => {};

const dispatch = <T extends DispatchEvent['type']>(
  ...args: Extract<DispatchEvent, { type: T }> extends { payload: infer P }
    ? // ? [T, P]
      [type: T, payload: P]
    : // : [ T]
      [type: T]
) => {};

// arg_0: 'LOG_IN' arg_1: { userId: string; }
dispatch('LOG_IN', { userId: '123' });
// arg_0: 'LOG_OUT'
dispatch('LOG_OUT');
