export interface Edge {
  src: string
  dest: string
  weight: number
}

export default class NewGraph {
  vertices: any
  edges: Edge[]

  constructor() {
    this.vertices = {}
    this.edges = []
  }

  addVertex(v: string) {
    this.vertices[v] = v
  }

  addEdge(src: string, dest: string, weight: number) {
    if (!this.vertices[src]) this.addVertex(src)
    if (!this.vertices[dest]) this.addVertex(dest)
    this.edges.push({
      src: src,
      dest: dest,
      weight: weight,
    })
  }

  getVertexEdges(v: string): Edge[] {
    const srcs = this.edges.filter((edge: Edge) => edge.src === v)
    let dests = this.edges.filter((edge: Edge) => edge.dest === v)
    // reverse src and dest if v is dest
    dests = dests.map((edge: Edge) => {
      let newEdge = { ...edge }
      let src = newEdge.src
      let dest = newEdge.dest
      newEdge.dest = src
      newEdge.src = dest
      return newEdge
    })
    return srcs.concat(dests)
  }
}
