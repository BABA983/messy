// Environment names storage
export default class Env {
  private record: any;
  private parent: Env | null;
  constructor(record = {}, parent: Env | null = null) {
    this.record = record;
    this.parent = parent;
  }
  // Create a variables with a name and value
  define(name: any, value: any) {
    this.record[name] = value;
    return value;
  }

  // Update an existing variable.
  assign(name: any, value: any) {
    this.resolve(name).record[name] = value;
    return value;
  }

  // Return the value of defined variables, or throws if the variables is not defined
  lookup(name: any) {
    return this.resolve(name).record[name];
  }

  // Return specific environment in which a variable is defined, or throws if a variable is not defined
  resolve(name: any): any {
    if (this.record.hasOwnProperty(name)) {
      return this;
    }
    if (this.parent === null) {
      throw new ReferenceError(`Variable "${name}" is not defined.`);
    }
    return this.parent.resolve(name);
  }
}
