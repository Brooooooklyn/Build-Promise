import 'tslib'
/**
 * Promise 的规范描述 https://developer.mozilla.org/en-US/docs/Mozilla/JavaScript_code_modules/Promise.jsm/Promise
 * 为了表达更加准确，将使用 TypeScript 编写例子
 * T 是范型，new 的时候指定，代表 Promise 将会 resolve 什么类型的值
 */

export interface Thenable<T> {
  then?: <U>(onFulfill?: (value?: T) => U, errorHandler?: (e: Error) => any) => any
}

// tslint:disable-next-line
function noop () { }

export class MyPromise <T> {

  public static resolve<U>(val?: U): MyPromise<U> {
    return new MyPromise<U>(resolve => {
      resolve(val)
    })
  }

  public static reject<U>(reason: U): MyPromise<U> {
    return new MyPromise<U>((resolve, reject) => {
      reject(reason)
    })
  }

  /**
   * 0 是 pending
   * 1 是 fulfilled
   * 2 是 rejected
   */
  public status = 0

  private _value: T
  private _rejectReason: any
  private _nextResolver: () => void = noop
  private _nextRejecter: () => void = noop

  /**
   * 这里回忆一下 Promise 是如何被 new 出来的
   * new Promise((resolve, reject) => {
   *   resolve(x)
   * })
   * 所以这里 executor 中的 resolve 与 reject 其实是从 Promise 的 constructor 里面传入的
   */
  constructor(executor: (resolve: (value: T) => void, reject: (reason: any) => void) => any) {
    try {
      executor((value: T) => {
        if (this.status !== 0) {
          return
        }
        this._resolve(value)
        this._nextResolver()
      }, (reason: any) => {
        if (this.status !== 0) {
          return
        }
        this._reject(reason)
        this._nextRejecter()
      })
    } catch (e) {
      this._reject(e)
    }
  }

  then<U>(onFulfill?: (value?: T) => U, errorHandler?: (e: Error) => any): MyPromise<U> {
    return new MyPromise<U>((resolve, reject) => {
      setTimeout(() => {
        if (this.status === 0) {
          this._nextResolver = () => {
            this._tryOnFulfill(onFulfill, errorHandler, resolve, reject)
          }
        } else if (this.status === 1) {
          if (typeof onFulfill === 'function') {
            this._tryOnFulfill(onFulfill, errorHandler, resolve, reject)
          } else {
            resolve(void 0)
          }
        } else if (this.status === 2) {
          if (typeof errorHandler === 'function') {
            try {
              const result = errorHandler(this._rejectReason)
              resolve(result)
            } catch (e) {
              reject(e)
            }
          }
          reject(this._rejectReason)
        }
      })
    })

  }

  catch<U>(onReject: (reason: any) => U): MyPromise<U> {
    return new MyPromise<U>((resolve, reject) => {
      setTimeout(() => {
        if (this.status === 0) {
          this._nextRejecter = () => {
            this._tryOnReject(onReject, resolve, reject)
          }
        } else {
          if (typeof onReject === 'function') {
            this._tryOnReject(onReject, resolve, reject)
          }
          resolve(void 0)
        }
      })
    })
  }

  private _resolve(value: T) {
    this._value = value
    this.status = 1
  }

  private _reject(reason: any) {
    this._rejectReason = reason
    this.status = 2
  }

  private _isThenable (result: any) {
    return result && typeof result.then === 'function'
  }

  private _tryOnFulfill<U>(
    onFulfill: (value?: T) => U,
    errorHandler: (e: Error) => any,
    resolve: (value?: U) => void,
    reject: (reason?: any) => void
  ) {
    try {
      const result: Thenable<U> = onFulfill(this._value)
      if (this._isThenable(result)) {
        result.then(val => {
          resolve(val)
        }, reason => {
          reject(reason)
        })
      } else {
        resolve(<U>result)
      }
    } catch (e) {
      if (errorHandler) {
        errorHandler(e)
      }
      reject(e)
    }
  }

  private _tryOnReject<U>(
    onReject: (reason: any) => U,
    resolve: (value?: U) => void,
    reject: (reason?: any) => void
  ) {
    try {
      const result: Thenable<U> = onReject(this._rejectReason)
      if (this._isThenable(result)) {
        result.then(val => {
          resolve(val)
        }, reason => {
          reject(reason)
        })
      } else {
        resolve(<U>result)
      }
    } catch (e) {
      reject(e)
    }
  }
}