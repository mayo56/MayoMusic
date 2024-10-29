import React from 'react'
import '../assets/Components/TopBar.css'

function TopBar(props: { menu: number; setMenu: any }): React.JSX.Element {
  const changeMenu = (to: number): void => props.setMenu(to)
  return (
    <div className={'topBarContainer'}>
      <div className={'topBarPlayer'}>
        <audio />
        <button>{'<-'}</button>
        <button>{' P'}</button>
        <button>{'->'}</button>
        <input type={'range'} />
      </div>
      <div className={'topBarSpacesButtonsContainer'}>
        <div
          onClick={() => changeMenu(0)}
          className={props.menu == 0 ? 'topBarButton selected' : 'topBarButton'}
        >
          <span>Bibliothèque</span>
        </div>
        <div className={'separator'}>|</div>
        <div
          onClick={() => changeMenu(1)}
          className={props.menu == 1 ? 'topBarButton selected' : 'topBarButton'}
        >
          <span>Download</span>
        </div>
      </div>
    </div>
  )
}

export default TopBar
