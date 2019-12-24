import Renderer from './Renderer'
import AssetLoader from './AssetLoader'
import '../styles/global.scss'

document.addEventListener('DOMContentLoaded', () => {
  const startGameBtn = document.getElementById('start-game')
  startGameBtn.addEventListener('click', async () => {
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
})
