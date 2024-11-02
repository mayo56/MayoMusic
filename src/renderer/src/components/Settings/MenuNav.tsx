// React Import
import React from 'react'
import { useNavigate } from 'react-router-dom' // CSS
import '@renderer/assets/CSS/Components/DownloadLeftBar.css'

function MenuNav(props: {
  menuList: { label: string; path: string }[]
  selected: number
}): React.JSX.Element {
  const nav = useNavigate()
  return (
    <div className={'MenuNavContainer'}>
      {props.menuList.map((info, index) => {
        return (
          <div
            onClick={() => nav(info.path)}
            className={`button ${props.selected === index ? 'selected' : ''}`}
            key={index}
          >
            <span>{info.label}</span>
          </div>
        )
      })}
    </div>
  )
}

export default MenuNav
