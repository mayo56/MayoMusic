// React Import
import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

// CSS
import '@renderer/assets/CSS/Components/MenuNav.css'

function MenuNav(): React.JSX.Element {
  const categories = [
    { name: 'Général', path: '/settings' },
    { name: 'Musique', path: '/settings/files' },
    { name: 'Avancée', path: '/settings/advanced' },
    { name: 'À propos', path: '/settings/about' }
  ]
  const loc = useLocation()
  const nav = useNavigate()
  return (
    <div className={'MenuNavContainer'}>
      {categories.map((value, index) => {
        const is_location = `${value.path === loc.pathname ? 'param-menu-button-location' : ''}`
        return (
          <div
            onClick={() => nav(value.path)}
            className={`param-menu-button ${is_location}`}
            key={index}
          >
            <span>{value.name}</span>
          </div>
        )
      })}
    </div>
  )
}

export default MenuNav
