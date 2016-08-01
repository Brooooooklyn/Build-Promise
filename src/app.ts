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
  private onResolvedCallback: any[]
  private onRejectedCallback: any[]

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

  then<U>(onFulfill?: (value?: T) => any, errorHandler?: (e: Error) => any): MyPromise<U> {
    onFulfill = onFulfill ? onFulfill : function (value: any) { return value }
    errorHandler = errorHandler ? errorHandler : function (err: Error) { return err }

    if (this.status === 0) {
      this.onResolvedCallback.push(() => {
        let x = onFulfill(this._value)
        try {
          return MyPromise.resolve(x)
        } catch (e) {
          return MyPromise.reject(e)
        }
      })
      this.onRejectedCallback.push(() => {
        let x = errorHandler(this._rejectReason)
        try {
          if (x instanceof MyPromise) {
            x.then(MyPromise.resolve, MyPromise.reject)
          }
        } catch (e) {
          return MyPromise.reject(x)
        }
      })
    }
    if (this.status === 1) {
      let x = onFulfill(this._value)
      try {
        if (x instanceof MyPromise) {
          x.then(MyPromise.resolve, MyPromise.reject)
        }
        return MyPromise.resolve(x)
      } catch (e) {
        return MyPromise.reject(e)
      }
    }
    if (this.status === 2) {
      let x = errorHandler(this._rejectReason)
      try {
        if (x instanceof MyPromise) {
          x.then(MyPromise.resolve, MyPromise.reject)
        }
        return MyPromise.reject(x)
      } catch (e) {
        return MyPromise.reject(e)
      }
    }
  }

<<<<<<< 41bf5950dbe3a254e44df618f3410d7147fece91
   catch(onReject: (reason: any) => any): MyPromise<T> {
     let x = onReject(this._rejectReason)
      try {
        if (x instanceof MyPromise) {
          x.then(MyPromise.resolve, MyPromise.reject)
        }
      } catch (e) {
        return MyPromise.reject(x)
      }
=======
  catch(onReject: (reason: any) => any) {
    let promise2;
    return promise2 =  new MyPromise((resolve, reject) => {
      this.then(null, onReject);
    })
>>>>>>> catch api return a promise
  }

  private _resolve(value: T) {
      if (this.status === 0) {
        this.status = 1
        this._value = value
        for (let i = 0; i < this.onResolvedCallback.length; i++) {
          this.onResolvedCallback[i](value)
        }
      }
  }

  private _reject(reason: any) {
      if (this.status === 0) {
        this._rejectReason = reason
        this.status = 2
        for (let i = 0; i < this.onRejectedCallback.length; i++) {
          this.onRejectedCallback[i](reason);
        }
      }
  }
}