import React from 'react'
// CSS dans le CSS de Library

function LibrarySearchBar(): React.JSX.Element {
  const reloadRequest = (): void => {
    window.api.library.reloadAlbums()
    console.warn('Reload list')
  }
  return (
    <div className={'LibrarySearchBarContainer'}>
      <button onClick={reloadRequest} className={'reloadButton'}>
        Reload
      </button>
      <div className={'searchBarContainer'}>
        <input type={'text'} placeholder={'Rechercher un titre'} />
        <button className={'searchBarButton'}>Search</button>
      </div>
      <button>Filters</button>
    </div>
  )
}

export default LibrarySearchBar
