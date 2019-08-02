import React, { Component } from 'react'
import Instrument from './instrument'


class AudioController extends Component {
  constructor(props) {
    super(props)
    this.state = {
      pressed: [],
      playing: [], //stored as keyCode

    }
    this.audioRefs = new Map()
    this.setAudioRef = (element, key) => {
      this.audioRefs.set(key, element)
    }
  }
  componentDidMount() {
    document.addEventListener('keyup', (e) => this.handleKeyup(e))
    document.addEventListener('transitionend', (e) => this.removeTransition(e))
  }

  componentWillUnmount() {
    document.removeEventListener('keyup')
    document.removeEventListener('transitionend')
  }

  instruments = [
    { keyCode: 68, keyName: 'Dank', soundPath: require('./sounds/dank.ogg') },
    { keyCode: 73, keyName: 'Ironic', soundPath: require('./sounds/ironic.ogg') },
    { keyCode: 77, keyName: 'Memes', soundPath: require('./sounds/memes.ogg') },
    { keyCode: 88, keyName: 'Maymays', soundPath: require('./sounds/maymays.ogg') },
  ]

  soundFiles = [
    { key: 'kira', soundPath: require('./sounds/kira.mp3') },
    { key: 'reee', soundPath: require('./sounds/reee.mp3') },
    { key: 'trump', soundPath: require('./sounds/trump.mp3') },
    { key: 'vaporwave', soundPath: require('./sounds/vaporwave.mp3') },
  ]

  checkKeyCode(keyCode) {
    return this.instruments.map(inst => inst.keyCode).includes(keyCode)
  }

  playSound(keyCode) {
    if (this.checkKeyCode(keyCode)) {
      this.playMusic(keyCode)
    }
  }

  async playMusic(key) { //pre: there is such audio in audioRefs
    try {
      const audio = this.audioRefs.get(key)
      audio.currentTime = 0 // rewind to start so we can spam keys
      await audio.play();
    } catch (err) { console.log(err) }
  }

  stopMusic() {
    for (const [key, audio] of this.audioRefs) {
      audio.pause()
    }
  }

  handleKeyup({ key, keyCode }) {
    this.setState(({ pressed, playing }) => {
      let { longestCodeLength } = this
      let updatedPressed = [...pressed, key].slice(-longestCodeLength - 1, pressed.length + longestCodeLength - 1)
      return { pressed: updatedPressed, playing: [...playing, keyCode] }
    })
    this.checkSeq()
    this.playSound(keyCode)
  }

  removeTransition({ target, propertyName }) {
    if (propertyName === 'transform') {
      this.setState(({ playing }) => {
        playing = playing.filter(elm => elm !== Number(target.id))
        return { playing }
      })
    }
  }

  secretEffects = new Map()
    .set('shutthefuckup', () => this.stopMusic())
    .set('trumpmeup', () => this.playMusic('trump'))
    .set('aesthetic', () => this.playMusic('vaporwave'))
    .set('bitesthedust', () => this.playMusic('kira'))
    .set('normiesgetout', () => this.playMusic('reee'))

  longestCodeLength = [...this.secretEffects.keys()].reduce((a, b) => a.length > b.length ? a : b).length


  checkSeq() {
    const inputs = this.state.pressed.join("")
    for (let [secretCode, play] of this.secretEffects) {
      if (inputs.includes(secretCode)) {
        play()
      }
    }
  }

  render() {
    return (
      <div>
        <div className='keys'>
          {this.instruments.map(inst => (
            <Instrument key={inst.keyCode} keyCode={inst.keyCode} instrumentName={inst.keyName} playing={this.state.playing.includes(inst.keyCode)} />
          ))}
        </div>

        {this.instruments.map(inst => (
          <audio key={inst.keyCode} src={inst.soundPath} type="audio/ogg" ref={(e) => this.setAudioRef(e, inst.keyCode)} />
        ))}

        {this.soundFiles.map(s => (
          <audio key={s.key} src={s.soundPath} ref={(e) => this.setAudioRef(e, s.key)} />
        ))}

      </div>
    )
  }

}

export default AudioController