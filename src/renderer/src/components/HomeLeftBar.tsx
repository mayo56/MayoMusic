import React from 'react'
import electron_logo from '../assets/electron.svg'
import '../assets/Components/HomeLeftBar.css'
import { useNavigate } from 'react-router-dom'


function HomeLeftBar(): React.JSX.Element {
  const nav = useNavigate()
  const gotoParams = (): void => nav('/parameters')

  return (
    <div className={'homeLeftBarContainer'}>
      {/*Player*/}
      <div className={'playerButtonContainer'}></div>
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
