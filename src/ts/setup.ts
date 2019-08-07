import Graph from './Graph'
import mst from './MST'

interface Maze {
  [key: string]: {
    left: number | null
    right: number | null
    up: number | null
    down: number | null
    x1: number
    y1: number
    x2: number
    y2: number
  }
}

interface Point {
  x: number
  y: number
}

interface Wall {
  a: Point
  b: Point
}

interface Walls {
  [key: string]: Wall
}

const walls: Walls = {}

const WIDTH = 5
const HEIGHT = 5
const CIRCLE_R = 5

function drawOnCanvas(ctx: CanvasRenderingContext2D) {
  Object.values(walls).forEach(wall => {
    ctx.beginPath()
    ctx.moveTo(wall.a.x, wall.a.y)
    ctx.lineTo(wall.b.x, wall.b.y)
    ctx.stroke()
    ctx.closePath()
  })
}

function drawCharacter(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.beginPath()
  ctx.arc(x, y, CIRCLE_R, 0, 2 * Math.PI)
  ctx.stroke()
  ctx.fill()
  ctx.closePath()
}

function prepareForDrawing(g: Graph) {
  const mazeObject: Maze = {}
  Object.keys(g.AdjList).forEach((v1, index) => {
    mazeObject[v1] = {
      left: null,
      right: null,
      up: null,
      down: null,
      x1: 0,
      y1: 0,
      x2: 0,
      y2: 0,
    }
    const rw = 50
    const offset = 10
    let topLeft = {
      x: (index % WIDTH) * rw + offset,
      y: Math.floor(index / HEIGHT) * rw + offset,
    }
    let topRight = {
      x: ((index % WIDTH) + 1) * rw + offset,
      y: Math.floor(index / HEIGHT) * rw + offset,
    }
    let bottomLeft = {
      x: (index % WIDTH) * rw + offset,
      y: (Math.floor(index / HEIGHT) + 1) * rw + offset,
    }
    let bottomRight = {
      x: ((index % WIDTH) + 1) * rw + offset,
      y: (Math.floor(index / HEIGHT) + 1) * rw + offset,
    }
    mazeObject[v1].x1 = (index % WIDTH) * rw + offset
    mazeObject[v1].x2 = ((index % WIDTH) + 1) * rw + offset
    mazeObject[v1].y1 = Math.floor(index / HEIGHT) * rw + offset
    mazeObject[v1].y2 = (Math.floor(index / HEIGHT) + 1) * rw + offset

    walls[`${topLeft.x}${topLeft.y}${bottomLeft.x}${bottomLeft.y}`] = {
      a: topLeft,
      b: bottomLeft,
    }
    walls[`${topLeft.x}${topLeft.y}${topRight.x}${topRight.y}`] = {
      a: topLeft,
      b: topRight,
    }
    walls[`${topRight.x}${topRight.y}${bottomRight.x}${bottomRight.y}`] = {
      a: topRight,
      b: bottomRight,
    }
    walls[`${bottomLeft.x}${bottomLeft.y}${bottomRight.x}${bottomRight.y}`] = {
      a: bottomLeft,
      b: bottomRight,
    }
    Object.keys(g.AdjList[v1]).forEach(v2 => {
      if (Number(v1) - Number(v2) === 1) {
        mazeObject[v1].left = Number(v2)
        delete walls[`${topLeft.x}${topLeft.y}${bottomLeft.x}${bottomLeft.y}`]
      }
      if (Number(v1) - Number(v2) === WIDTH) {
        mazeObject[v1].up = Number(v2)
        delete walls[`${topLeft.x}${topLeft.y}${topRight.x}${topRight.y}`]
      }
      if (Number(v1) - Number(v2) === -1) {
        mazeObject[v1].right = Number(v2)
        delete walls[
          `${topRight.x}${topRight.y}${bottomRight.x}${bottomRight.y}`
        ]
      }
      if (Number(v1) - Number(v2) === -WIDTH) {
        mazeObject[v1].down = Number(v2)
        delete walls[
          `${bottomLeft.x}${bottomLeft.y}${bottomRight.x}${bottomRight.y}`
        ]
      }
    })
  })
  return mazeObject
}

function makeGraph(w: number, h: number) {
  const g1 = new Graph()
  const g2 = new Graph()
  Object.keys(Array.from(Array(w * h))).forEach((n, index) => {
    g1.addVertex((index + 1).toString())
  })
  for (let row = 0; row < w; row++) {
    for (let col = 0; col < h; col++) {
      const v = row * w + col + 1

      if (row == 0 && col == 0) {
        g1.addEdge(v.toString(), (v + 1).toString(), Math.random()) // to the right
        g1.addEdge(v.toString(), (v + w).toString(), Math.random()) // to the bottom
      } else if (row == 0 && col == h - 1) {
        g1.addEdge(v.toString(), (v - 1).toString(), Math.random()) // to the left
        g1.addEdge(v.toString(), (v + w).toString(), Math.random()) // to the bottom
      } else if (row == w - 1 && col == 0) {
        g1.addEdge(v.toString(), (v + 1).toString(), Math.random()) // to the right
        g1.addEdge(v.toString(), (v - w).toString(), Math.random()) // to the top
      } else if (row == w - 1 && col == h - 1) {
        g1.addEdge(v.toString(), (v - 1).toString(), Math.random()) // to the left
        g1.addEdge(v.toString(), (v - w).toString(), Math.random()) // to the top
      } else if (row == 0) {
        g1.addEdge(v.toString(), (v - 1).toString(), Math.random()) // to the left
        g1.addEdge(v.toString(), (v + 1).toString(), Math.random()) // to the right
        g1.addEdge(v.toString(), (v + w).toString(), Math.random()) // to the bottom
      } else if (row == w - 1) {
        g1.addEdge(v.toString(), (v - 1).toString(), Math.random()) // to the left
        g1.addEdge(v.toString(), (v + 1).toString(), Math.random()) // to the right
        g1.addEdge(v.toString(), (v - w).toString(), Math.random()) // to the top
      } else if (col == 0) {
        g1.addEdge(v.toString(), (v - w).toString(), Math.random()) // to the top
        g1.addEdge(v.toString(), (v + w).toString(), Math.random()) // to the bottom
        g1.addEdge(v.toString(), (v + 1).toString(), Math.random()) // to the right
      } else if (col == h - 1) {
        g1.addEdge(v.toString(), (v - w).toString(), Math.random()) // to the top
        g1.addEdge(v.toString(), (v + w).toString(), Math.random()) // to the bottom
        g1.addEdge(v.toString(), (v - 1).toString(), Math.random()) // to the left
      } else {
        g1.addEdge(v.toString(), (v - w).toString(), Math.random()) // to the top
        g1.addEdge(v.toString(), (v + w).toString(), Math.random()) // to the bottom
        g1.addEdge(v.toString(), (v - 1).toString(), Math.random()) // to the left
        g1.addEdge(v.toString(), (v + 1).toString(), Math.random()) // to the right
      }
    }
  }
  mst(g1, g2)
  return g2
}

const rerender = (
  ctx: CanvasRenderingContext2D,
  maze: Maze,
  cw: number,
  ch: number,
  coords: Point
) => {
  ctx.clearRect(0, 0, cw, ch)
  drawOnCanvas(ctx)
  drawCharacter(ctx, coords.x, coords.y)
}

document.addEventListener('DOMContentLoaded', () => {
  const graph = makeGraph(WIDTH, HEIGHT)
  const maze = prepareForDrawing(graph)

  const canvas = document.getElementById('canvas') as HTMLCanvasElement
  // const cw = window.innerWidth
  // const ch = window.innerHeight
  const cw = 600
  const ch = 600

  // retina adjustments
  canvas.width = cw * 2
  canvas.height = ch * 2
  canvas.style.width = `${cw}px`
  canvas.style.height = `${ch}px`
  const ctx = canvas.getContext('2d')
  const ratio = window.devicePixelRatio
  ctx.scale(ratio, ratio)

  ctx.strokeStyle = 'black'
  ctx.lineWidth = 2
  ctx.lineCap = 'square'

  const coords = {
    x: 30,
    y: 30,
  }
  const STEP = 2
  drawOnCanvas(ctx)
  drawCharacter(ctx, coords.x, coords.y)

  const move = (dir: 'left' | 'right' | 'up' | 'down') => {
    let collided = false
    switch (dir) {
      case 'left':
        Object.values(walls).forEach(wall => {
          if (
            coords.x - STEP >= wall.b.x &&
            coords.x - STEP - CIRCLE_R <= wall.b.x &&
            coords.y + CIRCLE_R >= wall.a.y &&
            coords.y - CIRCLE_R <= wall.b.y
          ) {
            collided = true
          }
        })
        if (!collided) coords.x -= STEP
        break
      case 'right':
        Object.values(walls).forEach(wall => {
          if (
            coords.x + STEP <= wall.a.x &&
            coords.x + STEP + CIRCLE_R >= wall.a.x &&
            coords.y + CIRCLE_R >= wall.a.y &&
            coords.y - CIRCLE_R <= wall.b.y
          ) {
            collided = true
          }
        })
        if (!collided) coords.x += STEP
        break
      case 'up':
        Object.values(walls).forEach(wall => {
          if (
            coords.y - STEP >= wall.b.y &&
            coords.y - STEP - CIRCLE_R <= wall.b.y &&
            coords.x + CIRCLE_R >= wall.a.x &&
            coords.x - CIRCLE_R <= wall.b.x
          ) {
            collided = true
          }
        })
        if (!collided) coords.y -= STEP
        break
      case 'down':
        Object.values(walls).forEach(wall => {
          if (
            coords.y + STEP <= wall.a.y &&
            coords.y + STEP + CIRCLE_R >= wall.a.y &&
            coords.x + CIRCLE_R >= wall.a.x &&
            coords.x - CIRCLE_R <= wall.b.x
          ) {
            collided = true
          }
        })
        if (!collided) coords.y += STEP
        break
      default:
        break
    }
    rerender(ctx, maze, cw, ch, coords)
    collided = false
  }

  const keys: {
    [key: string]: boolean
  } = {}

  const update = () => {
    if (keys[39]) {
      move('right')
    }
    if (keys[37]) {
      move('left')
    }
    if (keys[40]) {
      move('down')
    }
    if (keys[38]) {
      move('up')
    }
    requestAnimationFrame(update)
  }

  requestAnimationFrame(update)

  document.addEventListener('keydown', e => {
    keys[e.keyCode] = true
  })
  document.addEventListener('keyup', e => {
    keys[e.keyCode] = false
  })
})
