import { Point } from './types'
import MazeGraph, { Direction, Vertex } from './MazeGraph'
import { rnd } from './utils'
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  OFFSET_X,
  OFFSET_Y,
  ROOMS_HORIZONTAL,
  ROOM_WIDTH,
  ROOMS_VERTICAL,
} from './constants'

type P = [number, number]
type Block4 = [P, P, P, P]
type Block6 = [P, P, P, P, P, P]
type Block8 = [P, P, P, P, P, P, P, P]
type Wall = Block4 | Block6 | Block8

interface Room {
  walls?: any[]
  ailes?: {
    [Direction.up]?: boolean
    [Direction.down]?: boolean
    [Direction.left]?: boolean
    [Direction.right]?: boolean
  }
  a?: any
  b?: any
  name?: [number, number]
}

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
    this.rooms = []
    this.createRooms(mst, config.rw, config.d)
    // console.log(mst.vertices)
    console.log(this.rooms)
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
      const [rx, ry] = vertex.name.split(',')
      const room: Room = {
        name: [Number(rx), Number(ry)],
        a: { x: vx * rw, y: vy * rw },
        b: { x: (vx + 1) * rw, y: (vy + 1) * rw },
        ailes: {},
        walls: [],
      }

      const x1 = vx * rw // left X
      const x2 = (vx + 1) * rw // right X
      const y1 = vy * rw // top Y
      const y2 = (vy + 1) * rw // bottom Y

      if (!vertex.edges[Direction.up]) {
        room.walls.push([[x1 + d, y1], [x2 - d, y1 + d]]) // top wall
      }

      if (!vertex.edges[Direction.down]) {
        room.walls.push([[x1 + d, y2 - d], [x2 - d, y2]]) // down wall
      }

      if (!vertex.edges[Direction.left]) {
        room.walls.push([[x1, y1 + d], [x1 + d, y2 - d]]) // left wall
      }

      if (!vertex.edges[Direction.right]) {
        room.walls.push([[x2 - d, y1 + d], [x2, y2 - d]]) // right wall
      }

      room.walls.push([[x1, y1], [x1 + d, y1 + d]])
      room.walls.push([[x2 - d, y1], [x2, y1 + d]])
      room.walls.push([[x1, y2 - d], [x1 + d, y2]])
      room.walls.push([[x2 - d, y2 - d], [x2, y2]])

      this.rooms.push(room)
    })
  }

  drawWalls = (ctx: CanvasRenderingContext2D) => {
    this.rooms.forEach(room => {
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
    // const tilesH = (ROOMS_HORIZONTAL * ROOM_WIDTH) / this.groundImg.width
    // const tilesV = (ROOMS_VERTICAL * ROOM_WIDTH) / this.groundImg.height
    // for (let i = 0; i < tilesH; i++) {
    //   for (let j = 0; j < tilesV; j++) {
    //     ctx.drawImage(
    //       this.groundImg,
    //       i * this.groundImg.width,
    //       j * this.groundImg.height
    //     )
    //   }
    // }
    // ctx.fillRect(
    //   0 - translatedX < 0 ? -1 : 0 - translatedX,
    //   0 - translatedY < 0 ? -1 : 0 - translatedY,
    //   CANVAS_WIDTH - translatedX + OFFSET_X,
    //   CANVAS_HEIGHT - translatedY + OFFSET_Y
    // )
  }

  getWalls() {
    return this.walls
  }

  getRooms() {
    return this.rooms
  }
}
