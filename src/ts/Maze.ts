import { Wall } from './types'
import MazeGraph, { Direction, Vertex } from './MazeGraph'
import { rnd } from './utils'
import { CANVAS_WIDTH, CANVAS_HEIGHT } from './constants'

export default class Maze {
  private ctx: CanvasRenderingContext2D
  private walls: Wall[]

  constructor(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    config?: any
  ) {
    this.ctx = ctx
    const g = this.createMazeGraph(width, height)
    const mst = g.mst()
    this.walls = this.createWalls(mst, config.rw, config.d)
  }

  private createMazeGraph = (w: number, h: number): MazeGraph => {
    const g = new MazeGraph()
    if (w < 2 || h < 2) return g

    for (let i = 0; i < w; i++) {
      for (let j = 0; j < h; j++) {
        if (i != w - 1) g.addEdge(`${i},${j}`, `${i + 1},${j}`, rnd())
        if (j < h - 1) g.addEdge(`${i},${j}`, `${i},${j + 1}`, rnd())
      }
    }

    return g
  }

  private createWalls(
    g: MazeGraph,
    rw: number, // room width
    d: number = 0 // depth
  ) {
    const walls: Wall[] = []
    g.vertices.forEach((vertex: Vertex) => {
      const xy = vertex.name.split(',')
      const vx = Number(xy[0])
      const vy = Number(xy[1])
      if (!vertex.edges[Direction.up]) {
        walls.push({
          a: { x: vx * rw, y: vy * rw },
          b: { x: (vx + 1) * rw, y: vy * rw + d },
        })
      }
      if (!vertex.edges[Direction.down]) {
        walls.push({
          a: { x: vx * rw, y: (vy + 1) * rw },
          b: { x: (vx + 1) * rw, y: (vy + 1) * rw + d },
        })
      }
      if (!vertex.edges[Direction.left]) {
        walls.push({
          a: { x: vx * rw, y: vy * rw },
          b: { x: vx * rw + d, y: (vy + 1) * rw + d },
        })
      }
      if (!vertex.edges[Direction.right]) {
        walls.push({
          a: { x: (vx + 1) * rw, y: vy * rw },
          b: { x: (vx + 1) * rw + d, y: (vy + 1) * rw + d },
        })
      }
    })
    return walls
  }

  clear(x: number, y: number, w: number, h: number) {
    this.ctx.clearRect(x, y, w, h)
  }

  render() {
    this.walls.forEach((wall: Wall) => {
      this.ctx.beginPath()
      this.ctx.strokeRect(
        wall.a.x,
        wall.a.y,
        wall.b.x - wall.a.x,
        wall.b.y - wall.a.y
      )
      this.ctx.stroke()
    })
  }

  getWalls() {
    return this.walls
  }
}
