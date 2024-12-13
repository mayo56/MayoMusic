import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import '@renderer/assets/CSS/Global/SideBar.css'

// Icons
import library_icon from '@renderer/assets/Images/library-svgrepo-com.svg'
import parameters_icon from '@renderer/assets/Images/construct-svgrepo-com.svg'

function SideBar(): React.JSX.Element {
  const nav = useNavigate()

  // Gestion de la sélection
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
    <div className="mm-global-left-bar">
      <div>
        {/* Séparateur supérieur */}
        <div className="mm-global-left-bar-separator" />
      </div>

      {/* Menu */}
      <div className="mm-global-left-bar-menu">
        <div
          className={`choice ${menu === 1 ? 'selected' : ''}`}
          aria-label="Library"
          onClick={() => nav('/library')}
        >
          <img className="icon" src={library_icon} alt="Library Icon" />
        </div>
        <div
          className={`choice ${menu === 2 ? 'selected' : ''}`}
          aria-label="Settings"
          onClick={() => nav('/settings')}
        >
          <img className="icon" src={parameters_icon} alt="Settings Icon" />
        </div>
      </div>

      {/* Footer */}
      <div className="mm-global-left-bar-footer">Made with ❤️ by Mayo</div>
    </div>
  )
}

export default SideBar
