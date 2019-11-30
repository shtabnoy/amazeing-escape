import MazeGraph, { Direction, Vertex, Vertex1 } from './MazeGraph'
import { rnd } from './utils'
import { CANVAS_WIDTH, CANVAS_HEIGHT, OFFSET_X, OFFSET_Y } from './constants'

type P = [number, number]
// type Block4 = [P, P, P, P]
// type Block6 = [P, P, P, P, P, P]
// type Block8 = [P, P, P, P, P, P, P, P]
// type Wall = Block4 | Block6 | Block8
type W = [P, P]
interface Wall {
  coords: W
  sx?: number
  sy?: number
  sw?: number
  sh?: number
  // img: string | HTMLImageElement
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
  private walls: Walls
  private images: {
    walls: HTMLImageElement
    ground: HTMLImageElement
  }
  private rooms: any

  constructor(
    width: number,
    height: number,
    config: any // TODO: Define the interface
  ) {
    // this.groundImg = config.groundImg
    // this.wallHorizontalImg = config.wallHorizontalImg
    // this.wallVerticalImg = config.wallVerticalImg
    // this.crossWallImg = config.crossWallImg
    this.images = config.images
    const g = this.createMazeGraph(width, height)
    // const mst = g.mst()
    const mst1 = g.mst1()
    this.rooms = []
    this.walls = {}
    this.createRooms(mst1, config.rw, config.d)
    // console.log(this.walls)
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
    Object.entries(g.vertices1).forEach(([name, vertex]: [string, Vertex1]) => {
      const xy = name.split(',')
      const vx = Number(xy[0])
      const vy = Number(xy[1])

      const x1 = vx * rw // left X
      const x2 = (vx + 1) * rw // right X
      const y1 = vy * rw // top Y
      const y2 = (vy + 1) * rw // bottom Y

      const uwall: W = [[x1 + d, y1], [x2, y1 + d]]
      const dwall: W = [[x1 + d, y2], [x2, y2]]
      const lwall: W = [[x1, y1 + d], [x1 + d, y2]]
      const rwall: W = [[x2, y1 + d], [x2 + d, y2]]
      const ulwall: W = [[x1, y1], [x1 + d, y1 + d]]
      const dlwall: W = [[x1, y2], [x1 + d, y2 + d]]
      const urwall: W = [[x2, y1], [x2 + d, y1 + d]]
      const drwall: W = [[x2, y2], [x2 + d, y2 + d]]

      if (!vertex.up && !this.walls[uwall.toString()]) {
        this.walls[uwall.toString()] = {
          coords: uwall,
          sx: 0,
          sy: 192,
          sw: 192,
          sh: 64,
        }
      }

      if (!vertex.down && !this.walls[dwall.toString()]) {
        this.walls[dwall.toString()] = {
          coords: dwall,
          sx: 0,
          sy: 192,
          sw: 192,
          sh: 64,
        }
      }

      if (!vertex.left && !this.walls[lwall.toString()]) {
        this.walls[lwall.toString()] = {
          coords: lwall,
          sx: 192,
          sy: 0,
          sw: 64,
          sh: 192,
        }
      }

      if (!vertex.right && !this.walls[rwall.toString()]) {
        this.walls[rwall.toString()] = {
          coords: rwall,
          sx: 192,
          sy: 0,
          sw: 64,
          sh: 192,
        }
      }

      const lv = g.vertices1[[vx - 1, vy].toString()]
      const tlv = g.vertices1[[vx - 1, vy - 1].toString()]
      const tv = g.vertices1[[vx, vy - 1].toString()]
      const trv = g.vertices1[[vx + 1, vy - 1].toString()]
      const rv = g.vertices1[[vx + 1, vy].toString()]
      const brv = g.vertices1[[vx + 1, vy + 1].toString()]
      const bv = g.vertices1[[vx, vy + 1].toString()]
      const blv = g.vertices1[[vx - 1, vy + 1].toString()]
      // corner blocks (necessary for all rooms)
      if (!this.walls[ulwall.toString()]) {
        if (
          lv &&
          tv &&
          tlv &&
          !lv.right &&
          !tv.down &&
          !tlv.right &&
          !tlv.down
        ) {
          this.walls[ulwall.toString()] = {
            coords: ulwall,
            sx: 64,
            sy: 64,
            sw: 64,
            sh: 64,
          }
        } else {
          this.walls[ulwall.toString()] = {
            coords: ulwall,
          }
        }
      }
      if (!this.walls[dlwall.toString()])
        this.walls[dlwall.toString()] = {
          coords: dlwall,
        }
      if (!this.walls[urwall.toString()])
        this.walls[urwall.toString()] = {
          coords: urwall,
        }
      if (!this.walls[drwall.toString()])
        this.walls[drwall.toString()] = {
          coords: drwall,
        }
    })
  }

  drawWalls = (ctx: CanvasRenderingContext2D) => {
    Object.values(this.walls).forEach((wall: Wall) => {
      if (wall.sx === undefined) {
        ctx.strokeStyle = '#111'
        ctx.fillStyle = '#6aa3e6'
        ctx.lineWidth = 0
        ctx.strokeRect(
          wall.coords[0][0],
          wall.coords[0][1],
          wall.coords[1][0] - wall.coords[0][0],
          wall.coords[1][1] - wall.coords[0][1]
        )
        ctx.fillRect(
          wall.coords[0][0],
          wall.coords[0][1],
          wall.coords[1][0] - wall.coords[0][0],
          wall.coords[1][1] - wall.coords[0][1]
        )
      } else {
        ctx.drawImage(
          this.images.walls,
          wall.sx,
          wall.sy,
          wall.sw,
          wall.sh,
          wall.coords[0][0],
          wall.coords[0][1],
          wall.sw,
          wall.sh
        )
      }
    })
  }

  drawGround = (ctx: CanvasRenderingContext2D) => {
    let translatedX = ctx.getTransform().e / 2
    let translatedY = ctx.getTransform().f / 2
    const mx1 = 0 - translatedX < 0 ? -1 : 0 - translatedX
    const my1 = 0 - translatedY < 0 ? -1 : 0 - translatedY
    const mx2 = CANVAS_WIDTH - translatedX + OFFSET_X
    const my2 = CANVAS_HEIGHT - translatedY + OFFSET_Y
    ctx.drawImage(this.images.ground, mx1, my1, mx2, my2, mx1, my1, mx2, my2)
  }

  getRooms() {
    return this.rooms
  }

  getWalls() {
    return this.walls
  }
}
