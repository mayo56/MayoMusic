// React Import
import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'

// CSS
import '@renderer/assets/CSS/Library/Album.css'

function Album(): React.JSX.Element {
  const nav = useNavigate()
  const { id } = useParams()

  React.useEffect(() => {
    console.log(id)
  })

  // Launch music
  return (
    <div className={'albumListContainer'}>
      <button onClick={() => nav('/library')}>{'<-'}</button>
      <p>{id}</p>
      <hr />
    </div>
  )
}

export default Album
