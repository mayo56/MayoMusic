import React, { useState } from 'react'

// Icons
import left_arrow from '@renderer/assets/Images/arrow-back-svgrepo-com.svg'

function GlobalController(): React.JSX.Element {
  const [fullscreen, setFullscreen] = useState<boolean>(false)
  React.useEffect(() => {
    return (): void => {
      window.api.Global.fullscreen((status) => {
        setFullscreen(status)
        console.warn('fullscreen:', fullscreen, status)
      })
    }
  })
  return (
    <div className={'GlobalSideBarControllerContainer'}>
      <img className={`icon ${fullscreen ? 'fullscreen' : 'not_fullscreen'}`} src={left_arrow} alt={'left arrow'} />
    </div>
  )
}

export default GlobalController
