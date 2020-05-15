export default class {
  constructor() {
    this.listeners = []
    this.playListeners = []
  }

  insert(items) {
    for (let listener of this.listeners) {
      listener(items)
    }
  }

  play () {
    for (let f of this.playListeners) {
      f()
    }
  }

  register (listener) {
    this.listeners.push(listener)
  }

  registerPlay (listener) {
    this.playListeners.push(listener)
  }
}
