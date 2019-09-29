export const CANVAS_WIDTH = window.innerWidth
export const CANVAS_HEIGHT = window.innerHeight
export const OFFSET_X = 10
export const OFFSET_Y = 10

export const ROOMS_HORIZONTAL = 4
export const ROOMS_VERTICAL = 4
export const ROOM_WIDTH = 300
export const WALL_DEPTH = 60

export const FPS_INTERVAL = 1000 / 5.33 // 160 beats per minute
export const CAMERA_BORDER_X = 200
export const CAMERA_BORDER_Y = 200
export const BOTTOM_BORDER =
  ROOMS_VERTICAL * ROOM_WIDTH + WALL_DEPTH - CANVAS_HEIGHT
export const RIGHT_BORDER =
  ROOMS_HORIZONTAL * ROOM_WIDTH + WALL_DEPTH - CANVAS_WIDTH
export const SPRITE_SIZE = 48
// export const SPRITE_HEIGHT = 48
export const STEP = 10
