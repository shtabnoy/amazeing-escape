export const CANVAS_WIDTH = window.innerWidth
export const CANVAS_HEIGHT = window.innerHeight
export const RATIO = window.devicePixelRatio
export const OFFSET_X = 0
export const OFFSET_Y = 0

export const ROOMS_HORIZONTAL = 4
export const ROOMS_VERTICAL = 4
export const ROOM_WIDTH = 256
export const CZ = 64

export const FPS_INTERVAL = 1000 / 5.33 // 160 (x2 - two steps in a second) beats per minute
export const CAMERA_BORDER_X = 200
export const CAMERA_BORDER_Y = 200
// TODO: CZ is WALL_DEPTH. Do these two borders need it???
export const BOTTOM_BORDER = ROOMS_VERTICAL * ROOM_WIDTH + CZ - CANVAS_HEIGHT
export const RIGHT_BORDER = ROOMS_HORIZONTAL * ROOM_WIDTH + CZ - CANVAS_WIDTH
export const HERO_WIDTH = 38
export const HERO_HEIGHT = 87
export const STEP = 4
