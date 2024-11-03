import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

// CSS
import '@renderer/assets/CSS/Global/SideBar.css'

// Icons
import library_icon from '@renderer/assets/Images/library-svgrepo-com.svg'
import parameters_icon from '@renderer/assets/Images/construct-svgrepo-com.svg'
import add_icon from '@renderer/assets/Images/add-svgrepo-com.svg'

// Components
import Player from '@renderer/components/Global/Player'

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
        <div
          className={`choice ${menu === 1 ? 'selected' : ''}`}
          aria-label={'Library'}
          onClick={() => nav('/library')}
        >
          <img className={'icon'} src={library_icon} alt={'icon library'} />
        </div>
        <div
          className={`choice ${menu === 2 ? 'selected' : ''}`}
          aria-label={'Parameters'}
          onClick={() => nav('/settings')}
        >
          <img className={'icon'} src={parameters_icon} alt={'icon parameters'} />
        </div>
      </div>

      <div className={'listPlaylistContainer'}>
        {/*
        Separator
        */}
        <div className={'separator'}>
          <div className={'bar'} />
          <span className={'texte'}>Playlist</span>
          <div className={'endBar'} />
        </div>

        {/*
        Créer une playlist
        */}
        <div className={'createPlaylistContainer incoming_feature'}>
          <img className={'icon'} src={add_icon} alt={'add icon'} />
          <span className={'texte'}>Créer une playlist</span>
        </div>
      </div>

      <div className={'playerContainer'}>
        <Player />
      </div>
    </div>
  )
}

export default SideBar
