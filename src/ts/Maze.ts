import { Point } from './types'
import MazeGraph, { Direction, Vertex } from './MazeGraph'
import { rnd } from './utils'
import { CANVAS_WIDTH, CANVAS_HEIGHT, OFFSET_X, OFFSET_Y } from './constants'

type P = [number, number]
type Block4 = [P, P, P, P]
type Block6 = [P, P, P, P, P, P]
type Block8 = [P, P, P, P, P, P, P, P]
type Wall = Block4 | Block6 | Block8

interface Room {
  walls?: Wall[]
  // walls?: any
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
    // console.log(this.rooms)
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
      }
      // if (!vertex.edges[Direction.up]) {
      //   room.walls[Direction.up] = [
      //     { x: vx * rw, y: vy * rw },
      //     { x: (vx + 1) * rw, y: vy * rw + d },
      //   ]
      // }
      // if (!vertex.edges[Direction.down]) {
      //   room.walls[Direction.down] = [
      //     { x: vx * rw, y: (vy + 1) * rw },
      //     { x: (vx + 1) * rw, y: (vy + 1) * rw + d },
      //   ]
      // }
      // if (!vertex.edges[Direction.left]) {
      //   room.walls[Direction.left] = [
      //     { x: vx * rw, y: vy * rw },
      //     { x: vx * rw + d, y: (vy + 1) * rw + d },
      //   ]
      // }
      // if (!vertex.edges[Direction.right]) {
      //   room.walls[Direction.right] = [
      //     { x: (vx + 1) * rw, y: vy * rw },
      //     { x: (vx + 1) * rw + d, y: (vy + 1) * rw + d },
      //   ]
      // }
      if (
        vertex.edges[Direction.up] &&
        vertex.edges[Direction.down] &&
        vertex.edges[Direction.right] &&
        vertex.edges[Direction.left]
      ) {
        return
      }

      const x1 = vx * rw // left X
      const x2 = (vx + 1) * rw // right X
      const y1 = vy * rw // top Y
      const y2 = (vy + 1) * rw // bottom Y

      // Left-only wall
      if (
        vertex.edges[Direction.up] &&
        vertex.edges[Direction.down] &&
        vertex.edges[Direction.right]
      ) {
        room.walls = [[[x1, y1], [x1 + d, y1], [x1 + d, y2], [x1, y2]]]
        this.rooms.push(room)
        return
      }

      // Right-only wall
      if (
        vertex.edges[Direction.up] &&
        vertex.edges[Direction.down] &&
        vertex.edges[Direction.left]
      ) {
        room.walls = [[[x2 - d, y1], [x2, y1], [x2, y2], [x2 - d, y2]]]
        this.rooms.push(room)
        return
      }

      // Top-only wall
      if (
        vertex.edges[Direction.down] &&
        vertex.edges[Direction.left] &&
        vertex.edges[Direction.right]
      ) {
        room.walls = [[[x1, y1], [x2, y1], [x2, y1 + d], [x1, y1 + d]]]
        this.rooms.push(room)
        return
      }

      // Bottom-only wall
      if (
        vertex.edges[Direction.up] &&
        vertex.edges[Direction.left] &&
        vertex.edges[Direction.right]
      ) {
        room.walls = [[[x1, y2 - d], [x2, y2 - d], [x2, y2], [x1, y2]]]
        this.rooms.push(room)
        return
      }

      // Left-top wall
      if (vertex.edges[Direction.right] && vertex.edges[Direction.down]) {
        room.walls = [
          [
            [x1, y1],
            [x2, y1],
            [x2, y1 + d],
            [x1 + d, y1 + d],
            [x1 + d, y2],
            [x1, y2],
          ],
        ]
        this.rooms.push(room)
        return
      }

      // Right-top wall
      if (vertex.edges[Direction.left] && vertex.edges[Direction.down]) {
        room.walls = [
          [
            [x1, y1],
            [x2, y1],
            [x2, y2],
            [x2 - d, y2],
            [x2 - d, y1 + d],
            [x1, y1 + d],
          ],
        ]
        this.rooms.push(room)
        return
      }

      // Left-bottom wall
      if (vertex.edges[Direction.up] && vertex.edges[Direction.right]) {
        room.walls = [
          [
            [x1, y1],
            [x1 + d, y1],
            [x1 + d, y2 - d],
            [x2, y2 - d],
            [x2, y2],
            [x1, y2],
          ],
        ]
        this.rooms.push(room)
        return
      }

      // Right-bottom wall
      if (vertex.edges[Direction.up] && vertex.edges[Direction.left]) {
        room.walls = [
          [
            [x2 - d, y1],
            [x2, y1],
            [x2, y2],
            [x1, y2],
            [x1, y2 - d],
            [x2 - d, y2 - d],
          ],
        ]
        this.rooms.push(room)
        return
      }

      // top and bottom walls
      if (vertex.edges[Direction.left] && vertex.edges[Direction.right]) {
        room.walls = [
          [[x1, y1], [x2, y1], [x2, y1 + d], [x1, y1 + d]],
          [[x1, y2 - d], [x2, y2 - d], [x2, y2], [x1, y2]],
        ]
        this.rooms.push(room)
        return
      }

      // left and right walls
      if (vertex.edges[Direction.up] && vertex.edges[Direction.down]) {
        room.walls = [
          [[x1, y1], [x1 + d, y1], [x1 + d, y2], [x1, y2]],
          [[x2 - d, y1], [x2, y1], [x2, y2], [x2 - d, y2]],
        ]
        this.rooms.push(room)
        return
      }

      // Left-bottom-right wall
      if (vertex.edges[Direction.up]) {
        room.walls = [
          [
            [x1, y1],
            [x1 + d, y1],
            [x1 + d, y2 - d],
            [x2 - d, y2 - d],
            [x2 - d, y1],
            [x2, y1],
            [x2, y2],
            [x1, y2],
          ],
        ]
        this.rooms.push(room)
        return
      }

      // Left-top-right wall
      if (vertex.edges[Direction.down]) {
        room.walls = [
          [
            [x1, y1],
            [x2, y1],
            [x2, y2],
            [x2 - d, y2],
            [x2 - d, y1 + d],
            [x1 + d, y1 + d],
            [x1 + d, y2],
            [x1, y2],
          ],
        ]
        this.rooms.push(room)
        return
      }

      // Top-left-down wall
      if (vertex.edges[Direction.right]) {
        room.walls = [
          [
            [x1, y1],
            [x2, y1],
            [x2, y1 + d],
            [x1 + d, y1 + d],
            [x1 + d, y2 - d],
            [x2, y2 - d],
            [x2, y2],
            [x1, y2],
          ],
        ]
        this.rooms.push(room)
        return
      }

      // Top-right-down wall
      if (vertex.edges[Direction.left]) {
        room.walls = [
          [
            [x1, y1],
            [x2, y1],
            [x2, y2],
            [x1, y2],
            [x1, y2 - d],
            [x2 - d, y2 - d],
            [x2 - d, y1 + d],
            [x1, y1 + d],
          ],
        ]
        this.rooms.push(room)
        return
      }
    })
  }

  drawWalls = (ctx: CanvasRenderingContext2D) => {
    this.rooms.forEach((room: Room) => {
      room.walls.forEach((wall: Wall) => {
        ctx.strokeStyle = '#111'
        ctx.fillStyle = '#6aa3e6'
        ctx.beginPath()
        ctx.moveTo(wall[0][0], wall[0][1])
        wall.slice(1).forEach((block: [number, number]) => {
          ctx.lineTo(block[0], block[1])
        })
        ctx.closePath()
        ctx.stroke()
        ctx.fill()
      })
    })
  }

  drawGround = (ctx: CanvasRenderingContext2D) => {
    let translatedX = ctx.getTransform().e / 2
    let translatedY = ctx.getTransform().f / 2
    ctx.fillStyle = ctx.createPattern(this.groundImg, 'repeat')
    ctx.fillRect(
      0 - translatedX < 0 ? -1 : 0 - translatedX,
      0 - translatedY < 0 ? -1 : 0 - translatedY,
      CANVAS_WIDTH - translatedX + OFFSET_X,
      CANVAS_HEIGHT - translatedY + OFFSET_Y
    )
  }

  getWalls() {
    return this.walls
  }

  getRooms() {
    return this.rooms
  }
}
