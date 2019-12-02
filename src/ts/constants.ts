export const CANVAS_WIDTH = window.innerWidth
export const CANVAS_HEIGHT = window.innerHeight
export const RATIO = window.devicePixelRatio
export const OFFSET_X = 0
export const OFFSET_Y = 0

export const ROOMS_HORIZONTAL = 10
export const ROOMS_VERTICAL = 10
export const ROOM_WIDTH = 256
export const WALL_DEPTH = 64

export const FPS_INTERVAL = 1000 / 5.33 // 160 (x2 - two steps in a second) beats per minute
export const CAMERA_BORDER_X = 200
export const CAMERA_BORDER_Y = 200
export const BOTTOM_BORDER =
  ROOMS_VERTICAL * ROOM_WIDTH + WALL_DEPTH - CANVAS_HEIGHT
export const RIGHT_BORDER =
  ROOMS_HORIZONTAL * ROOM_WIDTH + WALL_DEPTH - CANVAS_WIDTH
export const SPRITE_SIZE = 96
export const HERO_SIZE = 96
// export const HERO_OFFSET = 33
export const HERO_WIDTH = 38
export const HERO_HEIGHT = 87
// export const HERO_OFFSET_LR = 33
// export const HERO_OFFSET_UD = 27
// export const HERO_WIDTH_LR = 26
// export const HERO_WIDTH_UD = 39
export const STEP = 4
