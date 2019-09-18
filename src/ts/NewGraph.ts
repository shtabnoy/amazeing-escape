export enum Direction {
  up,
  down,
  left,
  right,
}

export interface Edge {
  src: string
  dest: string
  weight: number
  dir?: Direction
}

export default class NewGraph {
  vertices: string[]
  edges: Edge[]

  constructor() {
    this.vertices = []
    this.edges = []
  }

  addVertex(v: string) {
    this.vertices.push(v)
  }

  addEdge(src: string, dest: string, weight: number, dir?: Direction) {
    if (!this.vertices.find(v => v === src)) this.addVertex(src)
    if (!this.vertices.find(v => v === dest)) this.addVertex(src)
    this.edges.push({
      src,
      dest,
      weight,
      dir,
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
