import Maze, { Wall } from './Maze'
import Hero from './Hero'
import { Keys, ArrowKeys, AnimationControls } from './types'
import {
  FPS_INTERVAL,
  CAMERA_BORDER_X,
  CAMERA_BORDER_Y,
  STEP,
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  OFFSET_X,
  OFFSET_Y,
  ROOMS_HORIZONTAL,
  ROOMS_VERTICAL,
  ROOM_WIDTH,
} from './constants'
import { Direction } from './MazeGraph'
import AssetLoader from './AssetLoader'

export default class Renderer {
  private layers: {
    [name: string]: CanvasRenderingContext2D
  }
  private maze: Maze
  private hero: Hero
  private animCtrl: AnimationControls = {
    ref: null,
    now: 0,
    then: 0,
    elapsed: 0,
  }
  private portalAnim: AnimationControls = {
    ref: null,
    now: 0,
    then: 0,
    elapsed: 0,
  }
  private exitAnim: AnimationControls = {
    ref: null,
    now: 0,
    then: 0,
    elapsed: 0,
  }
  private portaFrame: number
  private maxPortalFrame: number
  private keys: Keys = {
    ArrowRight: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowUp: false,
  }
  private assetLoader: AssetLoader

  constructor() {
    document.addEventListener('keydown', e => {
      if (e.key in ArrowKeys) this.keys[e.key as ArrowKeys] = true
    })
    document.addEventListener('keyup', e => {
      if (e.key in ArrowKeys) this.keys[e.key as ArrowKeys] = false
    })
    this.layers = {}
    this.portaFrame = 0
    this.maxPortalFrame = 13
  }

  private collisionRight = (
    walls: Wall[],
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    withCZ?: boolean
  ) => {
    return walls.some(
      (wall: Wall) =>
        x1 + STEP <= wall.coords[0][0] &&
        x2 + STEP >= wall.coords[0][0] &&
        y1 <= wall.coords[1][1] - (withCZ ? wall.collisionZone.down : 0) &&
        y2 >= wall.coords[0][1] + (withCZ ? wall.collisionZone.up : 0)
    )
  }

  private collisionLeft = (
    walls: Wall[],
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    withCZ?: boolean
  ) => {
    return walls.some(
      (wall: Wall) =>
        x1 - STEP <= wall.coords[1][0] &&
        x2 - STEP >= wall.coords[1][0] &&
        y1 <= wall.coords[1][1] - (withCZ ? wall.collisionZone.down : 0) &&
        y2 >= wall.coords[0][1] + (withCZ ? wall.collisionZone.up : 0)
    )
  }

  private collisionUp = (
    walls: Wall[],
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    withCZ?: boolean
  ) => {
    return walls.some(
      (wall: Wall) =>
        x1 <= wall.coords[1][0] &&
        x2 >= wall.coords[0][0] &&
        y1 - STEP <=
          wall.coords[1][1] - (withCZ ? wall.collisionZone.down : 0) &&
        y2 - STEP >= wall.coords[1][1] - (withCZ ? wall.collisionZone.down : 0)
    )
  }

  private collisionDown = (
    walls: Wall[],
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    withCZ?: boolean
  ) => {
    return walls.some(
      (wall: Wall) =>
        x1 <= wall.coords[1][0] &&
        x2 >= wall.coords[0][0] &&
        y1 + STEP <= wall.coords[0][1] + (withCZ ? wall.collisionZone.up : 0) &&
        y2 + STEP >= wall.coords[0][1] + (withCZ ? wall.collisionZone.up : 0)
    )
  }

  private moveCamera(dir: Direction) {
    const { x: x1, y: y1 } = this.hero.getCoords()
    const { x: x2, y: y2 } = this.hero.getBottomRightCoords()
    let translatedX = this.layers['walls'].getTransform().e
    let translatedY = this.layers['walls'].getTransform().f

    switch (dir) {
      case Direction.left:
        if (x1 < CAMERA_BORDER_X - translatedX) {
          this.maze.clearCanvas(this.layers['walls'])
          this.maze.moveCanvas(this.layers['walls'], Direction.left)
          this.maze.drawWalls(this.layers['walls'])

          this.maze.clearCanvas(this.layers['ground'])
          this.maze.moveCanvas(this.layers['ground'], Direction.left)
          this.maze.drawGround(this.layers['ground'])

          this.maze.moveCanvas(this.layers['hero'], Direction.left)
        }
        break
      case Direction.right:
        if (x2 > CANVAS_WIDTH - translatedX - CAMERA_BORDER_X) {
          this.maze.clearCanvas(this.layers['walls'])
          this.maze.moveCanvas(this.layers['walls'], Direction.right)
          this.maze.drawWalls(this.layers['walls'])

          this.maze.clearCanvas(this.layers['ground'])
          this.maze.moveCanvas(this.layers['ground'], Direction.right)
          this.maze.drawGround(this.layers['ground'])

          this.maze.moveCanvas(this.layers['hero'], Direction.right)
        }
        break
      case Direction.up:
        if (y1 < CAMERA_BORDER_Y - translatedY) {
          this.maze.clearCanvas(this.layers['walls'])
          this.maze.moveCanvas(this.layers['walls'], Direction.up)
          this.maze.drawWalls(this.layers['walls'])

          this.maze.clearCanvas(this.layers['ground'])
          this.maze.moveCanvas(this.layers['ground'], Direction.up)
          this.maze.drawGround(this.layers['ground'])

          this.maze.moveCanvas(this.layers['hero'], Direction.up)
        }
        break
      case Direction.down:
        if (y2 > CANVAS_HEIGHT - translatedY - CAMERA_BORDER_Y) {
          this.maze.clearCanvas(this.layers['walls'])
          this.maze.moveCanvas(this.layers['walls'], Direction.down)
          this.maze.drawWalls(this.layers['walls'])

          this.maze.clearCanvas(this.layers['ground'])
          this.maze.moveCanvas(this.layers['ground'], Direction.down)
          this.maze.drawGround(this.layers['ground'])

          this.maze.moveCanvas(this.layers['hero'], Direction.down)
        }
        break
    }

    this.maze.drawPortals(this.layers['ground'])
  }

  private move = () => {
    const { x: x1, y: y1 } = this.hero.getCoords()
    const { x: x2, y: y2 } = this.hero.getBottomRightCoords()
    const { x1: ex1, x2: ex2, y1: ey1, y2: ey2 } = this.maze.getExit()

    const walls = Object.values(this.maze.getWalls())

    if (this.keys[ArrowKeys.ArrowRight]) {
      if (
        walls.some(
          (wall: Wall) =>
            x1 + STEP <= wall.coords[0][0] &&
            x2 + STEP >= wall.coords[0][0] &&
            y2 >= wall.coords[0][1] &&
            y2 <= wall.coords[0][1] + wall.collisionZone.up
        )
      ) {
        document.getElementById('walls').style.zIndex = '1'
      }
      if (
        walls.some(
          (wall: Wall) =>
            x1 + STEP <= wall.coords[0][0] &&
            x2 + STEP >= wall.coords[0][0] &&
            y1 >= wall.coords[1][1] - wall.collisionZone.down &&
            y1 <= wall.coords[1][1]
        )
      ) {
        document.getElementById('walls').style.zIndex = '0'
      }
      if (!this.collisionRight(walls, x1, y1, x2, y2, true)) {
        this.hero.clear(this.layers['hero'])
        this.hero.move(Direction.right)
        this.moveCamera(Direction.right)
        this.hero.render(this.layers['hero'])
      }
    }

    if (this.keys[ArrowKeys.ArrowLeft]) {
      if (
        walls.some(
          (wall: Wall) =>
            x1 - STEP <= wall.coords[1][0] &&
            x2 - STEP >= wall.coords[1][0] &&
            y2 >= wall.coords[0][1] &&
            y2 <= wall.coords[0][1] + wall.collisionZone.up
        )
      ) {
        document.getElementById('walls').style.zIndex = '1'
      }
      if (
        walls.some(
          (wall: Wall) =>
            x1 - STEP <= wall.coords[1][0] &&
            x2 - STEP >= wall.coords[1][0] &&
            y1 >= wall.coords[1][1] - wall.collisionZone.down &&
            y1 <= wall.coords[1][1]
        )
      ) {
        document.getElementById('walls').style.zIndex = '0'
      }
      if (!this.collisionLeft(walls, x1, y1, x2, y2, true)) {
        this.hero.clear(this.layers['hero'])
        this.hero.move(Direction.left)
        this.moveCamera(Direction.left)
        this.hero.render(this.layers['hero'])
      }
    }

    if (this.keys[ArrowKeys.ArrowDown]) {
      if (this.collisionDown(walls, x1, y1, x2, y2)) {
        document.getElementById('walls').style.zIndex = '1'
      }
      if (!this.collisionDown(walls, x1, y1, x2, y2, true)) {
        this.hero.clear(this.layers['hero'])
        this.hero.move(Direction.down)
        this.moveCamera(Direction.down)
        this.hero.render(this.layers['hero'])
      }
    }

    if (this.keys[ArrowKeys.ArrowUp]) {
      if (this.collisionUp(walls, x1, y1, x2, y2)) {
        document.getElementById('walls').style.zIndex = '0'
      }
      if (!this.collisionUp(walls, x1, y1, x2, y2, true)) {
        this.hero.clear(this.layers['hero'])
        this.hero.move(Direction.up)
        this.moveCamera(Direction.up)
        this.hero.render(this.layers['hero'])
      }
    }

    // update character animation only when any key is pressed
    if (Object.values(this.keys).some(key => key)) {
      this.updateFrame()
    }

    // check for exit
    if (
      (x2 >= ex1 && x1 <= ex1 && y1 <= ey2 && y2 >= ey1) ||
      (x1 <= ex2 && x2 >= ex2 && y1 <= ey2 && y2 >= ey1) ||
      (y2 >= ey1 && y1 <= ey1 && x1 <= ex2 && x2 >= ex1) ||
      (y1 <= ey1 && y2 >= ey2 && x1 <= ex2 && x2 >= ex1)
    ) {
      cancelAnimationFrame(this.animCtrl.ref)
      requestAnimationFrame(this.updateExitFrame)
      return
    }

    this.animCtrl.ref = requestAnimationFrame(this.move)
  }

  private updateFrame = () => {
    this.animCtrl.now = Date.now()
    this.animCtrl.elapsed = this.animCtrl.now - this.animCtrl.then
    if (this.animCtrl.elapsed > FPS_INTERVAL) {
      // adjust fpsInterval not being a multiple of RAF's interval (16.7ms)
      this.animCtrl.then =
        this.animCtrl.now - (this.animCtrl.elapsed % FPS_INTERVAL)
      this.hero.updateFrame()
    }
  }

  private opacity: number = 100
  private updateExitFrame = () => {
    this.exitAnim.now = Date.now()
    this.exitAnim.elapsed = this.exitAnim.now - this.exitAnim.then
    if (this.exitAnim.elapsed > 80) {
      this.exitAnim.then = this.exitAnim.now - (this.exitAnim.elapsed % 80)

      this.opacity -= 5
      this.hero.clear(this.layers['hero'])
      this.layers['hero'].filter = `opacity(${this.opacity}%)`
      this.hero.render(this.layers['hero'])
    }
    this.exitAnim.ref = requestAnimationFrame(this.updateExitFrame)
    if (this.opacity <= 0) {
      console.log('FINALE')
      cancelAnimationFrame(this.exitAnim.ref)
    }
  }

  private updatePortalFrame = () => {
    const frameWidth = 54
    const frameHeight = 112
    const x = ROOM_WIDTH / 2 + 4
    const y = ROOM_WIDTH / 2 - 6
    this.portalAnim.now = Date.now()
    this.portalAnim.elapsed = this.portalAnim.now - this.portalAnim.then
    if (
      this.portalAnim.elapsed > 80 &&
      this.portaFrame <= this.maxPortalFrame
    ) {
      this.portalAnim.then =
        this.portalAnim.now - (this.portalAnim.elapsed % 80)
      this.layers['hero'].clearRect(x, y, frameWidth, frameHeight)
      this.layers['hero'].drawImage(
        this.assetLoader.getImage('intro'),
        this.portaFrame * frameWidth,
        0,
        frameWidth,
        frameHeight,
        x,
        y,
        frameWidth,
        frameHeight
      )
      this.portaFrame += 1
    }
    this.portalAnim.ref = requestAnimationFrame(this.updatePortalFrame)
    if (this.portaFrame > this.maxPortalFrame) {
      this.layers['hero'].clearRect(x, y, frameWidth, frameHeight)
      this.maze.drawPortals(this.layers['ground'])
      this.hero.render(this.layers['hero'])
      cancelAnimationFrame(this.portalAnim.ref)
      this.animCtrl.ref = requestAnimationFrame(this.move)
    }
  }

  private startAnimationLoop = () => {
    this.animCtrl.then = Date.now()
    requestAnimationFrame(this.updatePortalFrame)
  }

  addLayer = (canvasId: string) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    canvas.id = canvasId
    document.body.appendChild(canvas)

    canvas.width = CANVAS_WIDTH
    canvas.height = CANVAS_HEIGHT
    canvas.style.width = `${CANVAS_WIDTH}px`
    canvas.style.height = `${CANVAS_HEIGHT}px`
    // // retina adjustments
    // ctx.scale(RATIO, RATIO)
    // canvas.width = CANVAS_WIDTH
    // canvas.height = CANVAS_HEIGHT
    ctx.translate(OFFSET_X, OFFSET_Y)

    this.layers[canvasId] = ctx
  }

  addMaze(maze: Maze) {
    this.maze = maze
  }

  addHero(hero: Hero) {
    this.hero = hero
  }

  setAssetLoader(assetLoader: AssetLoader) {
    this.assetLoader = assetLoader
  }

  async render() {
    this.addLayer('ground')
    this.addLayer('walls')
    this.addLayer('hero')

    this.addMaze(
      new Maze(ROOMS_HORIZONTAL, ROOMS_VERTICAL, {
        images: {
          walls: this.assetLoader.getImage('walls'),
          ground: this.assetLoader.getImage('ground'),
          portal: this.assetLoader.getImage('portal'),
        },
      })
    )
    this.addHero(
      new Hero(this.assetLoader.getImage('hero'), {
        x: ROOM_WIDTH / 2 + 8,
        y: ROOM_WIDTH / 2 + 14,
      })
    )
    this.maze.drawGround(this.layers['ground'])
    this.maze.drawWalls(this.layers['walls'])

    this.startAnimationLoop()
  }
}
