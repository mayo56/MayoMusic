import React from 'react'
import electron_logo from '../assets/electron.svg'
import player_icon from '../assets/play.svg'
import '../assets/Components/HomeLeftBar.css'
import { useNavigate } from 'react-router-dom'
import Player from '@renderer/components/Player'

function HomeLeftBar(): React.JSX.Element {
  const nav = useNavigate()
  const gotoParams = (): void => nav('/parameters')

  // Player options
  const [playerVisible, setPlayerVisible] = React.useState<boolean>(false)
  const showPlayer = (): void => {
    return setPlayerVisible((val): boolean => {
      console.warn(val, 'to', !val)
      return !val
    })
  }
  return (
    <div className={'homeLeftBarContainer'}>
      {/*Player*/}
      <div className={'playerButtonContainer'}>
        <img onClick={showPlayer} width={32} src={player_icon} alt={'player icon'} />
        <Player visible={playerVisible} />
      </div>
      <div className={'listOfPinsAlbums'}>
        {/* Liste des musiques pins */}
        <p>T</p>
        <p>T</p>
        <p>T</p>
        <p>T</p>
        <p>T</p>
        <p>T</p>
        <p>T</p>
        <p>T</p>
        <p>T</p>
        <p>T</p>
        <p>T</p>
        <p>T</p>
        <p>T</p>
        <p>T</p>
        <p>T</p>
        <p>T</p>
        <p>T</p>
        <p>T</p>
        <p>T</p>
        <p>T</p>
        <p>T</p>
        <p>T</p>
        <p>T</p>
        <p>T</p>
        <p>T</p>
        <p>T</p>
        <p>T</p>
        <p>T</p>
        <p>T</p>
        <p>T</p>
        <p>T</p>
        <p>T</p>
        <p>T</p>
        <p>T</p>
        <p>T</p>
        <p>T</p>
        <p>T</p>
        <p>T</p>
        <p>T</p>
        <p>T</p>
        <p>T</p>
        <p>T</p>
        <p>T</p>
        <p>T</p>
        <p>T</p>
        <p>T</p>
        <p>T</p>
        <p>T</p>
        <p>T</p>
        <p>T</p>
        <p>T</p>
        <p>T</p>
      </div>
      <div className={'parameters'}>
        {/* Parameters */}
        <img src={electron_logo} onClick={gotoParams} alt={'home_parameters_icon'} />
      </div>
    </div>
  )
}

export default HomeLeftBar
