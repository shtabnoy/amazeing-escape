import Renderer from './Renderer'
import AssetLoader from './AssetLoader'
import '../styles/global.scss'

document.addEventListener('DOMContentLoaded', async () => {
  const al = new AssetLoader()
  await al.loagImages()

  const r = new Renderer()
  r.setAssetLoader(al)
  r.render()
  // background audio
  // const audio = new Audio('src/assets/audio/footstep1.mp3')
  // audio.loop = true
  // audio.playbackRate = 1.3
  // // audio.play()
})
