export enum Direction {
  up, // 0
  down, // 1
  left, // 2
  right, // 3
}

export interface Edge {
  src: string
  dest: string
  weight: number
  dir?: Direction
}

export interface Vertex {
  name: string
  edges: Edge[]
}

export default class NewGraph {
  vertices: Vertex[]
  edges: Edge[]

  constructor() {
    this.vertices = []
    this.edges = []
  }

  addVertex(v: Vertex) {
    this.vertices.push(v)
  }

  getVertex(name: string) {
    return this.vertices.find((v: Vertex) => v.name === name)
  }

  getDir(src: string, dest: string): Direction {
    const [x1, y1] = src.split(',')
    const [x2, y2] = dest.split(',')
    if (Number(x2) - Number(x1) > 0) return Direction.right
    if (Number(x2) - Number(x1) < 0) return Direction.left
    if (Number(y2) - Number(y1) > 0) return Direction.down
    if (Number(y2) - Number(y1) < 0) return Direction.up
  }

  // TODO: split addEdge and addVertex
  addEdge(src: string, dest: string, weight: number) {
    this.edges.push({
      src,
      dest,
      weight,
    })
    const srcVertex = this.vertices.find((v: Vertex) => v.name === src)
    if (srcVertex) {
      srcVertex.edges.push({
        src,
        dest,
        weight,
        dir: this.getDir(src, dest),
      })
    } else {
      this.addVertex({
        name: src,
        edges: [
          {
            src,
            dest,
            weight,
            dir: this.getDir(src, dest),
          },
        ],
      })
    }
    const destVertex = this.vertices.find((v: Vertex) => v.name === dest)
    if (destVertex) {
      destVertex.edges.push({
        src: dest,
        dest: src,
        weight,
        dir: this.getDir(dest, src),
      })
    } else {
      this.addVertex({
        name: dest,
        edges: [
          {
            src: dest,
            dest: src,
            weight,
            dir: this.getDir(dest, src),
          },
        ],
      })
    }
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
