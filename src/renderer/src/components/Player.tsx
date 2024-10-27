import React from 'react'
import music_icon from '../assets/music.svg'
import '../assets/Components/Player.css'

function Player(props: { visible: boolean }): React.JSX.Element {
  return (
    <div className={`playerContainer ${props.visible ? 'visible' : 'invisible'}`}>
      <img src={music_icon} alt={'music icon'} />
      <div className={'playerControllerContainer'}>
        <div>
          <input type={'range'} />
        </div>
        <div className={'playerController'}>
          <button>{'<-'}</button>
          <button>{'P'}</button>
          <button>{'->'}</button>
        </div>
      </div>
    </div>
  )
}

export default Player
