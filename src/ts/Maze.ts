import MazeGraph, { Direction, Vertex } from './MazeGraph'
import { rnd } from './utils'
import { CANVAS_WIDTH, CANVAS_HEIGHT, OFFSET_X, OFFSET_Y } from './constants'

type P = [number, number]
type Block4 = [P, P, P, P]
type Block6 = [P, P, P, P, P, P]
type Block8 = [P, P, P, P, P, P, P, P]
// type Wall = Block4 | Block6 | Block8
type W = [P, P]
interface Wall {
  coords: W
  img: string
}

interface Walls {
  [name: string]: Wall
}
interface Room {
  walls?: any[]
  a?: any
  b?: any
  name?: [number, number]
}

export default class Maze {
  private walls: Wall[]
  private groundImg: HTMLImageElement
  private rooms: any

  constructor(
    width: number,
    height: number,
    config: any // TODO: Define the interface
  ) {
    this.groundImg = config.groundImg
    const g = this.createMazeGraph(width, height)
    const mst = g.mst()
    const mst1 = g.mst1()
    this.rooms = []
    this.createRooms(mst, config.rw, config.d)
  }

  private createMazeGraph = (w: number, h: number): MazeGraph => {
    const g = new MazeGraph()
    if (w < 2 || h < 2) return g

    for (let i = 0; i < w; i++) {
      for (let j = 0; j < h; j++) {
        if (i != w - 1) {
          const w = rnd()
          g.addEdge({
            v1: `${i},${j}`,
            v2: `${i + 1},${j}`,
            weight: w,
          })
          g.addEdge1({
            v1: `${i},${j}`,
            v2: `${i + 1},${j}`,
            weight: w,
          })
        }
        if (j < h - 1) {
          const w = rnd()
          g.addEdge({
            v1: `${i},${j}`,
            v2: `${i},${j + 1}`,
            weight: w,
          })
          g.addEdge1({
            v1: `${i},${j}`,
            v2: `${i},${j + 1}`,
            weight: w,
          })
        }
      }
    }

    return g
  }

  private createRooms(
    g: MazeGraph,
    rw: number, // room width
    d: number = 0 // depth
  ) {
    g.vertices.forEach((vertex: Vertex) => {
      const xy = vertex.name.split(',')
      const vx = Number(xy[0])
      const vy = Number(xy[1])
      const room: Room = {
        a: { x: vx * rw, y: vy * rw },
        b: { x: (vx + 1) * rw, y: (vy + 1) * rw },
        walls: [],
      }

      const x1 = vx * rw // left X
      const x2 = (vx + 1) * rw // right X
      const y1 = vy * rw // top Y
      const y2 = (vy + 1) * rw // bottom Y

      if (!vertex.edges[Direction.up]) {
        room.walls.push([[x1 + d, y1], [x2, y1 + d]]) // top wall
      }

      if (!vertex.edges[Direction.down]) {
        room.walls.push([[x1 + d, y2], [x2, y2]]) // down wall
      }

      if (!vertex.edges[Direction.left]) {
        room.walls.push([[x1, y1 + d], [x1 + d, y2]]) // left wall
      }

      if (!vertex.edges[Direction.right]) {
        room.walls.push([[x2, y1 + d], [x2 + d, y2]]) // right wall
      }

      room.walls.push([[x1, y1], [x1 + d, y1 + d]])
      room.walls.push([[x2, y1], [x2 + d, y1 + d]])
      room.walls.push([[x1, y2], [x1 + d, y2 + d]])
      room.walls.push([[x2, y2], [x2 + d, y2 + d]])

      this.rooms[vertex.name] = room
    })
  }

  drawWalls = (ctx: CanvasRenderingContext2D) => {
    Object.values(this.rooms).forEach((room: Room) => {
      room.walls.forEach((wall: any) => {
        ctx.strokeStyle = '#111'
        ctx.fillStyle = '#6aa3e6'
        ctx.lineWidth = 0
        ctx.strokeRect(
          wall[0][0],
          wall[0][1],
          wall[1][0] - wall[0][0],
          wall[1][1] - wall[0][1]
        )
        ctx.fillRect(
          wall[0][0],
          wall[0][1],
          wall[1][0] - wall[0][0],
          wall[1][1] - wall[0][1]
        )
      })
    })
  }

  drawGround = (ctx: CanvasRenderingContext2D) => {
    let translatedX = ctx.getTransform().e / 2
    let translatedY = ctx.getTransform().f / 2
    const mx1 = 0 - translatedX < 0 ? -1 : 0 - translatedX
    const my1 = 0 - translatedY < 0 ? -1 : 0 - translatedY
    const mx2 = CANVAS_WIDTH - translatedX + OFFSET_X
    const my2 = CANVAS_HEIGHT - translatedY + OFFSET_Y
    ctx.drawImage(this.groundImg, mx1, my1, mx2, my2, mx1, my1, mx2, my2)
  }

  getRooms() {
    return this.rooms
  }
}
