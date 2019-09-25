import { Wall } from './types'
import Hero from './Hero'
import Renderer from './Renderer'
import '../styles/global.scss'
import Maze from './Maze'

// const OFFSET_X = 0
// const OFFSET_Y = 0
const CW = window.innerWidth
const CH = window.innerHeight
// const CELL_W = 250
// const CAMERA_BORDER_X = OFFSET_X + 100
// const CAMERA_BORDER_Y = OFFSET_Y + 100
// const WALL_DEPTH = 50
// const RIGHT_BORDER = ROOMS_HORIZONTAL * CELL_W + WALL_DEPTH - CW
// const BOTTOM_BORDER = ROOMS_VERTICAL * CELL_W + WALL_DEPTH - CH

// const drawGround = (ctx: CanvasRenderingContext2D) => {
//   let translatedX = ctx.getTransform().e / 2
//   let translatedY = ctx.getTransform().f / 2
//   ctx.save()
//   // ctx.fillStyle = ctx.createPattern(groundTile, 'repeat')
//   ctx.fillRect(
//     0 - translatedX < 0 ? -1 : 0 - translatedX,
//     0 - translatedY < 0 ? -1 : 0 - translatedY,
//     CW - translatedX + OFFSET_X,
//     CH - translatedY + OFFSET_Y
//   )
//   ctx.restore()
// }

// const move = (
//   ctx: CanvasRenderingContext2D,
//   dir: 'left' | 'right' | 'up' | 'down'
// ) => {
//   let collided = false
//   // divide by two since there were adjustments for retina
//   let translatedX = ctx.getTransform().e / 2
//   let translatedY = ctx.getTransform().f / 2
//   // TODO: Think why it's working
//   ctx.clearRect(
//     0 - translatedX < 0 ? -1 : 0 - translatedX,
//     0 - translatedY < 0 ? -1 : 0 - translatedY,
//     CW - translatedX + OFFSET_X,
//     CH - translatedY + OFFSET_Y
//   )
//   switch (dir) {
//     case 'left':
//       charYOffset = 32 + 1 // sprites adjustment
//       Object.values(walls).forEach(wall => {
//         if (
//           coords.x - STEP + CHARACTER_WIDTH >= wall.b.x &&
//           coords.x - STEP <= wall.b.x &&
//           coords.y + CHARACTER_HEIGHT >= wall.a.y &&
//           coords.y <= wall.b.y
//         ) {
//           collided = true
//         }
//       })
//       if (!collided) {
//         coords.x -= STEP
//         if (coords.x < CAMERA_BORDER_X - translatedX) {
//           ctx.translate(translatedX < 0 ? STEP : 0, 0)
//         }
//       }
//       break
//     case 'right':
//       charYOffset = 64 + 1 // sprites adjustment
//       Object.values(walls).forEach(wall => {
//         if (
// coords.x + STEP <= wall.a.x &&
// coords.x + STEP + CHARACTER_WIDTH >= wall.a.x &&
// coords.y + CHARACTER_HEIGHT >= wall.a.y &&
// coords.y <= wall.b.y
//         ) {
//           collided = true
//         }
//       })
//       if (!collided) {
//         coords.x += STEP
//         if (coords.x + CHARACTER_WIDTH > CW - translatedX - CAMERA_BORDER_X) {
//           ctx.translate(translatedX < -RIGHT_BORDER + 2 ? 0 : -STEP, 0) // TODO: strange 2px adjustment
//         }
//       }
//       break
//     case 'up':
//       charYOffset = 96 + 1 // sprites adjustment
//       Object.values(walls).forEach(wall => {
//         if (
// coords.y - STEP + CHARACTER_HEIGHT >= wall.b.y &&
// coords.y - STEP <= wall.b.y &&
// coords.x + CHARACTER_WIDTH >= wall.a.x &&
// coords.x <= wall.b.x
//         ) {
//           collided = true
//         }
//       })
//       if (!collided) {
//         coords.y -= STEP
//         if (coords.y < CAMERA_BORDER_Y - translatedY) {
//           ctx.translate(0, translatedY < 0 ? STEP : 0)
//         }
//       }
//       break
//     case 'down':
//       charYOffset = 0
//       Object.values(walls).forEach(wall => {
//         if (
// coords.y + STEP <= wall.a.y &&
// coords.y + STEP + CHARACTER_HEIGHT >= wall.a.y &&
// coords.x + CHARACTER_WIDTH >= wall.a.x &&
// coords.x <= wall.b.x
//         ) {
//           collided = true
//         }
//       })
//       if (!collided) {
//         coords.y += STEP
//         if (coords.y + CHARACTER_HEIGHT > CH - translatedY - CAMERA_BORDER_Y) {
//           ctx.translate(0, translatedY < -BOTTOM_BORDER + 2 ? 0 : -STEP) // TODO: strange 2px adjustment
//         }
//       }
//       break
//     default:
//       break
//   }
//   drawGround(ctx)
//   // drawWalls(ctx)
//   // drawCharacter(ctx)
//   updateSpriteFrames()
//   collided = false
// }

const drawWalls = (ctx: CanvasRenderingContext2D, walls: Wall[]) => {
  walls.forEach((wall: Wall) => {
    ctx.beginPath()
    ctx.moveTo(wall.a.x, wall.a.y)
    ctx.lineTo(wall.b.x, wall.b.y)
    ctx.stroke()
  })
}

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
  ctx.translate(10, 10)

  const r = new Renderer(ctx)
  r.addMaze(new Maze(ctx, 4, 4, { rw: 100, d: 10 }))
  r.addHero(new Hero(ctx))
  r.render()

  /**
   * Rendering
   */
  // requestAnimationFrame(() => render(ctx, hero))
})
