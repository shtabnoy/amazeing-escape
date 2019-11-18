import Maze from './Maze'
import Hero from './Hero'
import { Keys, ArrowKeys, Wall, AnimationControls } from './types'
import {
  FPS_INTERVAL,
  CAMERA_BORDER_X,
  CAMERA_BORDER_Y,
  STEP,
  CANVAS_HEIGHT,
  BOTTOM_BORDER,
  CANVAS_WIDTH,
  RIGHT_BORDER,
  OFFSET_X,
  OFFSET_Y,
  RATIO,
  ROOMS_HORIZONTAL,
  ROOMS_VERTICAL,
  ROOM_WIDTH,
  WALL_DEPTH,
} from './constants'
import { Direction } from './MazeGraph'
import { loadImage } from './utils'

export default class Renderer {
  private layers: CanvasRenderingContext2D[]
  private maze: Maze
  private hero: Hero
  private animCtrl: AnimationControls = {
    now: 0,
    then: 0,
    elapsed: 0,
  }
  private keys: Keys = {
    ArrowRight: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowUp: false,
  }

  constructor() {
    document.addEventListener('keydown', e => {
      if (e.key in ArrowKeys) this.keys[e.key as ArrowKeys] = true
    })
    document.addEventListener('keyup', e => {
      if (e.key in ArrowKeys) this.keys[e.key as ArrowKeys] = false
    })
    this.layers = []

    // this.footstep = new Audio('src/assets/audio/footstep2.mp3')
    // this.footstep.loop = true
    // this.footstep.playbackRate = 1
  }

  private collisionRight = (wall: Wall) => {
    const { x: x1, y: y1 } = this.hero.getCoords()
    const { x: x2, y: y2 } = this.hero.getBottomRightCoords()
    return (
      x1 + STEP <= wall.a.x &&
      x2 + STEP >= wall.a.x &&
      y1 <= wall.b.y &&
      y2 >= wall.a.y
    )
  }

  private collisionLeft = (wall: Wall) => {
    const { x: x1, y: y1 } = this.hero.getCoords()
    const { x: x2, y: y2 } = this.hero.getBottomRightCoords()
    return (
      x1 - STEP <= wall.b.x &&
      x2 - STEP >= wall.b.x &&
      y1 <= wall.b.y &&
      y2 >= wall.a.y
    )
  }

  private collisionUp = (wall: Wall) => {
    const { x: x1, y: y1 } = this.hero.getCoords()
    const { x: x2, y: y2 } = this.hero.getBottomRightCoords()
    return (
      x1 <= wall.b.x &&
      x2 >= wall.a.x &&
      y1 - STEP <= wall.b.y &&
      y2 - STEP >= wall.b.y
    )
  }

  private collisionDown = (wall: Wall) => {
    const { x: x1, y: y1 } = this.hero.getCoords()
    const { x: x2, y: y2 } = this.hero.getBottomRightCoords()
    return (
      x1 <= wall.b.x &&
      x2 >= wall.a.x &&
      y1 + STEP <= wall.a.y &&
      y2 + STEP >= wall.a.y
    )
  }

  private moveCamera(dir: Direction) {
    const { x: x1, y: y1 } = this.hero.getCoords()
    const { x: x2, y: y2 } = this.hero.getBottomRightCoords()
    let translatedX = this.layers[1].getTransform().e / 2
    let translatedY = this.layers[1].getTransform().f / 2
    let mx1 = 0 - translatedX
    let my1 = 0 - translatedY
    let mx2 = CANVAS_WIDTH - translatedX + OFFSET_X
    let my2 = CANVAS_HEIGHT - translatedY + OFFSET_Y

    switch (dir) {
      case Direction.left:
        if (x1 < CAMERA_BORDER_X - translatedX) {
          this.layers[1].clearRect(mx1, my1, mx2, my2)
          this.layers[1].translate(translatedX < 0 ? STEP : 0, 0)
          this.maze.drawWalls(this.layers[1])
        }
        break
      case Direction.right:
        if (x2 > CANVAS_WIDTH - translatedX - CAMERA_BORDER_X) {
          this.layers[1].clearRect(mx1, my1, mx2, my2)
          this.layers[1].translate(-translatedX > RIGHT_BORDER ? 0 : -STEP, 0)
          this.maze.drawWalls(this.layers[1])
        }
        break
      case Direction.up:
        if (y1 < CAMERA_BORDER_Y - translatedY) {
          this.layers[1].clearRect(mx1, my1, mx2, my2)
          this.layers[1].translate(0, translatedY < 0 ? STEP : 0)
          this.maze.drawWalls(this.layers[1])
        }
        break
      case Direction.down:
        if (y2 > CANVAS_HEIGHT - translatedY - CAMERA_BORDER_Y) {
          this.layers[1].clearRect(mx1, my1, mx2, my2)
          this.layers[1].translate(0, -translatedY > BOTTOM_BORDER ? 0 : -STEP)
          this.maze.drawWalls(this.layers[1])
        }
        break
    }
  }

  private move = () => {
    // const walls = this.maze.getWalls()
    const { x: x1, y: y1 } = this.hero.getCoords()
    const { x: x2, y: y2 } = this.hero.getBottomRightCoords()
    const rooms = this.maze.getRooms()
    const cr = this.hero.getCurrentRoom()
    const room = rooms.find(
      room => cr[0] === room.name[0] && cr[1] === room.name[1]
    )
    if (this.keys[ArrowKeys.ArrowRight]) {
      if (x2 + STEP < room.b.x) {
        this.hero.clear(this.layers[1])
        this.hero.move(Direction.right)
        this.moveCamera(Direction.right)
        this.hero.render(this.layers[1])
      } else if (room.ailes[Direction.right]) {
        this.hero.setCurrentRoom([cr[0] + 1, cr[1]])
        console.log('you are in the room ' + (cr[0] + 1) + ',' + cr[1])
      }
    }
    if (this.keys[ArrowKeys.ArrowLeft]) {
      if (x1 - STEP > room.a.x) {
        this.hero.clear(this.layers[1])
        this.hero.move(Direction.left)
        this.moveCamera(Direction.left)
        this.hero.render(this.layers[1])
      } else if (room.ailes[Direction.left]) {
        this.hero.setCurrentRoom([cr[0] - 1, cr[1]])
        console.log('you are in the room ' + (cr[0] - 1) + ',' + cr[1])
      }
    }
    if (this.keys[ArrowKeys.ArrowDown]) {
      if (y2 + STEP < room.b.y) {
        this.hero.clear(this.layers[1])
        this.hero.move(Direction.down)
        this.moveCamera(Direction.down)
        this.hero.render(this.layers[1])
      } else if (room.ailes[Direction.down]) {
        this.hero.setCurrentRoom([cr[0], cr[1] + 1])
        console.log('you are in the room ' + cr[0] + ',' + (cr[1] + 1))
      }
    }
    if (this.keys[ArrowKeys.ArrowUp]) {
      if (y1 - STEP > room.a.y) {
        this.hero.clear(this.layers[1])
        this.hero.move(Direction.up)
        this.moveCamera(Direction.up)
        this.hero.render(this.layers[1])
      } else if (room.ailes[Direction.up]) {
        this.hero.setCurrentRoom([cr[0], cr[1] - 1])
        console.log('you are in the room ' + cr[0] + ',' + (cr[1] - 1))
      }
    }

    this.updateFrame()

    requestAnimationFrame(this.move)
  }

  private updateFrame() {
    this.animCtrl.now = Date.now()
    this.animCtrl.elapsed = this.animCtrl.now - this.animCtrl.then
    if (this.animCtrl.elapsed > FPS_INTERVAL) {
      // adjust fpsInterval not being a multiple of RAF's interval (16.7ms)
      this.animCtrl.then =
        this.animCtrl.now - (this.animCtrl.elapsed % FPS_INTERVAL)
      this.hero.updateFrame()
    }
  }

  private startAnimationLoop() {
    this.animCtrl.then = Date.now()
    requestAnimationFrame(this.move)
  }

  addLayer(canvasId: string) {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    canvas.id = canvasId
    document.body.appendChild(canvas)

    // retina adjustments
    canvas.width = CANVAS_WIDTH * 2
    canvas.height = CANVAS_HEIGHT * 2
    canvas.style.width = `${CANVAS_WIDTH}px`
    canvas.style.height = `${CANVAS_HEIGHT}px`
    ctx.scale(RATIO, RATIO)
    ctx.translate(OFFSET_X, OFFSET_Y)

    this.layers.push(ctx)
  }

  addMaze(maze: Maze) {
    this.maze = maze
  }

  addHero(hero: Hero) {
    this.hero = hero
  }

  async render() {
    this.addLayer('ground')
    this.addLayer('walls-and-hero')
    const heroImg = await loadImage('src/assets/hero/regularBig.png')
    const groundImg = await loadImage('src/assets/ground/ground2.png')
    this.addMaze(
      new Maze(ROOMS_HORIZONTAL, ROOMS_VERTICAL, {
        rw: ROOM_WIDTH,
        d: WALL_DEPTH,
        groundImg,
      })
    )
    this.addHero(new Hero(heroImg, { x: 65, y: 65 }))
    this.maze.drawGround(this.layers[0])
    this.maze.drawWalls(this.layers[1])
    this.hero.render(this.layers[1])
    this.hero.setCurrentRoom([0, 0])
    this.startAnimationLoop()
  }
}
