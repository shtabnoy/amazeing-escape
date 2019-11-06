export const CANVAS_WIDTH = window.innerWidth
export const CANVAS_HEIGHT = window.innerHeight
export const RATIO = window.devicePixelRatio
export const OFFSET_X = 0
export const OFFSET_Y = 0

export const ROOMS_HORIZONTAL = 3
export const ROOMS_VERTICAL = 3
export const ROOM_WIDTH = 300
export const WALL_DEPTH = 60

export const FPS_INTERVAL = 1000 / 5.33 // 160 (x2 - two steps in a second) beats per minute
export const CAMERA_BORDER_X = 200
export const CAMERA_BORDER_Y = 200
export const BOTTOM_BORDER =
  ROOMS_VERTICAL * ROOM_WIDTH + WALL_DEPTH - CANVAS_HEIGHT
export const RIGHT_BORDER =
  ROOMS_HORIZONTAL * ROOM_WIDTH + WALL_DEPTH - CANVAS_WIDTH
export const SPRITE_SIZE = 96
export const HERO_SIZE = 96
export const STEP = 6
