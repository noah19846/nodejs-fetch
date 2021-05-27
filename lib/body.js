class Body {
  get bodyUsed() {
    // TODO:
    return false
  }

  arrayBuffer() {
    return new Promise(resolve => resolve(this.body.buffer))
  }

  blob() {
    return new Promise(resolve => resolve(new Blob(this.body.buffer)))
  }

  // formData() {
  //   // TODO:
  //   return new Promise()
  // }

  json() {
    return new Promise(resolve => resolve(JSON.parse(this.body.toString())))
  }

  text() {
    return new Promise(resolve => resolve(this.body.toString()))
  }
}

module.exports = Body
