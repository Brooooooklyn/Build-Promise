import 'tslib'
/**
 * Promise 的规范描述 https://developer.mozilla.org/en-US/docs/Mozilla/JavaScript_code_modules/Promise.jsm/Promise
 * 为了表达更加准确，将使用 TypeScript 编写例子
 */

export class Promise <T> {
  /**
   * 0 是 pending
   * 1 是 fulfilled
   * 2 是 rejected
   */
  private status = 0

  constructor(executor: (resolve: (value: T) => void, reject: (reason: any) => void) => any) {

  }

  then(onFulfill?: Function, errorHandler?: (e: Error) => any) {

  }

  catch(onReject: (reason: any) => any) {

  }
}