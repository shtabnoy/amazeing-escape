export default class Tree {
  constructor(value) {
    this.value = value
    this.left = null
    this.right = null
  }

  insert(value) {
    if (value <= this.value) {
      if (!this.left) this.left = new Tree(value)
      else this.left.insert(value)
    } else {
      if (!this.right) this.right = new Tree(value)
      else this.right.insert(value)
    }
  }

  contains(value) {
    if (value === this.value) return true
    if (value < this.value) {
      if (!this.left) return false
      else return this.left.contains(value)
    } else {
      if (!this.right) return false
      else return this.right.contains(value)
    }
  }

  depthFirstTraverse(order, callback) {
    order === 'pre' && callback(this.value)
    this.left && this.left.depthFirstTraverse(order, callback)
    order === 'in' && callback(this.value)
    this.right && this.right.depthFirstTraverse(order, callback)
    order === 'post' && callback(this.value)
  }

  breadthFirstTraverse(callback) {
    const queue = [this]
    while (queue.length) {
      const root = queue.shift()
      callback(root.value)
      root.left && queue.push(root.left)
      root.right && queue.push(root.right)
    }
  }

  getMinValue() {
    if (this.left) return this.left.getMinValue()
    return this.value
  }

  getMaxValue() {
    if (this.right) return this.right.getMaxValue()
    return this.value
  }
}
