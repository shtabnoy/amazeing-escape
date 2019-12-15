export enum Direction {
  up = 'up',
  down = 'down',
  left = 'left',
  right = 'right',
}

export type Dir = 'up' | 'down' | 'left' | 'right'

export interface Edge {
  v1: string
  v2: string
  weight: number
}

export interface Vertex {
  edges?: {
    [Direction.up]?: Edge
    [Direction.down]?: Edge
    [Direction.left]?: Edge
    [Direction.right]?: Edge
  }
  dist?: number
}

export default class MazeGraph {
  vertices: {
    [name: string]: Vertex
  }
  edges: Edge[]

  constructor() {
    this.edges = []
    this.vertices = {}
  }

  mst() {
    console.log('starting mst')
    const result = new MazeGraph()
    let vName = Object.keys(this.vertices)[0]
    let v = this.vertices[vName]
    let heap: Edge[] = Object.values(v.edges)
    let min: Edge = null
    while (heap.length > 0) {
      min = heap.reduce((p, c) => (p.weight <= c.weight ? p : c))
      ;[v, vName] = [vName, ...Object.keys(result.vertices)].includes(min.v1)
        ? [this.vertices[min.v2], min.v2]
        : [this.vertices[min.v1], min.v1]
      heap.push(...Object.values(v.edges))
      heap = heap.filter((e, i, a) => a.indexOf(e) === a.lastIndexOf(e))
      result.addEdge(min)
    }
    return result
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

  addEdge(edge: Edge) {
    const v1 = this.vertices[edge.v1]
    const v2 = this.vertices[edge.v2]
    const dir = this.getDir(edge.v1, edge.v2)
    // checking the farthest point
    let dist1 = 0
    let dist2 = 0
    if (!v1 && !v2) {
      dist2 = 1
    } else if (!v1) {
      dist1 = v2.dist + 1
    } else if (!v2) {
      dist2 = v1.dist + 1
    }
    // add v1 to the graph if it doesn't exist
    if (v1) {
      v1.edges[dir] = edge
    } else {
      this.vertices[edge.v1] = {
        edges: {
          [dir]: edge,
        },
        dist: dist1,
      }
    }
    // add v2 to the graph if it doesn't exist
    if (v2) {
      v2.edges[this.getOppositeDir(dir)] = edge
    } else {
      this.vertices[edge.v2] = {
        edges: {
          [this.getOppositeDir(dir)]: edge,
        },
        dist: dist2,
      }
    }
  }
}
