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
    // this.edges = {}
  }

  addVertex(v: string) {
    this.vertices[v] = v
  }

  removeVertex(v: string) {}

  addEdge(src: string, dest: string, weight: number) {
    if (!this.vertices[src]) this.addVertex(src)
    if (!this.vertices[dest]) this.addVertex(dest)
    // this.edges[`${src}_${dest}`] = weight
    this.edges.push({
      src: src,
      dest: dest,
      weight: weight,
    })
  }

  getVertexEdges(v: string): Edge[] {
    // return Object.entries(this.edges).filter(
    //   (value: [string, number]) => value[0].split('_')[0] === v
    // )
    const srcs = this.edges.filter((edge: Edge) => edge.src === v)
    const dests = this.edges.filter((edge: Edge) => edge.dest === v)
    dests.forEach((edge: Edge) => {
      let src = edge.src
      edge.src = edge.dest
      edge.dest = src
    })
    // return this.edges.filter((edge: any) => edge.src === v || edge.dest === v)
    return srcs.concat(dests)
  }

  getEdgeEnd(edge: string) {
    return edge.split('_')[1]
  }
  // getEdgeEnd(edge: string) {
  //   return edge.split('_')[1]
  // }

  removeEdge(src: string, dest: string) {}
}
