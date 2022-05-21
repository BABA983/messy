const fruitCounts = {
  apple: 10,
  banana: 20,
  cherry: 30,
};

type SingleFruitCount =
  | { apple: number }
  | { banana: number }
  | { cherry: number };

type FruitCounts = typeof fruitCounts;

type NewSingleFruitCount = {
  //   [Key in keyof FruitCounts]: number;
  [Key in keyof FruitCounts]: {
    [K in Key]: number;
  };
}[keyof FruitCounts];
