interface AdjListValue {
  [vertex: string]: number
  degree: number
}

interface AdjList {
  [vertex: string]: AdjListValue
}

export default class Graph {
  order: number
  AdjList: AdjList

  constructor() {
    this.order = 0 // number of vertices
    this.AdjList = <AdjList>{}
  }

  addVertex(v: string) {
    this.AdjList[v] = <AdjListValue>{}
    Object.defineProperty(this.AdjList[v], 'degree', {
      enumerable: false,
      writable: true,
      configurable: false,
      value: 0,
    })
    this.order++
  }

  removeVertex(v: string) {
    delete this.AdjList[v]
    this.order--
  }

  addEdge(src: string, dest: string, weight: number) {
    if (this.AdjList[src][dest]) return
    this.AdjList[src][dest] = weight
    this.AdjList[dest][src] = weight
    this.AdjList[src].degree++
    this.AdjList[dest].degree++
  }

  removeEdge(src: string, dest: string) {
    if (!this.AdjList[src][dest]) return
    delete this.AdjList[src][dest]
    delete this.AdjList[dest][src]
    this.AdjList[src].degree--
    this.AdjList[dest].degree--
  }
}
