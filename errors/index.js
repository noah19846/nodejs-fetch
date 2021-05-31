class AbortError extends Error {
  constructor(message) {
    super(message)

    this.type = 'aborted'
    this.message = message
    this.name = 'AbortError'
    this[Symbol.toStringTag] = 'AbortError'

    // Hide custom error implementation details from end-users
    Error.captureStackTrace(this, this.constructor)
  }
}

class FetchError extends Error {
  constructor(message, type, systemError) {
    super(message)

    this.message = message
    this.type = type
    this.name = 'FetchError'
    this[Symbol.toStringTag] = 'FetchError'

    // When err.type is `system`, err.erroredSysCall contains system error and err.code contains system error code
    if (systemError) {
      // eslint-disable-next-line no-multi-assign
      this.code = this.errno = systemError.code
      this.erroredSysCall = systemError
    }

    // Hide custom error implementation details from end-users
    Error.captureStackTrace(this, this.constructor)
  }
}

module.exports = {
  AbortError,
  FetchError
}
