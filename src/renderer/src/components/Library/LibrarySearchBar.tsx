import React from 'react'
// CSS dans le CSS de Library

function LibrarySearchBar(): React.JSX.Element {
  /**
   * Fonction reload des albums
   */
  const reloadRequest = (): void => {
    window.api.library.data.reload()
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
    </div>
  )
}

export default LibrarySearchBar
