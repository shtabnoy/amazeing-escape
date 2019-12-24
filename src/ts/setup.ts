import Renderer from './Renderer'
import AssetLoader from './AssetLoader'
import '../styles/global.scss'

document.addEventListener('DOMContentLoaded', () => {
  const newGameBtn = document.getElementById('new')
  const resumeGameBtn = document.getElementById('resume')
  newGameBtn.addEventListener('click', async () => {
    // preload all the images
    const al = new AssetLoader()
    await al.loagImages()

    // render the canvas
    const r = new Renderer()
    r.setAssetLoader(al)
    r.render()

    // load the background audio
    // const audio = new Audio('src/assets/audio/game_music_2.mp3')
    // audio.loop = true
    // const audioPromise = audio.play()
    // if (audioPromise !== undefined) {
    //   audioPromise
    //     .then(_ => {
    //       console.log('Autoplay started!')
    //     })
    //     .catch(error => {
    //       console.log('Autoplay was rejected. Show a button')
    //     })
    // }
  })

  resumeGameBtn.addEventListener('click', async () => {
    const canvases = document.querySelectorAll('canvas')
    canvases.forEach(canvas => {
      canvas.style.display = 'block'
    })
    newGameBtn.style.display = 'block'
    resumeGameBtn.style.display = 'none'
  })

  document.addEventListener('keyup', e => {
    if (e.key === 'Escape') {
      const canvases = document.querySelectorAll('canvas')
      canvases.forEach(canvas => {
        canvas.style.display = 'none'
      })
      newGameBtn.style.display = 'none'
      resumeGameBtn.style.display = 'block'
    }
  })
})
