import { Wall } from './types'
import MazeGraph, { Direction, Vertex } from './MazeGraph'
import { rnd } from './utils'
import { CANVAS_WIDTH, CANVAS_HEIGHT, OFFSET_X, OFFSET_Y } from './constants'

export default class Maze {
  private walls: Wall[]
  private groundImg: HTMLImageElement
  private rooms: any[]

  constructor(
    width: number,
    height: number,
    config: any // TODO: Define the interface
  ) {
    this.groundImg = config.groundImg
    const g = this.createMazeGraph(width, height)
    const mst = g.mst()
    this.rooms = []
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
    const h = d / 2
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
      const [rx, ry] = vertex.name.split(',')
      const room: any = {
        name: [Number(rx), Number(ry)],
        a: { x: vx * rw, y: vy * rw },
        b: { x: (vx + 1) * rw, y: (vy + 1) * rw },
        walls: {},
      }
      if (!vertex.edges[Direction.up]) {
        room.walls[Direction.up] = [
          { x: vx * rw, y: vy * rw },
          { x: (vx + 1) * rw, y: vy * rw + d },
        ]
      }
      if (!vertex.edges[Direction.down]) {
        room.walls[Direction.down] = [
          { x: vx * rw, y: (vy + 1) * rw },
          { x: (vx + 1) * rw, y: (vy + 1) * rw + d },
        ]
      }
      if (!vertex.edges[Direction.left]) {
        room.walls[Direction.left] = [
          { x: vx * rw, y: vy * rw },
          { x: vx * rw + d, y: (vy + 1) * rw + d },
        ]
      }
      if (!vertex.edges[Direction.right]) {
        room.walls[Direction.right] = [
          { x: (vx + 1) * rw, y: vy * rw },
          { x: (vx + 1) * rw + d, y: (vy + 1) * rw + d },
        ]
      }
      this.rooms.push(room)
    })
    return walls
  }

  drawWalls = (ctx: CanvasRenderingContext2D) => {
    this.walls.forEach((wall: Wall) => {
      // let horizontal = wall.b.x - wall.a.x > wall.b.y - wall.a.y
      ctx.fillStyle = '#6aa3e6'
      ctx.strokeStyle = '#111'

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
      let lw = 5
      ctx.lineWidth = lw
      let x = wall.a.x + lw
      let y = wall.a.y + lw
      let w = wall.b.x - wall.a.x - lw
      let h = wall.b.y - wall.a.y - lw
      ctx.fillRect(x, y, w, h)
      ctx.strokeRect(x, y, w, h)
    })
  }

  drawGround = (ctx: CanvasRenderingContext2D) => {
    let translatedX = ctx.getTransform().e / 2
    let translatedY = ctx.getTransform().f / 2
    // ctx.save()
    ctx.fillStyle = ctx.createPattern(this.groundImg, 'repeat')
    ctx.fillRect(
      0 - translatedX < 0 ? -1 : 0 - translatedX,
      0 - translatedY < 0 ? -1 : 0 - translatedY,
      CANVAS_WIDTH - translatedX + OFFSET_X,
      CANVAS_HEIGHT - translatedY + OFFSET_Y
    )
    // ctx.restore()
  }

  getWalls() {
    return this.walls
  }

  getRooms() {
    return this.rooms
  }
}
