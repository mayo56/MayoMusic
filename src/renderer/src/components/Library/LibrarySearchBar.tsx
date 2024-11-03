import React from 'react'
import { useNavigate } from 'react-router-dom'
// CSS dans le CSS de Library

function LibrarySearchBar(): React.JSX.Element {
  const reloadRequest = (): void => {
    window.api.library.reloadAlbums()
    console.warn('Reload list')
  }
  const nav = useNavigate()
  return (
    <div className={'LibrarySearchBarContainer'}>
      <button onClick={reloadRequest} className={'reloadButton'}>
        Reload
      </button>
      <div className={'searchBarContainer'}>
        <input type={'text'} placeholder={'Rechercher un titre'} />
        <button className={'searchBarButton'}>Search</button>
      </div>
      <button onClick={() => nav('/lol/non')}>Filters</button>
    </div>
  )
}

export default LibrarySearchBar
