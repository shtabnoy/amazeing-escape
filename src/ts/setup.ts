import { createMazeGraph, createWalls } from './utils'
import { Point, Keys, Walls } from './types'

const WIDTH = 5
const HEIGHT = 5
// const CIRCLE_R = 5
const STEP = 2
const CW = 600 // window.innerWidth
const CH = 600 // window.innerHeight
const CELL_W = 50
const OFFSET = 10
const coords: Point = {
  x: 30,
  y: 30,
}
const keys: Keys = {}
const img = new Image()
img.src = 'src/assets/boy_walking_1.png'
const CHAR_REAL_W = 200
const CHAR_REAL_H = 337
const CHAR_W = CHAR_REAL_W / 10
const CHAR_H = CHAR_REAL_H / 10
const CHAR_HW = CHAR_W / 2
const CHAR_HH = CHAR_H / 2
let walls: Walls = {}

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
  // ctx.beginPath()
  // ctx.arc(coords.x, coords.y, CIRCLE_R, 0, 2 * Math.PI)
  // ctx.stroke()
  // ctx.fill()
  // ctx.closePath()
  ctx.drawImage(
    img,
    0,
    0,
    CHAR_REAL_W,
    CHAR_REAL_H,
    coords.x - CHAR_HW,
    coords.y - CHAR_HH,
    CHAR_W,
    CHAR_H
  )
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
          coords.x - STEP - CHAR_HW <= wall.b.x &&
          coords.y + CHAR_HH >= wall.a.y &&
          coords.y - CHAR_HH <= wall.b.y
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
          coords.x + STEP + CHAR_HW >= wall.a.x &&
          coords.y + CHAR_HH >= wall.a.y &&
          coords.y - CHAR_HH <= wall.b.y
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
          coords.y - STEP - CHAR_HH <= wall.b.y &&
          coords.x + CHAR_HW >= wall.a.x &&
          coords.x - CHAR_HW <= wall.b.x
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
          coords.y + STEP + CHAR_HH >= wall.a.y &&
          coords.x + CHAR_HW >= wall.a.x &&
          coords.x - CHAR_HW <= wall.b.x
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
  /**
   * Setup canvas
   */
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

  /**
   * Create maze and walls
   */
  const mazeGraph = createMazeGraph(WIDTH, HEIGHT)
  walls = createWalls(mazeGraph, {
    width: WIDTH,
    height: HEIGHT,
    cellWidth: CELL_W,
    offset: OFFSET,
  })

  /**
   * Rendering
   */
  drawWalls(ctx)
  drawCharacter(ctx)
  requestAnimationFrame(() => update(ctx))
})
