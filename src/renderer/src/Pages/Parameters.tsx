// React Import
import React from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'

// Components / Pages
import ImportFiles from '@renderer/Pages/Sous-Pages/Settings/Download/ImportFiles'
import YoutubeDLPage from '@renderer/Pages/Sous-Pages/Settings/Download/Youtube-DL'
import MenuNav from '@renderer/components/Settings/MenuNav'

function Parameters(): React.JSX.Element {
  const [selected, setSelected] = React.useState(0)
  const location = useLocation()
  React.useEffect(() => {
    if (location.pathname.includes('download')) {
      setSelected(1)
    } else {
      setSelected(0)
    }
  }, [location.pathname])
  return (
    <>
      <MenuNav
        menuList={[
          {
            label: 'Global',
            path: '/settings'
          },
          {
            label: 'Téléchargement',
            path: '/settings/download'
          }
        ]}
        selected={selected}
      />
      <Routes>
        <Route path={''} element={<ImportFiles />} />
        <Route path={'download'} element={<YoutubeDLPage />} />
      </Routes>
    </>
  )
}

export default Parameters
