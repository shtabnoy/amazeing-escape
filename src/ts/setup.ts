import { createMazeGraph, createWalls } from './utils'
import { Point, Keys, Walls } from './types'

const WIDTH = 5
const HEIGHT = 5
const STEP = 2
const CW = window.innerWidth - 10
const CH = window.innerHeight - 10
const CELL_W = 150
const OFFSET = 10
const coords: Point = {
  x: 50,
  y: 50,
}
const keys: Keys = {}
const img = new Image()
img.src = 'src/assets/sprites.png'
const SPRITE_WIDTH = 24
const SPRITE_HEIGHT = 32
const CHAR_W = 56
const CHAR_H = 64
const NUMBER_OF_FRAMES = 3
const FPS_INTERVAL = 1000 / 10
let frame = 0
let charYOffset = 0
let walls: Walls = {}
let now, then: number, elapsed

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
  ctx.drawImage(
    img,
    4 + frame * 32,
    charYOffset,
    SPRITE_WIDTH,
    SPRITE_HEIGHT,
    coords.x,
    coords.y,
    CHAR_W,
    CHAR_H
  )
}

const render = (ctx: CanvasRenderingContext2D) => {
  drawWalls(ctx)
  drawCharacter(ctx)
}

const move = (
  ctx: CanvasRenderingContext2D,
  dir: 'left' | 'right' | 'up' | 'down'
) => {
  let collided = false
  ctx.clearRect(coords.x, coords.y, CHAR_W, CHAR_H)
  // ctx.clearRect(coords.x - CHAR_HW, coords.y - CHAR_HH, CHAR_W, CHAR_H)
  switch (dir) {
    case 'left':
      charYOffset = 32 + 1 // sprites adjustment
      Object.values(walls).forEach(wall => {
        if (
          coords.x - STEP + CHAR_W >= wall.b.x &&
          coords.x - STEP <= wall.b.x &&
          coords.y + CHAR_H >= wall.a.y &&
          coords.y <= wall.b.y
        ) {
          collided = true
        }
      })
      if (!collided) coords.x -= STEP
      break
    case 'right':
      charYOffset = 64 + 1 // sprites adjustment
      Object.values(walls).forEach(wall => {
        if (
          coords.x + STEP <= wall.a.x &&
          coords.x + STEP + CHAR_W >= wall.a.x &&
          coords.y + CHAR_H >= wall.a.y &&
          coords.y <= wall.b.y
        ) {
          collided = true
        }
      })
      if (!collided) coords.x += STEP
      break
    case 'up':
      charYOffset = 96 + 1 // sprites adjustment
      Object.values(walls).forEach(wall => {
        if (
          coords.y - STEP + CHAR_H >= wall.b.y &&
          coords.y - STEP <= wall.b.y &&
          coords.x + CHAR_W >= wall.a.x &&
          coords.x <= wall.b.x
        ) {
          collided = true
        }
      })
      if (!collided) coords.y -= STEP
      break
    case 'down':
      charYOffset = 0
      Object.values(walls).forEach(wall => {
        if (
          coords.y + STEP <= wall.a.y &&
          coords.y + STEP + CHAR_H >= wall.a.y &&
          coords.x + CHAR_W >= wall.a.x &&
          coords.x <= wall.b.x
        ) {
          collided = true
        }
      })
      if (!collided) coords.y += STEP
      break
    default:
      break
  }
  drawCharacter(ctx)
  updateSpriteFrames()
  collided = false
}

const updateSpriteFrames = () => {
  now = Date.now()
  elapsed = now - then
  if (elapsed > FPS_INTERVAL) {
    // adjust fpsInterval not being a multiple of RAF's interval (16.7ms)
    then = now - (elapsed % FPS_INTERVAL)
    if (frame < NUMBER_OF_FRAMES - 1) {
      frame += 1
    } else {
      frame = 0
    }
  }
}

const update = (ctx: CanvasRenderingContext2D) => {
  // moving character
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
  render(ctx)
  then = Date.now()
  requestAnimationFrame(() => update(ctx))
})
