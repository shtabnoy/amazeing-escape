export enum Direction {
  up = 'up',
  down = 'down',
  left = 'left',
  right = 'right',
}

export interface Edge {
  v1: string
  v2: string
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

export interface Vertex1 {
  [Direction.up]?: Edge
  [Direction.down]?: Edge
  [Direction.left]?: Edge
  [Direction.right]?: Edge
}

export default class MazeGraph {
  vertices: Vertex[]
  vertices1: {
    [name: string]: Vertex1
  }
  edges: Edge[]

  constructor() {
    this.vertices = []
    this.edges = []
    this.vertices1 = {}
  }

  mst() {
    const result = new MazeGraph()
    let v = this.vertices[0]
    let heap: Edge[] = Object.values(v.edges)
    let min: Edge = null
    while (heap.length > 0) {
      min = heap.reduce((p, c) => (p.weight <= c.weight ? p : c))
      v = [v.name, ...result.vertices.map(ver => ver.name)].includes(min.v1)
        ? this.vertices.find(v => v.name === min.v2)
        : this.vertices.find(v => v.name === min.v1)
      heap.push(...Object.values(v.edges))
      heap = heap.filter((e, i, a) => a.indexOf(e) === a.lastIndexOf(e))
      result.addEdge(min)
    }
    return result
  }

  mst1() {
    const result = new MazeGraph()
    let vName = Object.keys(this.vertices1)[0]
    let v = this.vertices1[vName]
    let heap: Edge[] = Object.values(v)
    let min: Edge = null
    while (heap.length > 0) {
      min = heap.reduce((p, c) => (p.weight <= c.weight ? p : c))
      ;[v, vName] = [vName, ...Object.keys(result.vertices1)].includes(min.v1)
        ? [this.vertices1[min.v2], min.v2]
        : [this.vertices1[min.v1], min.v1]
      heap.push(...Object.values(v))
      heap = heap.filter((e, i, a) => a.indexOf(e) === a.lastIndexOf(e))
      result.addEdge1(min)
    }
    return result
  }

  addVertex(v: Vertex) {
    this.vertices.push(v)
  }

  getDir(v1: string, v2: string) {
    const xy1 = v1.split(',')
    const xy2 = v2.split(',')
    const vx1 = Number(xy1[0])
    const vy1 = Number(xy1[1])
    const vx2 = Number(xy2[0])
    const vy2 = Number(xy2[1])
    if (vx2 - vx1 === 1) return Direction.right
    if (vx2 - vx1 === -1) return Direction.left
    if (vy2 - vy1 === 1) return Direction.down
    if (vy2 - vy1 === -1) return Direction.up
  }

  getOppositeDir(dir: Direction) {
    if (dir === Direction.down) return Direction.up
    if (dir === Direction.up) return Direction.down
    if (dir === Direction.right) return Direction.left
    if (dir === Direction.left) return Direction.right
  }

  addEdge1(edge: Edge) {
    const v1 = this.vertices1[edge.v1]
    const v2 = this.vertices1[edge.v2]
    const dir = this.getDir(edge.v1, edge.v2)
    // add v1 to the graph if it doesn't exist
    if (v1) {
      v1[dir] = edge
    } else {
      this.vertices1[edge.v1] = {
        [dir]: edge,
      }
    }
    // add v2 to the graph if it doesn't exist
    if (v2) {
      v2[this.getOppositeDir(dir)] = edge
    } else {
      this.vertices1[edge.v2] = {
        [this.getOppositeDir(dir)]: edge,
      }
    }
  }

  addEdge(edge: Edge) {
    // this.edges.push(edge)
    const v1 = this.vertices.find((v: Vertex) => v.name === edge.v1)
    const v2 = this.vertices.find((v: Vertex) => v.name === edge.v2)
    const dir = this.getDir(edge.v1, edge.v2)
    // add v1 to the graph if it doesn't exist
    if (v1) {
      v1.edges[dir] = edge
    } else {
      this.addVertex({
        name: edge.v1,
        edges: {
          [dir]: edge,
        },
      })
    }
    // add v2 to the graph if it doesn't exist
    if (v2) {
      v2.edges[this.getOppositeDir(dir)] = edge
    } else {
      this.addVertex({
        name: edge.v2,
        edges: {
          [this.getOppositeDir(dir)]: edge,
        },
      })
    }
  }
}
