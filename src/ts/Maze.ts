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
  private walls: Walls
  private groundImg: HTMLImageElement
  private rooms: any

  constructor(
    width: number,
    height: number,
    config: any // TODO: Define the interface
  ) {
    this.groundImg = config.groundImg
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

      if (!vertex[Direction.up] && !this.walls[uwall.toString()]) {
        this.walls[uwall.toString()] = {
          coords: uwall,
          img: '',
        }
      }

      if (!vertex[Direction.down] && !this.walls[dwall.toString()]) {
        this.walls[dwall.toString()] = {
          coords: dwall,
          img: '',
        }
      }

      if (!vertex[Direction.left] && !this.walls[lwall.toString()]) {
        this.walls[lwall.toString()] = {
          coords: lwall,
          img: '',
        }
      }

      if (!vertex[Direction.right] && !this.walls[rwall.toString()]) {
        this.walls[rwall.toString()] = {
          coords: rwall,
          img: '',
        }
      }

      // corner blocks (necessary for all rooms)
      if (!this.walls[ulwall.toString()])
        this.walls[ulwall.toString()] = {
          coords: ulwall,
          img: '',
        }
      if (!this.walls[dlwall.toString()])
        this.walls[dlwall.toString()] = {
          coords: dlwall,
          img: '',
        }
      if (!this.walls[urwall.toString()])
        this.walls[urwall.toString()] = {
          coords: urwall,
          img: '',
        }
      if (!this.walls[drwall.toString()])
        this.walls[drwall.toString()] = {
          coords: drwall,
          img: '',
        }
    })
    // g.vertices.forEach((vertex: Vertex) => {
    //   const xy = vertex.name.split(',')
    //   const vx = Number(xy[0])
    //   const vy = Number(xy[1])
    //   const room: Room = {
    //     a: { x: vx * rw, y: vy * rw },
    //     b: { x: (vx + 1) * rw, y: (vy + 1) * rw },
    //     walls: [],
    //   }

    //   const x1 = vx * rw // left X
    //   const x2 = (vx + 1) * rw // right X
    //   const y1 = vy * rw // top Y
    //   const y2 = (vy + 1) * rw // bottom Y

    //   if (!vertex.edges[Direction.up]) {
    //     room.walls.push([[x1 + d, y1], [x2, y1 + d]]) // top wall
    //   }

    //   if (!vertex.edges[Direction.down]) {
    //     room.walls.push([[x1 + d, y2], [x2, y2]]) // down wall
    //   }

    //   if (!vertex.edges[Direction.left]) {
    //     room.walls.push([[x1, y1 + d], [x1 + d, y2]]) // left wall
    //   }

    //   if (!vertex.edges[Direction.right]) {
    //     room.walls.push([[x2, y1 + d], [x2 + d, y2]]) // right wall
    //   }

    //   room.walls.push([[x1, y1], [x1 + d, y1 + d]])
    //   room.walls.push([[x2, y1], [x2 + d, y1 + d]])
    //   room.walls.push([[x1, y2], [x1 + d, y2 + d]])
    //   room.walls.push([[x2, y2], [x2 + d, y2 + d]])

    //   this.rooms[vertex.name] = room
    // })
  }

  drawWalls = (ctx: CanvasRenderingContext2D) => {
    // Object.values(this.rooms).forEach((room: Room) => {
    //   room.walls.forEach((wall: any) => {
    //     ctx.strokeStyle = '#111'
    //     ctx.fillStyle = '#6aa3e6'
    //     ctx.lineWidth = 0
    //     ctx.strokeRect(
    //       wall[0][0],
    //       wall[0][1],
    //       wall[1][0] - wall[0][0],
    //       wall[1][1] - wall[0][1]
    //     )
    //     ctx.fillRect(
    //       wall[0][0],
    //       wall[0][1],
    //       wall[1][0] - wall[0][0],
    //       wall[1][1] - wall[0][1]
    //     )
    //   })
    // })
    Object.values(this.walls).forEach((wall: Wall) => {
      // room.walls.forEach((wall: any) => {
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
      // })
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

  getWalls() {
    return this.walls
  }
}
