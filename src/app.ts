import 'tslib'
/**
 * Promise 的规范描述 https://developer.mozilla.org/en-US/docs/Mozilla/JavaScript_code_modules/Promise.jsm/Promise
 * 为了表达更加准确，将使用 TypeScript 编写例子
 * T 是范型，new 的时候指定，代表 Promise 将会 resolve 什么类型的值
 */

export class MyPromise <T> {

  public static resolve<U>(val: U): MyPromise<U> {
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

  then(onFulfill?: Function, errorHandler?: (e: Error) => any) {

  }

  catch(onReject: (reason: any) => any) {

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