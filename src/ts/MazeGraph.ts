import { Point } from './types'

export enum Direction {
  right, // 0
  down, // 1
  left, // 2
  up, // 3
}

export interface Edge {
  v1: string
  v2: string
  weight: number
  dir?: Direction
}
export interface Vertex {
  name: string
  edges: Edge[]
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
    let heap: Edge[] = v.edges
    let min: Edge = null
    while (heap.length > 0) {
      min = heap.reduce((p, c) => (p.weight <= c.weight ? p : c))
      v = [v.name, ...result.vertices.map(ver => ver.name)].includes(min.v1)
        ? this.vertices.find(v => v.name === min.v2)
        : this.vertices.find(v => v.name === min.v1)
      heap.push(...v.edges)
      heap = heap.filter((e, i, a) => a.indexOf(e) === a.lastIndexOf(e))
      result.addEdge(min)
    }
    return result
  }

  addVertex(v: Vertex) {
    this.vertices.push(v)
  }

  getVertex(name: string) {
    return this.vertices.find((v: Vertex) => v.name === name)
  }

  // TODO: split addEdge and addVertex
  addEdge(edge: Edge) {
    this.edges.push(edge)
    const v1 = this.vertices.find((v: Vertex) => v.name === edge.v1)
    const v2 = this.vertices.find((v: Vertex) => v.name === edge.v2)
    // add v1 to the graph if it doesn't exist
    if (v1) {
      v1.edges.push(edge)
    } else {
      this.addVertex({
        name: edge.v1,
        edges: [edge],
      })
    }
    // add v2 to the graph if it doesn't exist
    if (v2) {
      v2.edges.push(edge)
    } else {
      this.addVertex({
        name: edge.v2,
        edges: [edge],
      })
    }
  }
}
