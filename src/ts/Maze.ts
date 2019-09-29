import { Wall } from './types'
import MazeGraph, { Direction, Vertex } from './MazeGraph'
import { rnd } from './utils'
import { CANVAS_WIDTH, CANVAS_HEIGHT, OFFSET_X, OFFSET_Y } from './constants'

export default class Maze {
  private ctx: CanvasRenderingContext2D
  private walls: Wall[]
  private groundImg: HTMLImageElement

  constructor(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    config: any // TODO: Define the interface
  ) {
    this.ctx = ctx
    this.groundImg = config.groundImg
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

  drawWalls = () => {
    this.walls.forEach((wall: Wall) => {
      // let horizontal = wall.b.x - wall.a.x > wall.b.y - wall.a.y
      this.ctx.fillStyle = '#6aa3e6'
      this.ctx.strokeStyle = '#111'
      this.ctx.lineWidth = 10
      // let dr = 15
      // if (horizontal) {
      //   this.ctx.strokeRect(
      //     wall.a.x,
      //     wall.a.y,
      //     wall.b.x - wall.a.x,
      //     wall.b.y - wall.a.y
      //   )
      // } else {
      //   this.ctx.beginPath()
      //   this.ctx.moveTo(wall.a.x + dr, wall.a.y)
      //   this.ctx.lineTo(wall.a.x, wall.a.y + dr)
      //   this.ctx.lineTo(wall.a.x, wall.b.y)
      //   this.ctx.lineTo(wall.b.x, wall.b.y)
      //   this.ctx.lineTo(wall.b.x, wall.a.y + dr)
      //   this.ctx.lineTo(wall.b.x - dr, wall.a.y)
      //   this.ctx.lineTo(wall.b.x - dr, wall.b.y - dr)
      //   this.ctx.lineTo(wall.a.x + dr, wall.b.y - dr)
      //   this.ctx.lineTo(wall.a.x + dr, wall.a.y)

      //   this.ctx.fill()
      //   this.ctx.moveTo(wall.a.x, wall.b.y)
      //   this.ctx.lineTo(wall.a.x + dr, wall.b.y - dr)

      //   this.ctx.moveTo(wall.b.x, wall.b.y)
      //   this.ctx.lineTo(wall.b.x - dr, wall.b.y - dr)
      //   this.ctx.stroke()
      //   this.ctx.fillStyle = '#000'
      //   this.ctx.fillRect(
      //     wall.a.x + dr,
      //     wall.a.y,
      //     wall.b.x - wall.a.x - 2 * dr,
      //     wall.b.y - wall.a.y - dr
      //   )
      // }

      // this.ctx.save()
      // this.ctx.fillStyle = this.ctx.createPattern(this.wallImg, 'repeat')
      this.ctx.strokeRect(
        wall.a.x,
        wall.a.y,
        wall.b.x - wall.a.x,
        wall.b.y - wall.a.y
      )
      this.ctx.fillRect(
        wall.a.x,
        wall.a.y,
        wall.b.x - wall.a.x,
        wall.b.y - wall.a.y
      )
      // this.ctx.restore()
    })
  }

  drawGround = () => {
    let translatedX = this.ctx.getTransform().e / 2
    let translatedY = this.ctx.getTransform().f / 2
    // this.ctx.save()
    this.ctx.fillStyle = this.ctx.createPattern(this.groundImg, 'repeat')
    this.ctx.fillRect(
      0 - translatedX < 0 ? -1 : 0 - translatedX,
      0 - translatedY < 0 ? -1 : 0 - translatedY,
      CANVAS_WIDTH - translatedX + OFFSET_X,
      CANVAS_HEIGHT - translatedY + OFFSET_Y
    )
    // this.ctx.restore()
  }

  render() {
    this.drawGround()
    this.drawWalls()
  }

  getWalls() {
    return this.walls
  }
}
