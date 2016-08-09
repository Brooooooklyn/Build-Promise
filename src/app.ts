import 'tslib'
/**
 * Promise 的规范描述 https://developer.mozilla.org/en-US/docs/Mozilla/JavaScript_code_modules/Promise.jsm/Promise
 * 为了表达更加准确，将使用 TypeScript 编写例子
 * T 是范型，new 的时候指定，代表 Promise 将会 resolve 什么类型的值
 */

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

  /**
   * 这里回忆一下 Promise 是如何被 new 出来的
   * new Promise((resolve, reject) => {
   *   resolve(x)
   * })
   * 所以这里 executor 中的 resolve 与 reject 其实是从 Promise 的 constructor 里面传入的
   */
  constructor(executor: (resolve: (value: T) => void, reject: (reason: any) => void) => any) {
    try {
      executor(this._resolve.bind(this), this._reject.bind(this))
    }catch (e) {
      this._reject(e)
    }
  }

  then<U>(onFulfill?: (value?: T) => U, errorHandler?: (e: Error) => any): MyPromise<U> {
    if (this.status === 1) {
      if (typeof onFulfill === 'function') {
        try {
          const result = onFulfill(this._value)
          return MyPromise.resolve(result)
        } catch (e) {
          if (errorHandler) {
            errorHandler(e)
          }
          return MyPromise.reject(e)
        }
      } else {
        return MyPromise.resolve<any>()
      }
    } else {
      if (typeof errorHandler === 'function') {
        try {
          errorHandler(this._rejectReason)
        } catch (e) {
          return MyPromise.reject(e)
        }
        return MyPromise.reject(this._rejectReason)
      }
      return MyPromise.reject(this._rejectReason)
    }
  }

  catch<U>(onReject: (reason: any) => U): MyPromise<U> {
    if (typeof onReject === 'function') {
      try {
        const result = onReject(this._rejectReason)
        return MyPromise.resolve(result)
      } catch (e) {
        return MyPromise.reject(e)
      }
    }
    return MyPromise.resolve<any>()
  }

  private _resolve(value: T) {
    this._value = value
    this.status = 1
  }

  private _reject(reason: any) {
    this._rejectReason = reason
    this.status = 2
  }
}