import Hero from './Hero'
import Renderer from './Renderer'
import Maze from './Maze'
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  ROOMS_HORIZONTAL,
  ROOMS_VERTICAL,
  ROOM_WIDTH,
  WALL_DEPTH,
  OFFSET_X,
  OFFSET_Y,
} from './constants'
import '../styles/global.scss'

document.addEventListener('DOMContentLoaded', () => {
  /**
   * Setup canvas
   */
  const canvas = document.getElementById('canvas') as HTMLCanvasElement
  const ctx = canvas.getContext('2d')
  const ratio = window.devicePixelRatio

  // retina adjustments
  canvas.width = CANVAS_WIDTH * 2
  canvas.height = CANVAS_HEIGHT * 2
  canvas.style.width = `${CANVAS_WIDTH}px`
  canvas.style.height = `${CANVAS_HEIGHT}px`
  ctx.strokeStyle = 'black'
  ctx.lineWidth = 2
  ctx.lineCap = 'square'
  ctx.scale(ratio, ratio)
  ctx.translate(OFFSET_X, OFFSET_Y)

  const r = new Renderer(ctx)
  r.addMaze(
    new Maze(ctx, ROOMS_HORIZONTAL, ROOMS_VERTICAL, {
      rw: ROOM_WIDTH,
      d: WALL_DEPTH,
    })
  )
  r.addHero(new Hero(ctx, { x: 61, y: 61 }))
  r.render()

  // background audio
  // const audio = new Audio('src/assets/audio/footstep1.mp3')
  // audio.loop = true
  // audio.playbackRate = 1.3
  // // audio.play()
})
