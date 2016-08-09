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
  public status: number = 0

  private _value: T
  private _rejectReason: any

  private onResolvedCallback: Array<any> = []
  private onRejectedCallback: Array<any> = []

  /**
   * 这里回忆一下 Promise 是如何被 new 出来的
   * new Promise((resolve, reject) => {
   *   resolve(x)
   * })
   * 所以这里 executor 中的 resolve 与 reject 其实是从 Promise 的 constructor 里面传入的
   */
  constructor(executor: (resolve: (value: T) => void, reject: (reason: any) => void) => any) {
    this.onResolvedCallback = []
    this.onRejectedCallback = []

    try {
      executor(this._resolve.bind(this), this._reject.bind(this))
    }catch (e) {
      this._reject(e)
    }
  }
  
  then<U>(onFulfill?: Function, errorHandler?: (e: Error) => any): MyPromise<U> {
    if(this.status === 0) {
      // 如果当前的 Promise 还处于 pending 状态，我们并不能确定调用 onResolved 还是 onRejected
      return new MyPromise<U>((resolve, reject) => {
        this.onResolvedCallback.push((val) => {
          try {
            const x = onFulfill(this._value)
            if (x instanceof Promise) {
              x.then(resolve, reject)
            }
            resolve(x)
          } catch (e) {
            reject(e)
          }
        })

        this.onRejectedCallback.push((reason) => {
          try {
            const x = onFulfill(this._rejectReason)
            if (x instanceof Promise) {
              x.then(resolve, reject)
            }
            resolve(x)
          } catch (e) {
            reject(e)
          }
        })
      })
    }

    if(this.status === 1) {
      return new MyPromise<U>((resolve, reject) => {
        try {
          const x = onFulfill(this._value)
          if (x instanceof Promise) {
            x.then(resolve, reject)
          }
          resolve(x)
        } catch (e) {
          reject(e)
        }
      })
    }

    if(this.status === 2) {
      return new MyPromise<U>((resolve, reject) => {
        try {
          const x = errorHandler(this._rejectReason)
          if (x instanceof Promise) {
            x.then(resolve, reject)
          }
        } catch (e) {
          reject(e)
        }
      })
    }
  }

  catch<U>(onReject: (reason: any) => any): MyPromise<U> {
    return new MyPromise<U>((resolve, reject) => {
      try {
        const x = onReject(this._rejectReason)
        if (x instanceof Promise) {
          x.then(resolve, reject)
        }
      } catch (e) {
        reject(e)
      }
    })
  }

  private _resolve(value: T) {
    if(this.status === 0) {
      this.status = 1
      this._value = value
      for(let i = 0; i < this.onResolvedCallback.length; i++) {
        this.onResolvedCallback[i](value)
      }
    }
  }

  private _reject(reason: any) {
    if(this.status === 0) {
      this.status = 2
      this._rejectReason = reason
      for(let i = 0; i < this.onRejectedCallback.length; i++) {
        this.onResolvedCallback[i](reason)
      }
    }
  }
}