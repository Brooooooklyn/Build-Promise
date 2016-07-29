import * as chai from 'chai'
import { MyPromise } from '../src/app'

const expect = chai.expect

export default describe('Promise A+ spec', () => {
  it('new promise should ok', () => {
    const promise = new MyPromise((resolve, reject) => { })
    expect(promise.status).to.equal(0)
  })

  // 测试异步代码时使用 done 来表示异步执行完毕
  it('onFulfilled should get resolved value', done => {
    const promise = new MyPromise((resolve, reject) => {
      resolve(1)
    })

    promise.then(val => {
      expect(val).to.equal(1)
      done()
    })
  })

  it('onReject in then should get reject reason', done => {
    const reason = 'I am not happy'
    const promise = new MyPromise((resolve, reject) => {
      reject(reason)
    })
    promise.then(null, err => {
      expect(err).to.equal(reason)
      done()
    })
  })

  it('onReject in catch should get reject reason', done => {
    const reason = 'I am not happy'
    const promise = new MyPromise((resolve, reject) => {
      reject(reason)
    })
    promise.catch(err => {
      expect(err).to.equal(reason)
      done()
    })
  })
})
