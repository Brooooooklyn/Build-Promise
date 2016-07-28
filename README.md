# Promise 做中学

## 需要掌握的 TypeScript 知识

TypeScript 语言特性的大多数部分来自于标准的 EMCAScript，这意味着它和原生的 ES2015 / ES2016 是非常相似的。不同的地方仅仅是编写代码时(Design time)的类型系统，在运行时(Run time) TypeScript 编译器会将类型系统从代码中全部擦除，所以得到的代码几乎就是手写的 ES 代码。

考虑选取 TypeScript 作为本教程的开发语言有以下几个考虑：
 
1. 规范中的描述有很多类似
```
void resolve(
  aValue
);
```
的代码描述，这些描述主要是为了描述一个方法或者一个函数的行为，使用 TypeScript 更能在写代码的时候体会到函数或者方法的这种行为。

2. 更好的类型与静态检查
我在编写的代码量很少的时期，经常会因为拼写错误、传参错误、忘记 return 等低级错误导致程序无法运行，而 TypeScript 可以在根源上杜绝这种行为，让我们更能将精力集中在代码的实现上。

3. 例子中将会使用 `mocha` 与 `chai` 等你可能没有使用过的东西来编写测试代码，TypeScript 的 `intellisense` 功能能更好的在不用随时翻 api 文档的情况下快速上手这些简单的工具。

以下我来介绍一下 TypeScript 中几个在下面的代码中会用到的特性:

### 类型
可以参考最简单的一个赋值语句：

```js
// ES2015
const a = 1
```

```ts
// TypeScript
const a: number = 1
```

一个变量或者一个参数或者一个对象上的属性，可以在其后面加上 `:` 跟上类型来定义它的类型。

基本类型有： `number` `string` `boolean` `void` `any`, 其中 any 代表任意类型

TypeScript 也允许用接口或者类定义类型，比如内置的几种常用的接口/类 :

```ts
const a: Array<string> = ['bonjour']
const b: Element = document.querySelector('.you-are-pretty')
const c: Date = new Date()
```
这些直接赋值的变量的类型一般不需要手动的加冒号去描述，在你定义的时候类型系统会自动推断出来。

自定义的类型分为 Type, Interface, Class, Function 可以这么写:

定义一个 Function:

```ts
let foo: (arg1: string) => string

// 合法
foo = (bar: string) => {
  return 'love you like a love song'
}

// 会报错
foo = (bar: string) => {
  return 1 + 1
}
```

在定义函数类型的时候，我们有时候会用到 `?` ，来表示一个参数是可选的

```ts
let foo: (arg1: string, arg2?: number) => number

// 合法
foo = (bar: string, extra: number) => {
  return parseInt(bar) + extra
}

// 合法
foo = (bar: string) => {
  return parseInt(bar)
} 
```

在定义函数时，有时候函数的参数也是函数，看起来可能会有点绕:

```ts
// 这里代表着 foo 函数接受一个回调函数，回调函数接受一个 string
let fn: (callback: (foo: string) => string) => number

fn = cb => {
  // setTimeout 的返回值是一个数字，所以是合法的
  return setTimeout(() => {
    const result = cb('Ever')
    console.log(result)
  }, 1000)
}

// 正确的调用
fn(function(arg) {
  return arg + 'glow'
})

// 参数与类型定义不匹配，会报错
fn(function(arg) {
  return !arg
})
```

有时候总写函数描述会让代码非常长，不利于阅读。这个时候可以定义一个 Type，它相当于另一个类型的别名

```ts
// 与上面的写法等价
type EverglowCallback = (foo: string) => string
let fn: (callback: EverglowCallback) => number
```

因为它是别名，所以它还可以描述其它的类型，比如联合类型:

```ts
// 这里 foo 的类型描述代表它可能是 string 类型也可能是 number 类型，这种中间有竖线的类型叫联合类型
let fn: (callback: (foo: string | number) => string) => number

// 用 type 定义这个联合类型
type stringOrNumber = string | number
let fn: (callback: (foo: stringOrNumber) => string) => number
```

interface 通常用来描述一个对象，或者约束一个类：

```ts
interface CEO {
  name: string
  age: number
  money: number
}

interface Company {
  ceo: CEO
  name: string
  logo: string
}

let teambition: Company

// 合法
teambition = {
  ceo: {
    name: 'qijunyuan',
    age: 26,
    money: 2333333333
  },
  name: 'Teambition',
  logo: 'https://dn-st.teambition.net/site/v2.0.0/images/global/logo.svg'
}

// 不合法

teambition = {
  ceo: {
    name: 'qijunyuan',
    age: 26,
    money: 'youqianren'
  },
  name: 'Teambition',
  logo: 'https://dn-st.teambition.net/site/v2.0.0/images/global/logo.svg'
}

```

interface 还可以用来约束一个类的行为，使用 implement 关键字

```ts
interface Company {
  name: string
  work: (employeeNumber: number) => number
  // 可选，但如果有了这个属性就必须为 boolean
  good?: boolean
}

// 合法
class Teambition implement Company {
  name: 'Teambition'
  good: true
  work(employeeNumber: number) {
    return employeeNumber * 10
  }
}

// 不合法，name 类型不正确
class Teambition implement Company {
  name: () => 'Teambition'
  work(employeeNumber: number) {
    return employeeNumber * 10
  }
}

// 不合法，没有 name
class Teambition implement Company {
  work(employeeNumber: number) {
    return employeeNumber * 10
  }
}

```

class 与 interface 在描述其它东西的时候行为是完全一致的

```ts
class Company {
  ceo = 'qijunyuan'
  name = 'Teambition'
}

let a: Company

// 合法
a = {
  ceo: 'qi ta ren',
  name: 'qi ta gong si'
}

// 合法
a = new Company()
```

## 开始项目

```
npm i && npm run typings
```

开发时:

```
npm run watch
```

另开一个命令行，运行信息将在这个窗口中打印

```
npm run nodemon
```
