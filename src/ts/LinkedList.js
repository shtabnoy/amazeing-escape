class Node {
  constructor(value, next, prev) {
    this.value = value
    this.next = next
    this.prev = prev
  }
}

export default class LinkedList {
  constructor() {
    this.head = null
    this.tail = null
  }

  addToHead(value) {
    const node = new Node(value, null, this.head)
    if (this.head) {
      this.head.next = node
    } else {
      this.tail = node
    }
    this.head = node
  }

  addToTail(value) {
    const node = new Node(value, this.tail, null)
    if (this.tail) {
      this.tail.prev = node
    } else {
      this.head = node
    }
    this.tail = node
  }

  removeHead() {
    if (!this.head) return null
    const value = this.head.value
    this.head = this.head.prev
    if (this.head) {
      this.head.next = null
    } else {
      this.tail = null
    }
    return value
  }

  removeTail() {
    if (!this.tail) return null
    const value = this.tail.value
    this.tail = this.tail.next
    if (this.tail) {
      this.tail.prev = null
    } else {
      this.head = null
    }
    return value
  }

  search(value) {
    let current = this.head
    while (current) {
      if (current.value === value) return value
      current = current.prev
    }
    return null
  }

  indexOf(value) {
    const indexes = []
    let current = this.tail
    let index = 0
    while (current) {
      if (current.value === value) indexes.push(index)
      current = current.next
      index++
    }
    return indexes
  }
}
