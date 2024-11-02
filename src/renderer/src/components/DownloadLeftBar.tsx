import React from 'react'
import '@renderer/assets/CSS/Components/DownloadLeftBar.css'

function DownloadLeftBar(props: { menu: number; setMenu: any }): React.JSX.Element {
  return (
    <div className={'dlLeftBarContainer'}>
      <div onClick={() => props.setMenu(0)} className={props.menu == 0 ? 'button selected' : 'button'}>
        <h4>File DL</h4>
      </div>
      <div onClick={() => props.setMenu(1)} className={props.menu == 1 ? 'button selected' : 'button'}>
        <h4>yt-dlp</h4>
      </div>
    </div>
  )
}

export default DownloadLeftBar
