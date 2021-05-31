// TODO:
// 1.guard
// 2.set 时候 check key 和 value

class Headers {
  #headers = new Map()

  constructor(init = {}) {
    if (Array.isArray(init)) {
      init.forEach(item => this.#headers.set(item[0], item[1]))
    } else if (init instanceof Headers) {
      init.forEach((key, value) => this.#headers.set(key, value))
    } else if (typeof init === 'object') {
      Object.keys(init).forEach(key => this.#headers.set(key, init[key]))
    }
  }

  get [Symbol.toStringTag]() {
    return 'Headers'
  }

  [Symbol.iterator]() {
    return this.entries()
  }

  append(key, value) {
    if (!this.has(key)) {
      this.set(key, value)
    } else {
      this.set(key, `${this.get(key)}, ${value}`)
    }
  }

  delete(key) {
    return this.#headers.delete(key)
  }

  get(key) {
    return this.#headers.get(key)
  }

  has(key) {
    return this.#headers.has(key)
  }

  set(key, value) {
    return this.#headers.set(String(key).trim(), String(value).trim())
  }

  keys() {
    return this.#headers.keys()
  }

  values() {
    return this.#headers.values()
  }

  entries() {
    return this.#headers.entries()
  }

  forEach(f) {
    ;[...this.#headers.entries()].forEach(item => f(item[0], item[1], this))
  }
}

module.exports = Headers
