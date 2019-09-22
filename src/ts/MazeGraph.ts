export enum Direction {
  right, // 0
  down, // 1
  left, // 2
  up, // 3
}

export interface Edge {
  src: string
  dest: string
  weight: number
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

export default class MazeGraph {
  vertices: Vertex[]
  edges: Edge[]

  constructor() {
    this.vertices = []
    this.edges = []
  }

  mst() {
    const result = new MazeGraph()
    let v = this.vertices[0]
    let heap: Edge[] = Object.values(v.edges)
    let min: Edge = {
      src: '',
      dest: '',
      weight: Infinity,
    }
    while (heap.length > 0) {
      for (let edge of heap) {
        min = edge.weight < min.weight ? edge : min
      }
      // TODO: Pass just an object { src, dest, weight, dir } to create an edge
      result.addEdge(min.src, min.dest, min.weight)
      v = this.getVertex(min.dest)
      // Add edges coming out from new vertex 'v'
      heap = heap.concat(Object.values(v.edges))
      // Remove min edge
      heap = heap.filter(
        (edge: Edge) =>
          !(
            (edge.src === min.src && edge.dest === min.dest) ||
            (edge.src === min.dest && edge.dest === min.src)
          )
      )
      const srcs = result.edges.map(e => e.src)
      const dests = result.edges.map(e => e.dest)
      // Remove loops
      heap = heap.filter(
        (edge: Edge) => !(srcs.includes(edge.dest) || dests.includes(edge.dest))
      )
      min = {
        src: '',
        dest: '',
        weight: Infinity,
      }
    }
    return result
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
}
