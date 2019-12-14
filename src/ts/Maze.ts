import MazeGraph, { Vertex, Direction, Dir } from './MazeGraph'
import { rnd } from './utils'
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  OFFSET_X,
  OFFSET_Y,
  ROOM_WIDTH,
  STEP,
  RIGHT_BORDER,
  BOTTOM_BORDER,
  CZ,
} from './constants'

type P = [number, number]
type R2 = [number, number]
type W = [P, P]
type M2x2 = [R2, R2]

interface CollisionZone {
  [Direction.up]: number
  [Direction.down]: number
  [Direction.left]: number
  [Direction.right]: number
}

interface ImageCoords {
  sx: number
  sy: number
  sw: number
  sh: number
}

// Coords is a 2x2 matrix
// [[ x1, y1 ],
//  [ x2, y2 ]]
// Image coords is a 2x2 matrix
// [[ sx, sy ],
//  [ sw, sh ]]
// Collision zone is a 2x2 matrix
// [[ up,   down  ],
//  [ left, right ]]

export interface Wall {
  coords: M2x2
  imageCoords: ImageCoords
  collisionZone: CollisionZone
}

export interface Walls {
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
    this.createRooms(mst1, ROOM_WIDTH)
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

  private addWall = (
    coords: M2x2,
    imageCoords: ImageCoords,
    collisionZone: CollisionZone = { up: 0, down: 0, left: 0, right: 0 }
  ) => {
    this.walls[coords.toString()] = {
      coords,
      imageCoords,
      collisionZone,
    }
  }

  private createRooms(
    g: MazeGraph,
    rw: number // room width
  ) {
    Object.entries(g.vertices).forEach(([name, vertex]: [string, Vertex]) => {
      const xy = name.split(',')
      const vx = Number(xy[0])
      const vy = Number(xy[1])

      const x1 = vx * rw // left X
      const x2 = (vx + 1) * rw // right X
      const y1 = vy * rw // top Y
      const y2 = (vy + 1) * rw // bottom Y

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
        [x2, y2 + 128],
      ]
      if (!vertex.up && !this.walls[uwall.toString()]) {
        this.addWall(
          uwall,
          { sx: 64, sy: 384, sw: 192, sh: 128 },
          { up: CZ, down: CZ, left: 0, right: 0 }
        )
      }
      if (!vertex.down && !this.walls[dwall.toString()]) {
        this.addWall(
          dwall,
          { sx: 64, sy: 384, sw: 192, sh: 128 },
          { up: CZ, down: CZ, left: 0, right: 0 }
        )
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
        this.addWall(
          lwall,
          { sx: 256, sy: 192, sw: 64, sh: 128 },
          { up: 0, down: 0, left: 0, right: 0 }
        )
      }
      if (!vertex.right && !this.walls[rwall.toString()]) {
        this.addWall(
          rwall,
          { sx: 256, sy: 192, sw: 64, sh: 128 },
          { up: 0, down: 0, left: 0, right: 0 }
        )
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

      // top left corner
      if (!lv && !tv) {
        this.addWall(
          ulwall,
          { sx: 0, sy: 256, sw: 64, sh: 128 },
          { up: CZ, down: 0, left: 0, right: 0 }
        )
      }
      // top T
      else if (lv && !tv && !lv.right) {
        this.addWall(
          ulwall,
          { sx: 64, sy: 0, sw: 64, sh: 128 },
          { up: CZ, down: 0, left: 0, right: 0 }
        )
      }
      // horizontal short wall
      else if (lv && !tv && lv.right) {
        this.addWall(
          ulwall,
          { sx: 256, sy: 64, sw: 64, sh: 128 },
          { up: CZ, down: CZ, left: 0, right: 0 }
        )
      }
      // left T
      else if (!lv && tv && !tv.down) {
        this.addWall(
          ulwall,
          { sx: 0, sy: 0, sw: 64, sh: 128 },
          { up: 0, down: 0, left: 0, right: 0 }
        )
      }
      // vertical short wall
      else if (!lv && tv && tv.down) {
        this.addWall(
          ulwall,
          { sx: 256, sy: 192, sw: 64, sh: 128 },
          { up: 0, down: 0, left: 0, right: 0 }
        )
      }
      // top left corner
      else if (lv && tv && !lv.right && lv.up && !tv.down && tv.left) {
        this.addWall(
          ulwall,
          { sx: 0, sy: 256, sw: 64, sh: 128 },
          { up: CZ, down: 0, left: 0, right: 0 }
        )
      }
      // top T
      else if (lv && tv && !lv.right && !lv.up && !tv.down && tv.left) {
        this.addWall(
          ulwall,
          { sx: 64, sy: 0, sw: 64, sh: 128 },
          { up: CZ, down: 0, left: 0, right: 0 }
        )
      }
      // top right corner
      else if (lv && tv && !lv.right && !lv.up && tv.down && tv.left) {
        this.addWall(
          ulwall,
          { sx: 64, sy: 256, sw: 64, sh: 128 },
          { up: CZ, down: 0, left: 0, right: 0 }
        )
      }
      // vertical short wall
      else if (lv && tv && !lv.right && lv.up && tv.down && !tv.left) {
        this.addWall(
          ulwall,
          { sx: 256, sy: 192, sw: 64, sh: 128 },
          { up: 0, down: 0, left: 0, right: 0 }
        )
      }
      // left end
      else if (lv && tv && lv.right && lv.up && !tv.down && tv.left) {
        this.addWall(
          ulwall,
          { sx: 192, sy: 0, sw: 64, sh: 128 },
          { up: CZ, down: CZ, left: 0, right: 0 }
        )
      }
      // left T
      else if (lv && tv && !lv.right && lv.up && !tv.down && !tv.left) {
        this.addWall(
          ulwall,
          { sx: 0, sy: 0, sw: 64, sh: 128 },
          { up: 0, down: 0, left: 0, right: 0 }
        )
      }
      // cross
      else if (lv && tv && !lv.right && !lv.up && !tv.down && !tv.left) {
        this.addWall(
          ulwall,
          { sx: 0, sy: 128, sw: 64, sh: 128 },
          { up: 0, down: 0, left: 0, right: 0 }
        )
      }
      // right T
      else if (lv && tv && !lv.right && !lv.up && tv.down && !tv.left) {
        this.addWall(
          ulwall,
          { sx: 128, sy: 0, sw: 64, sh: 128 },
          { up: 0, down: 0, left: 0, right: 0 }
        )
      }
      // horizontal short wall
      else if (lv && tv && lv.right && !lv.up && !tv.down && tv.left) {
        this.addWall(
          ulwall,
          { sx: 256, sy: 64, sw: 64, sh: 128 },
          { up: CZ, down: CZ, left: 0, right: 0 }
        )
      }
      // bottom left corner
      else if (lv && tv && lv.right && lv.up && !tv.down && !tv.left) {
        this.addWall(
          ulwall,
          { sx: 128, sy: 256, sw: 64, sh: 128 },
          { up: 0, down: CZ, left: 0, right: 0 }
        )
      }
      // bottom T
      else if (lv && tv && lv.right && !lv.up && !tv.down && !tv.left) {
        this.addWall(
          ulwall,
          { sx: 64, sy: 128, sw: 64, sh: 128 },
          { up: 0, down: CZ, left: 0, right: 0 }
        )
      }
      // bottom right corner
      else if (lv && tv && lv.right && !lv.up && tv.down && !tv.left) {
        this.addWall(
          ulwall,
          { sx: 192, sy: 256, sw: 64, sh: 128 },
          { up: 0, down: CZ, left: 0, right: 0 }
        )
      }
      // bottom end
      else if (lv && tv && lv.right && lv.up && tv.down && !tv.left) {
        this.addWall(
          ulwall,
          { sx: 192, sy: 128, sw: 64, sh: 128 },
          { up: 0, down: CZ, left: 0, right: 0 }
        )
      }
      // top end
      else if (lv && tv && !lv.right && lv.up && tv.down && tv.left) {
        this.addWall(
          ulwall,
          { sx: 128, sy: 128, sw: 64, sh: 128 },
          { up: CZ, down: 0, left: 0, right: 0 }
        )
      }
      // right end
      else if (lv && tv && lv.right && !lv.up && tv.down && tv.left) {
        this.addWall(
          ulwall,
          { sx: 0, sy: 384, sw: 64, sh: 128 },
          { up: CZ, down: CZ, left: 0, right: 0 }
        )
      }

      // right upper corner
      if (!rv && !tv) {
        this.addWall(
          urwall,
          { sx: 64, sy: 256, sw: 64, sh: 128 },
          { up: CZ, down: 0, left: 0, right: 0 }
        )
      }
      // right T
      else if (!rv && tv && !tv.down) {
        this.addWall(
          urwall,
          { sx: 128, sy: 0, sw: 64, sh: 128 },
          { up: 0, down: 0, left: 0, right: 0 }
        )
      }
      // vertical short wall
      else if (!rv && tv && tv.down) {
        this.addWall(
          urwall,
          { sx: 256, sy: 192, sw: 64, sh: 128 },
          { up: 0, down: 0, left: 0, right: 0 }
        )
      }

      // bottom left corner
      if (!lv && !bv) {
        this.addWall(
          dlwall,
          { sx: 128, sy: 256, sw: 64, sh: 128 },
          { up: 0, down: CZ, left: 0, right: 0 }
        )
      }
      // bottom T
      else if (lv && !bv && !lv.right) {
        this.addWall(
          dlwall,
          { sx: 64, sy: 128, sw: 64, sh: 128 },
          { up: 0, down: CZ, left: 0, right: 0 }
        )
      }
      // horizontal short wall
      else if (lv && !bv && lv.right) {
        this.addWall(
          dlwall,
          { sx: 256, sy: 64, sw: 64, sh: 128 },
          { up: CZ, down: CZ, left: 0, right: 0 }
        )
      }

      // bottom right corner
      if (!rv && !bv) {
        this.addWall(
          drwall,
          { sx: 192, sy: 256, sw: 64, sh: 128 },
          { up: 0, down: CZ, left: 0, right: 0 }
        )
      }
    })
  }

  drawWalls = (ctx: CanvasRenderingContext2D) => {
    Object.values(this.walls).forEach((wall: Wall) => {
      ctx.drawImage(
        this.images.walls,
        wall.imageCoords.sx,
        wall.imageCoords.sy,
        wall.imageCoords.sw,
        wall.imageCoords.sh,
        wall.coords[0][0],
        wall.coords[0][1],
        wall.imageCoords.sw,
        wall.imageCoords.sh
      )
    })
  }

  clearCanvas = (ctx: CanvasRenderingContext2D) => {
    let translatedX = ctx.getTransform().e
    let translatedY = ctx.getTransform().f
    let mx1 = 0 - translatedX
    let my1 = 0 - translatedY
    let mx2 = CANVAS_WIDTH - translatedX + OFFSET_X
    let my2 = CANVAS_HEIGHT - translatedY + OFFSET_Y
    ctx.clearRect(mx1, my1, mx2, my2)
  }

  moveCanvas = (ctx: CanvasRenderingContext2D, dir: Direction) => {
    let translatedX = ctx.getTransform().e
    let translatedY = ctx.getTransform().f
    switch (dir) {
      case Direction.left:
        ctx.translate(translatedX < 0 ? STEP : 0, 0)
        break
      case Direction.right:
        ctx.translate(-translatedX > RIGHT_BORDER ? 0 : -STEP, 0)
        break
      case Direction.up:
        ctx.translate(0, translatedY < 0 ? STEP : 0)
        break
      case Direction.down:
        ctx.translate(0, -translatedY > BOTTOM_BORDER ? 0 : -STEP)
        break
      default:
        break
    }
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
