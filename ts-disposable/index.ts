(Symbol as { dispose: symbol }).dispose ??= Symbol("Symbol.dispose");
(Symbol as { asyncDispose: symbol }).asyncDispose ??= Symbol("Symbol.asyncDispose");
class Person implements Disposable {
  constructor() {
    console.log('person init')
  }

  [Symbol.dispose]() {
    console.log('person dispose')
  }
}

{
  using person = new Person()
  console.log('hi person', person);
}
console.log('out of scope');

