import * as chai from 'chai'
import { MyPromise } from '../src/app'

const expect = chai.expect

export default describe('Promise A+ spec', () => {
  it('new promise should ok', () => {
    // tslint:disable-next-line
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

  it('static resolve should ok', done => {
    const promise = MyPromise.resolve(1)
    promise.then(val => {
      expect(val).to.equal(1)
      done()
    })
  })

  it('static reject should ok', done => {
    const reason = new Error('your application is unhappy')
    const promise = MyPromise.reject(reason)

    promise.catch(reason => {
      expect(reason).to.deep.equal(reason)
      done()
    })
  })

  it('then method should return a new Promise', done => {
    const promise = MyPromise
      .resolve(1)
      .then(r => r + 1)

    promise.then(r => {
      expect(r).to.equal(2)
      done()
    })
  })

  it('catch method should return a new promise', done => {
    const promise = MyPromise
      .reject(1)

    promise.then()
      .catch(reason => {
        expect(reason).to.equal(1)
        done()
      })
  })
})
