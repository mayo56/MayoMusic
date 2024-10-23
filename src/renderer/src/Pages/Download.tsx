import React from 'react'
import DownloadLeftBar from '@renderer/components/DownloadLeftBar'
import ImportFiles from '@renderer/Pages/Sous-Pages/Download/ImportFiles'
import YoutubeDLPage from '@renderer/Pages/Sous-Pages/Download/Youtube-DL'

function Download(): React.JSX.Element {
  const [dl_menu, setDL_Menu] = React.useState<number>(0)
  const Dl_page = (): React.JSX.Element => {
    if (dl_menu === 0) {
      return <ImportFiles />
    } else if (dl_menu === 1) {
      return <YoutubeDLPage />
    } else {
      return <>Error</>
    }
  }
  return (
    <div>
      <DownloadLeftBar menu={dl_menu} setMenu={setDL_Menu} />
      <Dl_page />
    </div>
  )
}

export default Download
