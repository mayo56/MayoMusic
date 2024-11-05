// React Import
import React from 'react'

// CSS
import '@renderer/assets/CSS/Settings/Download/yt-dlp.css'

// Icon
import install_icon from '@renderer/assets/Images/hardware-chip-svgrepo-com.svg'
import version_icon from '@renderer/assets/Images/git-compare-svgrepo-com.svg'
import valid_icon from '@renderer/assets/Images/checkmark-circle-svgrepo-com.svg'
import invalid_icon from '@renderer/assets/Images/close-circle-svgrepo-com.svg'
import extract_icon from '@renderer/assets/Images/cloud-download-svgrepo-com.svg'
import right_arrow_icon from '@renderer/assets/Images/chevron-forward-svgrepo-com.svg'
import bottom_arrow_icon from '@renderer/assets/Images/chevron-down-svgrepo-com.svg'

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
  const [audioQuality, setAudioQuality] = React.useState<string>('best')
  const [playlist, setPlaylist] = React.useState<boolean>(false)
  const [folderName, setFolderName] = React.useState<string>('')

  // mise à jour auto bouton download
  const [disabled, setDisabled] = React.useState<boolean>(true)
  React.useEffect(() => {
    if (url.trim() == '') {
      setDisabled(true)
    } else if (folderName.trim() == '') {
      setDisabled(true)
    } else {
      setDisabled(false)
    }
  }, [url, folderName])

  // Envoie des données de téléchargement
  const downloadRequest = (): void => {
    if (disabled) return
    window.api.download.yt_dlp_download_req({
      url,
      quality: audioQuality,
      playlist,
      folderName
    })
  }

  // Data
  const [audioEXT] = React.useState<string[]>(['mp3', 'ogg', 'flac', 'm4a', 'aac'])

  // Afficher les options avancées
  const [showAdvanced, setShowAdvanced] = React.useState<boolean>(false)
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
      <div className={'yt-dlp-important-input'}>
        <div className={'yt-dlp-input-module'}>
          <span className={'label'}>URL</span>
          <input
            disabled={isInstalled === null ? true : !isInstalled}
            type={'url'}
            value={url}
            onChange={(e) => setURL(e.target.value)}
            className={'texte-input'}
            placeholder={'e.g. https://youtube.com/...'}
          />
        </div>

        {/*
        Nom de dossier
        */}
        <div className={'yt-dlp-input-module'}>
          <span className={'label'}>Nom du dossier</span>
          <input
            disabled={isInstalled === null ? true : !isInstalled}
            type={'text'}
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            className={'texte-input'}
            placeholder={'e.g. Pokemon'}
          />
        </div>

        {/*
        Audio Quality
        */}
        <div className={'yt-dlp-input-module'}>
          <span className={'label'}>Audio Quality</span>
          <select
            value={audioQuality}
            onChange={(e) => setAudioQuality(e.target.value)}
            disabled={isInstalled === null ? true : !isInstalled}
          >
            <option value={'best'}>Best</option>
            <option value={'medium'}>Medium</option>
            <option value={'low'}>Low</option>
          </select>
        </div>
      </div>

      {/*
        Options avancées
        */}
      <div className={'yt-dlp-advanced-input'}>
        <h4 className={'title'} onClick={() => setShowAdvanced((e) => !e)}>
          Options avancées
          <img
            src={showAdvanced ? right_arrow_icon : bottom_arrow_icon}
            alt={'advanced input icon'}
            className={'icon'}
          />
        </h4>
        {showAdvanced ? (
          <>
            <div className={'yt-dlp-advanced-module'}>
              <label className={'label'}>Playlist</label>
              <input
                checked={playlist}
                onChange={(e) => setPlaylist(e.target.checked)}
                disabled={isInstalled === null ? true : !isInstalled}
                type={'checkbox'}
              />
            </div>
            <div className={'yt-dlp-advanced-module incoming_feature'}>
              <span className={'label'}>Type de fichier</span>
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
          </>
        ) : (
          <></>
        )}
      </div>
      {/*
        Bouton Download
        */}
      <div className={'yt-dlp-button'}>
        <img
          onClick={downloadRequest}
          src={extract_icon}
          className={`icon ${disabled ? 'disabled' : ''}`}
          alt={'extract icon'}
        />
      </div>
    </div>
  )
}

export default YoutubeDLPage
