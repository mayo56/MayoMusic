// React Import
import React from 'react'

// CSS
import '@renderer/assets/CSS/Settings/Download/yt-dlp.css'

function YoutubeDLPage(): React.JSX.Element {
  const [isInstalled, setIsInstalled] = React.useState<null | boolean>(false)
  const [info, setINFO] = React.useState<{ version: string }>({ version: '' })

  React.useEffect(() => {
    window.api.download.yt_dlp_status_req()
    window.api.download.yt_dlp_status_res((data) => {
      setINFO({ version: data.version })
      setIsInstalled(!data.error)
      console.log(data)
    })
  }, [])

  const [url, setURL] = React.useState<string>('')

  // Select menu
  return (
    <div className={'yt-dlp-container'}>
      <div className={'yt-dlp-title'}>
        <span className={'texte'}>{'yt-dlp'}</span>
      </div>

      {/*
      Informations, YT-DLP installé ?
      */}
      <div className={'info'}>
        <span>yt-dlp status: </span>
        {isInstalled === null ? (
          <span>...</span>
        ) : isInstalled ? (
          <span>yes</span>
        ) : (
          <span>nop</span>
        )}
        <span>v{info.version}</span>
      </div>

      <form>
        <input
          disabled={isInstalled === null ? true : !isInstalled}
          type={'url'}
          value={url}
          onChange={(e) => setURL(e.target.value)}
        />
        {/*
        Quality
        */}
        <select disabled={isInstalled === null ? true : !isInstalled}>
          <option value={''}>-- Selection qualité audio --</option>
          <option value={'low'}>low</option>
          <option value={'medium'}>medium</option>
          <option value={'high'}>high</option>
        </select>
        <div>
          <label>Playlist</label>
          <input disabled={isInstalled === null ? true : !isInstalled} type={'checkbox'} />
        </div>
      </form>
    </div>
  )
}

export default YoutubeDLPage
