import Graph from './Graph'
import mst from './MST'

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

interface Keys {
  [key: string]: boolean
}

const walls: Walls = {}
const WIDTH = 5
const HEIGHT = 5
const CIRCLE_R = 5
const STEP = 2
const CW = 600 // window.innerWidth
const CH = 600 // window.innerHeight
const coords: Point = {
  x: 30,
  y: 30,
}
const keys: Keys = {}

const drawWalls = (ctx: CanvasRenderingContext2D) => {
  Object.values(walls).forEach(wall => {
    ctx.beginPath()
    ctx.moveTo(wall.a.x, wall.a.y)
    ctx.lineTo(wall.b.x, wall.b.y)
    ctx.stroke()
    ctx.closePath()
  })
}

const drawCharacter = (ctx: CanvasRenderingContext2D) => {
  ctx.beginPath()
  ctx.arc(coords.x, coords.y, CIRCLE_R, 0, 2 * Math.PI)
  ctx.stroke()
  ctx.fill()
  ctx.closePath()
}

const prepareForDrawing = (g: Graph) => {
  Object.keys(g.AdjList).forEach((v1, index) => {
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
        delete walls[`${topLeft.x}${topLeft.y}${bottomLeft.x}${bottomLeft.y}`]
      }
      if (Number(v1) - Number(v2) === WIDTH) {
        delete walls[`${topLeft.x}${topLeft.y}${topRight.x}${topRight.y}`]
      }
      if (Number(v1) - Number(v2) === -1) {
        delete walls[
          `${topRight.x}${topRight.y}${bottomRight.x}${bottomRight.y}`
        ]
      }
      if (Number(v1) - Number(v2) === -WIDTH) {
        delete walls[
          `${bottomLeft.x}${bottomLeft.y}${bottomRight.x}${bottomRight.y}`
        ]
      }
    })
  })
}

const makeGraph = (w: number, h: number) => {
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

const rerender = (ctx: CanvasRenderingContext2D) => {
  ctx.clearRect(0, 0, CW, CH)
  drawWalls(ctx)
  drawCharacter(ctx)
}

const move = (
  ctx: CanvasRenderingContext2D,
  dir: 'left' | 'right' | 'up' | 'down'
) => {
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
  rerender(ctx)
  collided = false
}

const update = (ctx: CanvasRenderingContext2D) => {
  if (keys[39]) {
    move(ctx, 'right')
  }
  if (keys[37]) {
    move(ctx, 'left')
  }
  if (keys[40]) {
    move(ctx, 'down')
  }
  if (keys[38]) {
    move(ctx, 'up')
  }
  requestAnimationFrame(() => update(ctx))
}

document.addEventListener('keydown', e => {
  keys[e.keyCode] = true
})
document.addEventListener('keyup', e => {
  keys[e.keyCode] = false
})

document.addEventListener('DOMContentLoaded', () => {
  const graph = makeGraph(WIDTH, HEIGHT)
  const canvas = document.getElementById('canvas') as HTMLCanvasElement
  const ctx = canvas.getContext('2d')
  const ratio = window.devicePixelRatio

  // retina adjustments
  canvas.width = CW * 2
  canvas.height = CH * 2
  canvas.style.width = `${CW}px`
  canvas.style.height = `${CH}px`
  ctx.strokeStyle = 'black'
  ctx.lineWidth = 2
  ctx.lineCap = 'square'
  ctx.scale(ratio, ratio)

  prepareForDrawing(graph)
  drawWalls(ctx)
  drawCharacter(ctx)
  requestAnimationFrame(() => update(ctx))
})
