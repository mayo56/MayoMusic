// React Import
import React from 'react'
import { Route, Routes } from 'react-router-dom' // CSS
import ImportFiles from '@renderer/Pages/Sous-Pages/Settings/Download/ImportFiles'
import YoutubeDLPage from '@renderer/Pages/Sous-Pages/Settings/Download/Youtube-DL'

function Parameters(): React.JSX.Element {
  return (
    <>
      <Routes>
        <Route path={''} element={<ImportFiles />} />
        <Route path={'download'} element={<YoutubeDLPage />} />
      </Routes>
    </>
  )
}

export default Parameters
