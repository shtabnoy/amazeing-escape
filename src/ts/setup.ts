import { createMazeGraph, createWalls } from './utils'
import { Point, Keys, Walls } from './types'

const ROOMS_HORIZONTAL = 6
const ROOMS_VERTICAL = 6
const STEP = 4
const OFFSET_X = 0
const OFFSET_Y = 0
const CW = window.innerWidth
const CH = window.innerHeight
const CELL_W = 250
const CAMERA_BORDER_X = OFFSET_X + 100
const CAMERA_BORDER_Y = OFFSET_Y + 100
const coords: Point = {
  x: 100,
  y: 100,
}
const keys: Keys = {}
const SPRITE_WIDTH = 24
const SPRITE_HEIGHT = 32
const CHARACTER_WIDTH = 56
const CHARACTER_HEIGHT = 64
const NUMBER_OF_FRAMES = 3
const FPS_INTERVAL = 1000 / 10
const WALL_DEPTH = 50
const RIGHT_BORDER = ROOMS_HORIZONTAL * CELL_W + WALL_DEPTH - CW
const BOTTOM_BORDER = ROOMS_VERTICAL * CELL_W + WALL_DEPTH - CH

let frame = 0
let charYOffset = 0
let walls: Walls = {}
let now: number, then: number, elapsed: number

const img = new Image()
img.src = 'src/assets/sprites.png'
const wallImage = new Image()
wallImage.src = 'src/assets/wall_sp.png'
const groundTile = new Image()
groundTile.src = 'src/assets/ground1.png'

const drawWalls = (ctx: CanvasRenderingContext2D) => {
  Object.values(walls).forEach(wall => {
    for (let i = 0; i < wall.b.x - wall.a.x; i += 50) {
      for (let j = 0; j < wall.b.y - wall.a.y; j += 50) {
        ctx.drawImage(
          wallImage,
          0,
          0,
          WALL_DEPTH + 2,
          WALL_DEPTH + 2,
          wall.a.x + i,
          wall.a.y + j,
          WALL_DEPTH,
          WALL_DEPTH
        )
      }
    }
  })
}

const drawGround = (ctx: CanvasRenderingContext2D) => {
  let translatedX = ctx.getTransform().e / 2
  let translatedY = ctx.getTransform().f / 2
  ctx.save()
  ctx.fillStyle = ctx.createPattern(groundTile, 'repeat')
  ctx.fillRect(
    0 - translatedX < 0 ? -1 : 0 - translatedX,
    0 - translatedY < 0 ? -1 : 0 - translatedY,
    CW - translatedX + OFFSET_X,
    CH - translatedY + OFFSET_Y
  )
  ctx.restore()
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
    CHARACTER_WIDTH,
    CHARACTER_HEIGHT
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
  // divide by two since there were adjustments for retina
  let translatedX = ctx.getTransform().e / 2
  let translatedY = ctx.getTransform().f / 2
  // TODO: Think why it's working
  ctx.clearRect(
    0 - translatedX < 0 ? -1 : 0 - translatedX,
    0 - translatedY < 0 ? -1 : 0 - translatedY,
    CW - translatedX + OFFSET_X,
    CH - translatedY + OFFSET_Y
  )
  switch (dir) {
    case 'left':
      charYOffset = 32 + 1 // sprites adjustment
      Object.values(walls).forEach(wall => {
        if (
          coords.x - STEP + CHARACTER_WIDTH >= wall.b.x &&
          coords.x - STEP <= wall.b.x &&
          coords.y + CHARACTER_HEIGHT >= wall.a.y &&
          coords.y <= wall.b.y
        ) {
          collided = true
        }
      })
      if (!collided) {
        coords.x -= STEP
        if (coords.x < CAMERA_BORDER_X - translatedX) {
          ctx.translate(translatedX < 0 ? STEP : 0, 0)
        }
      }
      break
    case 'right':
      charYOffset = 64 + 1 // sprites adjustment
      Object.values(walls).forEach(wall => {
        if (
          coords.x + STEP <= wall.a.x &&
          coords.x + STEP + CHARACTER_WIDTH >= wall.a.x &&
          coords.y + CHARACTER_HEIGHT >= wall.a.y &&
          coords.y <= wall.b.y
        ) {
          collided = true
        }
      })
      if (!collided) {
        coords.x += STEP
        if (coords.x + CHARACTER_WIDTH > CW - translatedX - CAMERA_BORDER_X) {
          ctx.translate(translatedX < -RIGHT_BORDER + 2 ? 0 : -STEP, 0) // TODO: strange 2px adjustment
        }
      }
      break
    case 'up':
      charYOffset = 96 + 1 // sprites adjustment
      Object.values(walls).forEach(wall => {
        if (
          coords.y - STEP + CHARACTER_HEIGHT >= wall.b.y &&
          coords.y - STEP <= wall.b.y &&
          coords.x + CHARACTER_WIDTH >= wall.a.x &&
          coords.x <= wall.b.x
        ) {
          collided = true
        }
      })
      if (!collided) {
        coords.y -= STEP
        if (coords.y < CAMERA_BORDER_Y - translatedY) {
          ctx.translate(0, translatedY < 0 ? STEP : 0)
        }
      }
      break
    case 'down':
      charYOffset = 0
      Object.values(walls).forEach(wall => {
        if (
          coords.y + STEP <= wall.a.y &&
          coords.y + STEP + CHARACTER_HEIGHT >= wall.a.y &&
          coords.x + CHARACTER_WIDTH >= wall.a.x &&
          coords.x <= wall.b.x
        ) {
          collided = true
        }
      })
      if (!collided) {
        coords.y += STEP
        if (coords.y + CHARACTER_HEIGHT > CH - translatedY - CAMERA_BORDER_Y) {
          ctx.translate(0, translatedY < -BOTTOM_BORDER + 2 ? 0 : -STEP) // TODO: strange 2px adjustment
        }
      }
      break
    default:
      break
  }
  drawGround(ctx)
  drawWalls(ctx)
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
  // ctx.rotate((45 * Math.PI) / 180)
  // ctx.translate(700, 0)
  // Add a game info line to the top
  ctx.translate(OFFSET_X, OFFSET_Y)

  /**
   * Create maze and walls
   */
  const mazeGraph = createMazeGraph(ROOMS_HORIZONTAL, ROOMS_VERTICAL)
  walls = createWalls(mazeGraph, {
    width: ROOMS_HORIZONTAL,
    height: ROOMS_VERTICAL,
    cellWidth: CELL_W,
    depth: WALL_DEPTH,
  })

  /**
   * Rendering
   */
  render(ctx)
  then = Date.now()
  requestAnimationFrame(() => update(ctx))
})
