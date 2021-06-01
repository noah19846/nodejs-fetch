const NAME = Symbol.toStringTag

function isVoid(value) {
  return value === null || value === undefined
}

function isURLSearchParams(object) {
  return (
    typeof object === 'object' &&
    typeof object.append === 'function' &&
    typeof object.delete === 'function' &&
    typeof object.get === 'function' &&
    typeof object.getAll === 'function' &&
    typeof object.has === 'function' &&
    typeof object.set === 'function' &&
    typeof object.sort === 'function' &&
    object[NAME] === 'URLSearchParams'
  )
}

function isBlob(object) {
  return (
    typeof object === 'object' &&
    typeof object.arrayBuffer === 'function' &&
    typeof object.type === 'string' &&
    typeof object.stream === 'function' &&
    typeof object.constructor === 'function' &&
    /^(Blob|File)$/.test(object[NAME])
  )
}

function isAbortSignal(object) {
  return typeof object === 'object' && object[NAME] === 'AbortSignal'
}

function isArrayBuffer(object) {
  return object[NAME] === 'ArrayBuffer'
}

function isAbortError(object) {
  return object[NAME] === 'AbortError'
}

module.exports = {
  isAbortError,
  isAbortSignal,
  isArrayBuffer,
  isBlob,
  isURLSearchParams,
  isVoid
}
