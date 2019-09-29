import Renderer from './Renderer'
import '../styles/global.scss'

document.addEventListener('DOMContentLoaded', async () => {
  const r = new Renderer()
  r.render()

  // background audio
  // const audio = new Audio('src/assets/audio/footstep1.mp3')
  // audio.loop = true
  // audio.playbackRate = 1.3
  // // audio.play()
})
