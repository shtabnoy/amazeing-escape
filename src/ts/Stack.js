export default class Stack {
  constructor(...items) {
    this.reverse = false
    this.stack = [...items]
  }

  push(...items) {
    return this.reverse
      ? this.stack.unshift(...items)
      : this.stack.push(...items)
  }

  pop() {
    return this.reverse ? this.stack.shift() : this.stack.pop()
  }
}
