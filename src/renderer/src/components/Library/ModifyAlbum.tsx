import React from 'react'

import setting_icon from '@renderer/assets/Images/build-svgrepo-com.svg'

function ModifyAlbum(): React.JSX.Element {
  const [isActifModify, setModify] = React.useState<boolean>(false)
  return (
    <>
      <div onClick={() => setModify(true)}>
        <img src={setting_icon} alt={'album setting icon'} />
      </div>
      {isActifModify ? (
        <div>
          <p>Hello</p>
        </div>
      ) : (
        <></>
      )}
    </>
  )
}

export default ModifyAlbum
