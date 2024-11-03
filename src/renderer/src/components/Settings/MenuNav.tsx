// React Import
import React from 'react'
import { useLocation, useNavigate } from "react-router-dom";

// Icon
import experimental_icon from '@renderer/assets/Images/flask-svgrepo-com.svg'

// CSS
import '@renderer/assets/CSS/Components/MenuNav.css'

function MenuNav(props: {
  menuList: { label: string; path: string; experimental?: boolean }[][]
  categories: string[]
}): React.JSX.Element {
  const nav = useNavigate()
  const path = useLocation()
  console.log(path)
  return (
    <div className={'MenuNavContainer'}>
      {props.categories.map((category, index_cat) => {
        return (
          <div className={'MenuNavCategoryContainer'} key={index_cat}>
            <p className={'name'}>{category}</p>
            {props.menuList[index_cat].map((data, index_data) => {
              console.log(path.pathname === data.path, path.pathname)
              return (
                <div
                  className={`MenuNavButtonContainer ${path.pathname === data.path ? 'selected' : ''}`}
                  key={index_data}
                  onClick={() => nav(data.path)}
                >
                  <span className={'label'}>{data.label}</span>
                  {data.experimental ? (
                    <img className={'icon'} src={experimental_icon} alt={'experimental icon'} />
                  ) : (
                    <></>
                  )}
                </div>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}

export default MenuNav
