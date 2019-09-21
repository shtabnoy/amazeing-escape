export enum Direction {
  right, // 3
  down, // 1
  left, // 2
  up, // 0
}

export interface Edge {
  src: string
  dest: string
  weight: number
  // dir?: Direction
}

export interface Vertex {
  name: string
  edges: {
    [Direction.up]?: Edge
    [Direction.down]?: Edge
    [Direction.left]?: Edge
    [Direction.right]?: Edge
  }
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
    let edgeToAdd = {
      src,
      dest,
      weight,
    }
    let dir = this.getDir(src, dest)
    if (srcVertex) {
      srcVertex.edges[dir] = edgeToAdd
    } else {
      this.addVertex({
        name: src,
        edges: { [dir]: edgeToAdd },
      })
    }
    const destVertex = this.vertices.find((v: Vertex) => v.name === dest)
    edgeToAdd = {
      src: dest,
      dest: src,
      weight,
    }
    dir = this.getDir(dest, src)
    if (destVertex) {
      destVertex.edges[dir] = edgeToAdd
    } else {
      this.addVertex({
        name: dest,
        edges: { [dir]: edgeToAdd },
      })
    }
  }

  // getVertexEdges(v: string): Edge[] {
  //   const srcs = this.edges.filter((edge: Edge) => edge.src === v)
  //   let dests = this.edges.filter((edge: Edge) => edge.dest === v)
  //   // reverse src and dest if v is dest
  //   dests = dests.map((edge: Edge) => {
  //     let newEdge = { ...edge }
  //     let src = newEdge.src
  //     let dest = newEdge.dest
  //     newEdge.dest = src
  //     newEdge.src = dest
  //     return newEdge
  //   })
  //   return srcs.concat(dests)
  // }
}
