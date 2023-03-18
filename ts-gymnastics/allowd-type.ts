interface AllowedTypes {
  number: number;
  string: string;
  boolean: boolean;
}

type UnionRecord<AllowedKeys extends keyof AllowedTypes> = {
  [Key in keyof AllowedTypes]: {
    type: Key;
    value: AllowedTypes[Key];
    log: (value: AllowedTypes[Key]) => void;
  };
}[AllowedKeys];

function processRecord<K extends keyof AllowedTypes>(record: UnionRecord<K>) {
  record.log(record.value);
}

processRecord({ type: 'boolean', value: false, log: (v) => console.log(v) });
processRecord({ type: 'string', value: true, log: (v) => console.log(v) });
