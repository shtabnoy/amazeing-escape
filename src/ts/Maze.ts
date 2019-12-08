import MazeGraph, { Vertex } from './MazeGraph'
import { rnd } from './utils'
import { CANVAS_WIDTH, CANVAS_HEIGHT, OFFSET_X, OFFSET_Y } from './constants'

type P = [number, number]
type W = [P, P]
interface Wall {
  coords: W
  sx?: number
  sy?: number
  sw?: number
  sh?: number
}

interface Walls {
  [name: string]: Wall
}

export default class Maze {
  private walls: Walls
  private images: {
    walls: HTMLImageElement
    ground: HTMLImageElement
  }

  constructor(
    width: number,
    height: number,
    config: any // TODO: Define the interface
  ) {
    this.images = config.images
    const g = this.createMazeGraph(width, height)
    const mst1 = g.mst()
    this.walls = {}
    this.createRooms(mst1, config.rw, config.d)
  }

  private createMazeGraph = (w: number, h: number): MazeGraph => {
    const g = new MazeGraph()
    if (w < 2 || h < 2) return g

    for (let i = 0; i < w; i++) {
      for (let j = 0; j < h; j++) {
        if (i != w - 1) {
          g.addEdge({
            v1: `${i},${j}`,
            v2: `${i + 1},${j}`,
            weight: rnd(),
          })
        }
        if (j < h - 1) {
          g.addEdge({
            v1: `${i},${j}`,
            v2: `${i},${j + 1}`,
            weight: rnd(),
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
    Object.entries(g.vertices).forEach(([name, vertex]: [string, Vertex]) => {
      const xy = name.split(',')
      const vx = Number(xy[0])
      const vy = Number(xy[1])

      const x1 = vx * rw // left X
      const x2 = (vx + 1) * rw // right X
      const y1 = vy * rw // top Y
      const y2 = (vy + 1) * rw // bottom Y

      // const uwall: W = [
      //   [x1 + d, y1],
      //   [x2, y1 + d],
      // ]
      // const dwall: W = [
      //   [x1 + d, y2],
      //   [x2, y2],
      // ]
      // const lwall: W = [
      //   [x1, y1 + d],
      //   [x1 + d, y2],
      // ]
      // const rwall: W = [
      //   [x2, y1 + d],
      //   [x2 + d, y2],
      // ]
      // const ulwall: W = [
      //   [x1, y1],
      //   [x1 + d, y1 + d],
      // ]
      // const dlwall: W = [
      //   [x1, y2],
      //   [x1 + d, y2 + d],
      // ]
      // const urwall: W = [
      //   [x2, y1],
      //   [x2 + d, y1 + d],
      // ]
      // const drwall: W = [
      //   [x2, y2],
      //   [x2 + d, y2 + d],
      // ]

      const lv = g.vertices[[vx - 1, vy].toString()]
      const tv = g.vertices[[vx, vy - 1].toString()]
      const rv = g.vertices[[vx + 1, vy].toString()]
      const bv = g.vertices[[vx, vy + 1].toString()]

      // TODO: Remove dups (only up and left is enough)
      const uwall: W = [
        [x1 + 64, y1],
        [x2, y1 + 128],
      ]
      const dwall: W = [
        [x1 + 64, y2],
        [x2, y2],
      ]
      if (!vertex.up && !this.walls[uwall.toString()]) {
        this.walls[uwall.toString()] = {
          coords: uwall,
          sx: 64,
          sy: 384,
          sw: 192,
          sh: 128,
        }
      }

      if (!vertex.down && !this.walls[dwall.toString()]) {
        this.walls[dwall.toString()] = {
          coords: dwall,
          sx: 64,
          sy: 384,
          sw: 192,
          sh: 128,
        }
      }

      const lwall: W = [
        [x1, y1 + 128],
        [x1 + 64, y2],
      ]
      const rwall: W = [
        [x2, y1 + 128],
        [x2 + 64, y2],
      ]
      if (!vertex.left && !this.walls[lwall.toString()]) {
        this.walls[lwall.toString()] = {
          coords: lwall,
          sx: 256,
          sy: 192,
          sw: 64,
          sh: 128,
        }
      }

      if (!vertex.right && !this.walls[rwall.toString()]) {
        this.walls[rwall.toString()] = {
          coords: rwall,
          sx: 256,
          sy: 192,
          sw: 64,
          sh: 128,
        }
      }

      const ulwall: W = [
        [x1, y1],
        [x1 + 64, y1 + 128],
      ]
      const dlwall: W = [
        [x1, y2],
        [x1 + 64, y2 + 128],
      ]
      const urwall: W = [
        [x2, y1],
        [x2 + 64, y1 + 128],
      ]
      const drwall: W = [
        [x2, y2],
        [x2 + 64, y2 + 128],
      ]

      // 1
      if (!lv && !tv) {
        this.walls[ulwall.toString()] = {
          coords: ulwall,
          sx: 0,
          sy: 256,
          sw: 64,
          sh: 128,
        }
      }
      // 2
      else if (lv && !tv && !lv.right) {
        this.walls[ulwall.toString()] = {
          coords: ulwall,
          sx: 64,
          sy: 0,
          sw: 64,
          sh: 128,
        }
      }
      // 5
      // horizontal short wall
      else if (lv && !tv && lv.right) {
        this.walls[ulwall.toString()] = {
          coords: ulwall,
          sx: 256,
          sy: 64,
          sw: 64,
          sh: 128,
        }
      }
      // 4
      // left T
      else if (!lv && tv && !tv.down) {
        this.walls[ulwall.toString()] = {
          coords: ulwall,
          sx: 0,
          sy: 0,
          sw: 64,
          sh: 128,
        }
      }
      // 3
      // vertical short wall
      else if (!lv && tv && tv.down) {
        this.walls[ulwall.toString()] = {
          coords: ulwall,
          sx: 256,
          sy: 192,
          sw: 64,
          sh: 128,
        }
      }
      // 1
      else if (lv && tv && !lv.right && lv.up && !tv.down && tv.left) {
        this.walls[ulwall.toString()] = {
          coords: ulwall,
          sx: 0,
          sy: 256,
          sw: 64,
          sh: 128,
        }
      }
      // 2
      else if (lv && tv && !lv.right && !lv.up && !tv.down && tv.left) {
        this.walls[ulwall.toString()] = {
          coords: ulwall,
          sx: 64,
          sy: 0,
          sw: 64,
          sh: 128,
        }
      }
      // right upper corner
      else if (lv && tv && !lv.right && !lv.up && tv.down && tv.left) {
        this.walls[ulwall.toString()] = {
          coords: ulwall,
          sx: 64,
          sy: 256,
          sw: 64,
          sh: 128,
        }
      }
      // 3
      // vertical short wall
      else if (lv && tv && !lv.right && lv.up && tv.down && !tv.left) {
        this.walls[ulwall.toString()] = {
          coords: ulwall,
          sx: 256,
          sy: 192,
          sw: 64,
          sh: 128,
        }
      } else if (lv && tv && lv.right && lv.up && !tv.down && tv.left) {
        this.walls[ulwall.toString()] = {
          coords: ulwall,
          sx: 192,
          sy: 0,
          sw: 64,
          sh: 128,
        }
      }
      // 4
      // left T
      else if (lv && tv && !lv.right && lv.up && !tv.down && !tv.left) {
        this.walls[ulwall.toString()] = {
          coords: ulwall,
          sx: 0,
          sy: 0,
          sw: 64,
          sh: 128,
        }
      }
      // cross
      else if (lv && tv && !lv.right && !lv.up && !tv.down && !tv.left) {
        this.walls[ulwall.toString()] = {
          coords: ulwall,
          sx: 0,
          sy: 128,
          sw: 64,
          sh: 128,
        }
      }
      // right T
      else if (lv && tv && !lv.right && !lv.up && tv.down && !tv.left) {
        this.walls[ulwall.toString()] = {
          coords: ulwall,
          sx: 128,
          sy: 0,
          sw: 64,
          sh: 128,
        }
      }
      // horizontal short wall
      // 5
      else if (lv && tv && lv.right && !lv.up && !tv.down && tv.left) {
        this.walls[ulwall.toString()] = {
          coords: ulwall,
          sx: 256,
          sy: 64,
          sw: 64,
          sh: 128,
        }
      }
      // bottom left corner
      else if (lv && tv && lv.right && lv.up && !tv.down && !tv.left) {
        this.walls[ulwall.toString()] = {
          coords: ulwall,
          sx: 128,
          sy: 256,
          sw: 64,
          sh: 128,
        }
      }
      // bottom T
      else if (lv && tv && lv.right && !lv.up && !tv.down && !tv.left) {
        this.walls[ulwall.toString()] = {
          coords: ulwall,
          sx: 64,
          sy: 128,
          sw: 64,
          sh: 128,
        }
      }
      // bottom right corner
      else if (lv && tv && lv.right && !lv.up && tv.down && !tv.left) {
        this.walls[ulwall.toString()] = {
          coords: ulwall,
          sx: 192,
          sy: 256,
          sw: 64,
          sh: 128,
        }
      }
      // bottom end
      else if (lv && tv && lv.right && lv.up && tv.down && !tv.left) {
        this.walls[ulwall.toString()] = {
          coords: ulwall,
          sx: 192,
          sy: 128,
          sw: 64,
          sh: 128,
        }
      }
      // top end
      else if (lv && tv && !lv.right && lv.up && tv.down && tv.left) {
        this.walls[ulwall.toString()] = {
          coords: ulwall,
          sx: 128,
          sy: 128,
          sw: 64,
          sh: 128,
        }
      }
      // right end
      else if (lv && tv && lv.right && !lv.up && tv.down && tv.left) {
        this.walls[ulwall.toString()] = {
          coords: ulwall,
          sx: 0,
          sy: 384,
          sw: 64,
          sh: 128,
        }
      }
      // else {
      //   this.walls[ulwall.toString()] = {
      //     coords: ulwall,
      //   }
      // }

      // right upper corner
      if (!rv && !tv) {
        this.walls[urwall.toString()] = {
          coords: urwall,
          sx: 64,
          sy: 256,
          sw: 64,
          sh: 128,
        }
      }
      // right T
      else if (!rv && tv && !tv.down) {
        this.walls[urwall.toString()] = {
          coords: urwall,
          sx: 128,
          sy: 0,
          sw: 64,
          sh: 128,
        }
      }
      // vertical short wall
      else if (!rv && tv && tv.down) {
        this.walls[urwall.toString()] = {
          coords: urwall,
          sx: 256,
          sy: 192,
          sw: 64,
          sh: 128,
        }
      }

      // bottom left corner
      if (!lv && !bv) {
        this.walls[dlwall.toString()] = {
          coords: dlwall,
          sx: 128,
          sy: 256,
          sw: 64,
          sh: 128,
        }
      }
      // bottom T
      else if (lv && !bv && !lv.right) {
        this.walls[dlwall.toString()] = {
          coords: dlwall,
          sx: 64,
          sy: 128,
          sw: 64,
          sh: 128,
        }
      }
      // horizontal short wall
      else if (lv && !bv && lv.right) {
        this.walls[dlwall.toString()] = {
          coords: dlwall,
          sx: 256,
          sy: 64,
          sw: 64,
          sh: 128,
        }
      }

      // bottom right corner
      if (!rv && !bv) {
        this.walls[drwall.toString()] = {
          coords: drwall,
          sx: 192,
          sy: 256,
          sw: 64,
          sh: 128,
        }
      }
    })
  }

  drawWalls = (ctx: CanvasRenderingContext2D) => {
    Object.values(this.walls).forEach((wall: Wall) => {
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
      // if (wall.sw === 192 || (wall.sx === 256 && wall.sy === 64)) {
      //   ctx.save()
      //   ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'
      //   ctx.fillRect(
      //     wall.coords[0][0],
      //     wall.coords[0][1] + wall.sh,
      //     wall.sw,
      //     64
      //   )
      //   ctx.restore()
      // }
    })
  }

  drawGround = (ctx: CanvasRenderingContext2D) => {
    let translatedX = ctx.getTransform().e
    let translatedY = ctx.getTransform().f
    const mx1 = 0 - translatedX < 0 ? -1 : 0 - translatedX
    const my1 = 0 - translatedY < 0 ? -1 : 0 - translatedY
    const mx2 = CANVAS_WIDTH - translatedX + OFFSET_X
    const my2 = CANVAS_HEIGHT - translatedY + OFFSET_Y
    ctx.drawImage(this.images.ground, mx1, my1, mx2, my2, mx1, my1, mx2, my2)
  }

  getWalls() {
    return this.walls
  }
}
