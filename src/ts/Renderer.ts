import Maze, { Walls, Wall } from './Maze'
import Hero from './Hero'
import { Keys, ArrowKeys, AnimationControls } from './types'
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
} from './constants'
import { Direction } from './MazeGraph'
import AssetLoader from './AssetLoader'

type P = [number, number]
type W = [P, P]

export default class Renderer {
  private layers: {
    [name: string]: CanvasRenderingContext2D
  }
  private activeWallsLayer: string
  private maze: Maze
  private hero: Hero
  private animCtrl: AnimationControls = {
    now: 0,
    then: 0,
    elapsed: 0,
  }
  private portalAnim: AnimationControls = {
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
    y2: number
  ) => {
    return walls.some(
      (wall: Wall) =>
        x1 + STEP <= wall.coords[0][0] &&
        x2 + STEP >= wall.coords[0][0] &&
        y1 <= wall.coords[1][1] - wall.collisionZone.down &&
        y2 >= wall.coords[0][1] + wall.collisionZone.up
    )
  }

  private collisionLeft = (
    walls: Wall[],
    x1: number,
    y1: number,
    x2: number,
    y2: number
  ) => {
    return walls.some(
      (wall: Wall) =>
        x1 - STEP <= wall.coords[1][0] &&
        x2 - STEP >= wall.coords[1][0] &&
        y1 <= wall.coords[1][1] - wall.collisionZone.down &&
        y2 >= wall.coords[0][1] + wall.collisionZone.up
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
    let translatedX = this.layers['walls-below'].getTransform().e
    let translatedY = this.layers['walls-below'].getTransform().f
    let mx1 = 0 - translatedX
    let my1 = 0 - translatedY
    let mx2 = CANVAS_WIDTH - translatedX + OFFSET_X
    let my2 = CANVAS_HEIGHT - translatedY + OFFSET_Y

    switch (dir) {
      case Direction.left:
        if (x1 < CAMERA_BORDER_X - translatedX) {
          if (this.activeWallsLayer === 'walls-below') {
            this.maze.clearCanvas(this.layers['walls-below'])
            this.maze.moveCanvas(this.layers['walls-below'], Direction.left)
            this.maze.moveCanvas(this.layers['walls-above'], Direction.left)
            this.maze.drawWalls(this.layers['walls-below'])
          } else {
            this.maze.clearCanvas(this.layers['walls-above'])
            this.maze.moveCanvas(this.layers['walls-below'], Direction.left)
            this.maze.moveCanvas(this.layers['walls-above'], Direction.left)
            this.maze.drawWalls(this.layers['walls-above'])
          }

          this.maze.clearCanvas(this.layers['ground'])
          this.maze.moveCanvas(this.layers['ground'], Direction.left)
          this.maze.drawGround(this.layers['ground'])

          this.maze.moveCanvas(this.layers['hero'], Direction.left)
        }
        break
      case Direction.right:
        if (x2 > CANVAS_WIDTH - translatedX - CAMERA_BORDER_X) {
          if (this.activeWallsLayer === 'walls-below') {
            this.maze.clearCanvas(this.layers['walls-below'])
            this.maze.moveCanvas(this.layers['walls-below'], Direction.right)
            this.maze.moveCanvas(this.layers['walls-above'], Direction.right)
            this.maze.drawWalls(this.layers['walls-below'])
          } else {
            this.maze.clearCanvas(this.layers['walls-above'])
            this.maze.moveCanvas(this.layers['walls-below'], Direction.left)
            this.maze.moveCanvas(this.layers['walls-above'], Direction.right)
            this.maze.drawWalls(this.layers['walls-above'])
          }

          this.maze.clearCanvas(this.layers['ground'])
          this.maze.moveCanvas(this.layers['ground'], Direction.right)
          this.maze.drawGround(this.layers['ground'])

          this.maze.moveCanvas(this.layers['hero'], Direction.right)
        }
        break
      case Direction.up:
        if (y1 < CAMERA_BORDER_Y - translatedY) {
          if (this.activeWallsLayer === 'walls-below') {
            this.maze.clearCanvas(this.layers['walls-below'])
            this.maze.moveCanvas(this.layers['walls-below'], Direction.up)
            this.maze.moveCanvas(this.layers['walls-above'], Direction.up)
            this.maze.drawWalls(this.layers['walls-below'])
          } else {
            this.maze.clearCanvas(this.layers['walls-above'])
            this.maze.moveCanvas(this.layers['walls-below'], Direction.up)
            this.maze.moveCanvas(this.layers['walls-above'], Direction.up)
            this.maze.drawWalls(this.layers['walls-above'])
          }

          this.maze.clearCanvas(this.layers['ground'])
          this.maze.moveCanvas(this.layers['ground'], Direction.up)
          this.maze.drawGround(this.layers['ground'])

          this.maze.moveCanvas(this.layers['hero'], Direction.up)
        }
        break
      case Direction.down:
        if (y2 > CANVAS_HEIGHT - translatedY - CAMERA_BORDER_Y) {
          if (this.activeWallsLayer === 'walls-below') {
            this.maze.clearCanvas(this.layers['walls-below'])
            this.maze.moveCanvas(this.layers['walls-below'], Direction.down)
            this.maze.moveCanvas(this.layers['walls-above'], Direction.down)
            this.maze.drawWalls(this.layers['walls-below'])
          } else {
            this.maze.clearCanvas(this.layers['walls-above'])
            this.maze.moveCanvas(this.layers['walls-below'], Direction.down)
            this.maze.moveCanvas(this.layers['walls-above'], Direction.down)
            this.maze.drawWalls(this.layers['walls-above'])
          }

          this.maze.clearCanvas(this.layers['ground'])
          this.maze.moveCanvas(this.layers['ground'], Direction.down)
          this.maze.drawGround(this.layers['ground'])

          this.maze.moveCanvas(this.layers['hero'], Direction.down)
        }
        break
    }
  }

  private move = () => {
    const { x: x1, y: y1 } = this.hero.getCoords()
    const { x: x2, y: y2 } = this.hero.getBottomRightCoords()

    const walls = Object.values(this.maze.getWalls())

    // TODO: Simplify
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
        this.activeWallsLayer = 'walls-above'
        this.maze.clearCanvas(this.layers['walls-below'])
        this.maze.drawWalls(this.layers['walls-above'])
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
        this.activeWallsLayer = 'walls-below'
        this.maze.clearCanvas(this.layers['walls-above'])
        this.maze.drawWalls(this.layers['walls-below'])
      }
      if (!this.collisionRight(walls, x1, y1, x2, y2)) {
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
        this.activeWallsLayer = 'walls-above'
        this.maze.clearCanvas(this.layers['walls-below'])
        this.maze.drawWalls(this.layers['walls-above'])
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
        this.activeWallsLayer = 'walls-below'
        this.maze.clearCanvas(this.layers['walls-above'])
        this.maze.drawWalls(this.layers['walls-below'])
      }
      if (!this.collisionLeft(walls, x1, y1, x2, y2)) {
        this.hero.clear(this.layers['hero'])
        this.hero.move(Direction.left)
        this.moveCamera(Direction.left)
        this.hero.render(this.layers['hero'])
      }
    }
    if (this.keys[ArrowKeys.ArrowDown]) {
      if (this.collisionDown(walls, x1, y1, x2, y2)) {
        this.activeWallsLayer = 'walls-above'
        this.maze.clearCanvas(this.layers['walls-below'])
        this.maze.drawWalls(this.layers['walls-above'])
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
        this.activeWallsLayer = 'walls-below'
        this.maze.clearCanvas(this.layers['walls-above'])
        this.maze.drawWalls(this.layers['walls-below'])
      }
      if (!this.collisionUp(walls, x1, y1, x2, y2, true)) {
        this.hero.clear(this.layers['hero'])
        this.hero.move(Direction.up)
        this.moveCamera(Direction.up)
        this.hero.render(this.layers['hero'])
      }
    }

    this.updateFrame()
    this.updatePortalFrame()

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

  private updatePortalFrame() {
    // console.log('yeeea')
    const frameWidth = 54
    const frameHeight = 112
    const x = 100
    const y = 90
    this.portalAnim.now = Date.now()
    this.portalAnim.elapsed = this.portalAnim.now - this.portalAnim.then
    if (
      this.portalAnim.elapsed > 80 &&
      this.portaFrame <= this.maxPortalFrame
    ) {
      // adjust fpsInterval not being a multiple of RAF's interval (16.7ms)
      this.portalAnim.then =
        this.portalAnim.now - (this.portalAnim.elapsed % 80)
      this.layers['hero'].drawImage(
        this.assetLoader.getImage('portal'),
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
    this.addLayer('walls-below')
    this.addLayer('hero')
    this.addLayer('walls-above')

    this.addMaze(
      new Maze(ROOMS_HORIZONTAL, ROOMS_VERTICAL, {
        images: {
          walls: this.assetLoader.getImage('walls'),
          ground: this.assetLoader.getImage('ground'),
        },
      })
    )
    this.addHero(new Hero(this.assetLoader.getImage('hero'), { x: 70, y: 140 }))
    this.maze.drawGround(this.layers['ground'])
    this.activeWallsLayer = 'walls-below'
    this.maze.drawWalls(this.layers['walls-below'])
    // this.hero.render(this.layers['hero'])
    // this.hero.setCurrentRoom('0,0')

    this.startAnimationLoop()
  }
}
