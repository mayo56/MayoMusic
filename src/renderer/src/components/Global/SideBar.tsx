import React from 'react'
import '@renderer/assets/CSS/Global/SideBar.css'
import { useLocation, useNavigate } from 'react-router-dom'

// Icons
import library_icon from '@renderer/assets/Images/radio-svgrepo-com.svg'
import parameters_icon from '@renderer/assets/Images/cog-svgrepo-com.svg'

function SideBar(): React.JSX.Element {
  const nav = useNavigate()

  // CSS pour la localisation (menu)
  const path = useLocation()
  const [menu, setMenu] = React.useState<number>(0)
  React.useEffect(() => {
    if (path.pathname.includes('library')) {
      setMenu(1)
    } else if (path.pathname.includes('settings')) {
      setMenu(2)
    } else {
      setMenu(0)
    }
  }, [path.pathname])
  return (
    <div className={'GlobalLeftBarContainer'}>
      {/*
      Menu de selection de page
      */}
      <div className={'MenuContainer'}>
        <div className={`choice ${menu === 1 ? 'selected' : ''}`} aria-label={'Library'} onClick={() => nav('/library')}>
          <img className={'icon'} src={library_icon} alt={'icon library'} />
        </div>
        <div className={`choice ${menu === 2 ? 'selected' : ''}`} aria-label={'Parameters'} onClick={() => nav('/settings')}>
          <img className={'icon'} src={parameters_icon} alt={'icon parameters'} />
        </div>
      </div>

      <div className={'listPlaylistContainer'}>
        <p>T</p>
        <p>T</p>
      </div>

      <div className={'playerContainer'}>
        <p>Name</p>
        <input type={'range'} />
      </div>
    </div>
  )
}

export default SideBar
