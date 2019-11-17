import { Wall, Point } from './types'
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
    // console.log(g)
    // console.log(mst)
    this.rooms = []
    this.createRooms(mst, config.rw, config.d)
  }

  private createMazeGraph = (w: number, h: number): MazeGraph => {
    const g = new MazeGraph()
    if (w < 2 || h < 2) return g

    for (let i = 0; i < w; i++) {
      for (let j = 0; j < h; j++) {
        if (i != w - 1)
          g.addEdge({
            v1: `${i},${j}`,
            v2: `${i + 1},${j}`,
            weight: rnd(),
          })
        if (j < h - 1)
          g.addEdge({
            v1: `${i},${j}`,
            v2: `${i},${j + 1}`,
            weight: rnd(),
          })
      }
    }

    return g
  }

  private createRooms(
    g: MazeGraph,
    rw: number, // room width
    d: number = 0 // depth
  ) {
    // const walls: Wall[] = []
    // const h = d / 2
    g.vertices.forEach((vertex: Vertex) => {
      const xy = vertex.name.split(',')
      const vx = Number(xy[0])
      const vy = Number(xy[1])
      //   if (!vertex.edges[Direction.up]) {
      //     walls.push({
      //       a: { x: vx * rw, y: vy * rw },
      //       b: { x: (vx + 1) * rw, y: vy * rw + d },
      //     })
      //   }
      //   if (!vertex.edges[Direction.down]) {
      //     walls.push({
      //       a: { x: vx * rw, y: (vy + 1) * rw },
      //       b: { x: (vx + 1) * rw, y: (vy + 1) * rw + d },
      //     })
      //   }
      //   if (!vertex.edges[Direction.left]) {
      //     walls.push({
      //       a: { x: vx * rw, y: vy * rw },
      //       b: { x: vx * rw + d, y: (vy + 1) * rw + d },
      //     })
      //   }
      //   if (!vertex.edges[Direction.right]) {
      //     walls.push({
      //       a: { x: (vx + 1) * rw, y: vy * rw },
      //       b: { x: (vx + 1) * rw + d, y: (vy + 1) * rw + d },
      //     })
      //   }
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
    console.log(this.rooms)
    // return walls
  }

  drawWalls = (ctx: CanvasRenderingContext2D) => {
    this.rooms.forEach(room => {
      Object.values(room.walls).forEach((wall: [Point, Point]) => {
        ctx.fillStyle = '#6aa3e6'
        ctx.strokeStyle = '#111'

        let lw = 5
        ctx.lineWidth = lw
        let x = wall[0].x + lw
        let y = wall[0].y + lw
        let w = wall[1].x - wall[0].x - lw
        let h = wall[1].y - wall[0].y - lw
        ctx.fillRect(x, y, w, h)
        ctx.strokeRect(x, y, w, h)
      })
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
