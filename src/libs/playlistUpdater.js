export default class {
  constructor() {
    this.listeners = []
  }

  insert(items) {
    for (let listener of this.listeners) {
      listener(items)
    }
  }

  register(listener) {
    this.listeners.push(listener)
  }
}
