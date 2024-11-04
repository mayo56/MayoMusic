// React Import
import React from 'react'

// CSS
import '@renderer/assets/CSS/Settings/Download/yt-dlp.css' // Icon
import install_icon from '@renderer/assets/Images/hardware-chip-svgrepo-com.svg'
import version_icon from '@renderer/assets/Images/git-compare-svgrepo-com.svg'
import valid_icon from '@renderer/assets/Images/checkmark-circle-svgrepo-com.svg'
import invalid_icon from '@renderer/assets/Images/close-circle-svgrepo-com.svg'
import extract_icon from '@renderer/assets/Images/cloud-download-svgrepo-com.svg'

function YoutubeDLPage(): React.JSX.Element {
  const [isInstalled, setIsInstalled] = React.useState<boolean>(false)
  const [info, setINFO] = React.useState<{ version: string }>({ version: '' })

  React.useEffect(() => {
    window.api.download.yt_dlp_status_req()
    window.api.download.yt_dlp_status_res((data) => {
      if (!data.error) {
        setINFO({ version: data.version })
      }
      setIsInstalled(!data.error)
    })
  }, [])

  const [url, setURL] = React.useState<string>('')
  const [audioQuality, setAudioQuality] = React.useState<string>('')
  const [playlist, setPlaylist] = React.useState<boolean>(true)

  const downloadRequest = (): void => {
    window.api.download.yt_dlp_download_req({
      url,
      quality: audioQuality,
      playlist,
      folderName: 'Spice and Wolf: MERCHANT MEETS THE WISE WOLF (Original Soundtrack) (Volume 2)'
    })
  }

  // Data
  const [audioEXT] = React.useState<string[]>(['mp3', 'ogg', 'flac', 'm4a', 'aac'])
  return (
    <div className={'yt-dlp-container'}>
      <div className={'yt-dlp-title'}>
        <span className={'texte'}>{'yt-dlp'}</span>
      </div>

      {/*
      Informations, YT-DLP installé ? Sa version ?
      */}
      <div className={'yt-dlp-info'}>
        <div className={'info yt-dlp-info-global'}>
          <img className={'icon'} src={install_icon} alt={'icon install'} />
          <span>Installed: </span>
          {isInstalled ? (
            <img className={'icon'} src={valid_icon} alt={'icon valid'} />
          ) : (
            <img className={'icon'} src={invalid_icon} alt={'icon invalid'} />
          )}
        </div>
        <div className={'info yt-dlp-info-global'}>
          <img className={'icon'} src={version_icon} alt={'icon version'} />
          <span>Version: {info.version}</span>
        </div>
      </div>

      {/*
      Input argument de téléchargement
      */}
      <div>
        <h2>Informations principales</h2>
        <span>URL</span>
        <input
          disabled={isInstalled === null ? true : !isInstalled}
          type={'url'}
          value={url}
          onChange={(e) => setURL(e.target.value)}
        />
        {/*
        Quality
        */}
        <span>Audio Quality</span>
        <select
          value={audioQuality}
          onChange={(e) => setAudioQuality(e.target.value)}
          disabled={isInstalled === null ? true : !isInstalled}
        >
          <option value={''}>-- Selection qualité audio --</option>
          <option value={'low'}>low</option>
          <option value={'medium'}>medium</option>
          <option value={'best'}>best</option>
        </select>
      </div>

      {/*
        Options avancées
        */}
      <h2>Options avancées</h2>
      <div>
        <label>Playlist</label>
        <input
          checked={playlist}
          onChange={(e) => setPlaylist(e.target.checked)}
          disabled={isInstalled === null ? true : !isInstalled}
          type={'checkbox'}
        />
      </div>
      <div>
        <span>Type de fichier</span>
        <select>
          <option value={''}>Auto</option>
          {audioEXT.map((ext, i) => {
            return (
              <option value={ext} key={i}>
                {ext}
              </option>
            )
          })}
        </select>
      </div>

      {/*
        Bouton Download
        */}
      <div className={'yt-dlp-button'}>
        <img onClick={downloadRequest} src={extract_icon} className={'icon'} alt={'extract icon'} />
      </div>
    </div>
  )
}

export default YoutubeDLPage
