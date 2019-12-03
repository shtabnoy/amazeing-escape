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

      const uwall: W = [[x1 + d, y1], [x2, y1 + d]]
      const dwall: W = [[x1 + d, y2], [x2, y2]]
      const lwall: W = [[x1, y1 + d], [x1 + d, y2]]
      const rwall: W = [[x2, y1 + d], [x2 + d, y2]]
      const ulwall: W = [[x1, y1], [x1 + d, y1 + d]]
      const dlwall: W = [[x1, y2], [x1 + d, y2 + d]]
      const urwall: W = [[x2, y1], [x2 + d, y1 + d]]
      const drwall: W = [[x2, y2], [x2 + d, y2 + d]]

      const lv = g.vertices[[vx - 1, vy].toString()]
      const tv = g.vertices[[vx, vy - 1].toString()]
      const rv = g.vertices[[vx + 1, vy].toString()]
      const bv = g.vertices[[vx, vy + 1].toString()]

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

      if (!lv && !tv) {
        this.walls[ulwall.toString()] = {
          coords: ulwall,
          sx: 0,
          sy: 0,
          sw: 64,
          sh: 64,
        }
      } else if (lv && !tv && !lv.right) {
        this.walls[ulwall.toString()] = {
          coords: ulwall,
          sx: 64,
          sy: 0,
          sw: 64,
          sh: 64,
        }
      } else if (lv && !tv && lv.right) {
        this.walls[ulwall.toString()] = {
          coords: ulwall,
          sx: 256,
          sy: 64,
          sw: 64,
          sh: 64,
        }
      } else if (!lv && tv && !tv.down) {
        this.walls[ulwall.toString()] = {
          coords: ulwall,
          sx: 0,
          sy: 64,
          sw: 64,
          sh: 64,
        }
      } else if (!lv && tv && tv.down) {
        this.walls[ulwall.toString()] = {
          coords: ulwall,
          sx: 256,
          sy: 0,
          sw: 64,
          sh: 64,
        }
      } else if (lv && tv && !lv.right && lv.up && !tv.down && tv.left) {
        this.walls[ulwall.toString()] = {
          coords: ulwall,
          sx: 0,
          sy: 0,
          sw: 64,
          sh: 64,
        }
      } else if (lv && tv && !lv.right && !lv.up && !tv.down && tv.left) {
        this.walls[ulwall.toString()] = {
          coords: ulwall,
          sx: 64,
          sy: 0,
          sw: 64,
          sh: 64,
        }
      } else if (lv && tv && !lv.right && !lv.up && tv.down && tv.left) {
        this.walls[ulwall.toString()] = {
          coords: ulwall,
          sx: 128,
          sy: 0,
          sw: 64,
          sh: 64,
        }
      } else if (lv && tv && !lv.right && lv.up && tv.down && !tv.left) {
        this.walls[ulwall.toString()] = {
          coords: ulwall,
          sx: 256,
          sy: 0,
          sw: 64,
          sh: 64,
        }
      } else if (lv && tv && lv.right && lv.up && !tv.down && tv.left) {
        this.walls[ulwall.toString()] = {
          coords: ulwall,
          sx: 320,
          sy: 0,
          sw: 64,
          sh: 64,
        }
      } else if (lv && tv && !lv.right && lv.up && !tv.down && !tv.left) {
        this.walls[ulwall.toString()] = {
          coords: ulwall,
          sx: 0,
          sy: 64,
          sw: 64,
          sh: 64,
        }
      } else if (lv && tv && !lv.right && !lv.up && !tv.down && !tv.left) {
        this.walls[ulwall.toString()] = {
          coords: ulwall,
          sx: 64,
          sy: 64,
          sw: 64,
          sh: 64,
        }
      } else if (lv && tv && !lv.right && !lv.up && tv.down && !tv.left) {
        this.walls[ulwall.toString()] = {
          coords: ulwall,
          sx: 128,
          sy: 64,
          sw: 64,
          sh: 64,
        }
      } else if (lv && tv && lv.right && !lv.up && !tv.down && tv.left) {
        this.walls[ulwall.toString()] = {
          coords: ulwall,
          sx: 256,
          sy: 64,
          sw: 64,
          sh: 64,
        }
      } else if (lv && tv && lv.right && lv.up && !tv.down && !tv.left) {
        this.walls[ulwall.toString()] = {
          coords: ulwall,
          sx: 0,
          sy: 128,
          sw: 64,
          sh: 64,
        }
      } else if (lv && tv && lv.right && !lv.up && !tv.down && !tv.left) {
        this.walls[ulwall.toString()] = {
          coords: ulwall,
          sx: 64,
          sy: 128,
          sw: 64,
          sh: 64,
        }
      } else if (lv && tv && lv.right && !lv.up && tv.down && !tv.left) {
        this.walls[ulwall.toString()] = {
          coords: ulwall,
          sx: 128,
          sy: 128,
          sw: 64,
          sh: 64,
        }
      } else if (lv && tv && lv.right && lv.up && tv.down && !tv.left) {
        this.walls[ulwall.toString()] = {
          coords: ulwall,
          sx: 256,
          sy: 128,
          sw: 64,
          sh: 64,
        }
      } else if (lv && tv && !lv.right && lv.up && tv.down && tv.left) {
        this.walls[ulwall.toString()] = {
          coords: ulwall,
          sx: 192,
          sy: 192,
          sw: 64,
          sh: 64,
        }
      } else if (lv && tv && lv.right && !lv.up && tv.down && tv.left) {
        this.walls[ulwall.toString()] = {
          coords: ulwall,
          sx: 256,
          sy: 192,
          sw: 64,
          sh: 64,
        }
      } else {
        this.walls[ulwall.toString()] = {
          coords: ulwall,
        }
      }

      if (!rv && !tv) {
        this.walls[urwall.toString()] = {
          coords: urwall,
          sx: 128,
          sy: 0,
          sw: 64,
          sh: 64,
        }
      } else if (!rv && tv && !tv.down) {
        this.walls[urwall.toString()] = {
          coords: urwall,
          sx: 128,
          sy: 64,
          sw: 64,
          sh: 64,
        }
      } else if (!rv && tv && tv.down) {
        this.walls[urwall.toString()] = {
          coords: urwall,
          sx: 256,
          sy: 0,
          sw: 64,
          sh: 64,
        }
      }

      if (!lv && !bv) {
        this.walls[dlwall.toString()] = {
          coords: dlwall,
          sx: 0,
          sy: 128,
          sw: 64,
          sh: 64,
        }
      } else if (lv && !bv && !lv.right) {
        this.walls[dlwall.toString()] = {
          coords: dlwall,
          sx: 64,
          sy: 128,
          sw: 64,
          sh: 64,
        }
      } else if (lv && !bv && lv.right) {
        this.walls[dlwall.toString()] = {
          coords: dlwall,
          sx: 256,
          sy: 64,
          sw: 64,
          sh: 64,
        }
      }

      if (!rv && !bv) {
        this.walls[drwall.toString()] = {
          coords: drwall,
          sx: 128,
          sy: 128,
          sw: 64,
          sh: 64,
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
