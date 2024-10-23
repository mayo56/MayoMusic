import React from 'react'
import '../assets/Home.css'
import Bibliotheque from '@renderer/Pages/Bibliotheque'
import Download from '@renderer/Pages/Download'
import TopBar from '@renderer/components/TopBar'
import HomeLeftBar from '@renderer/components/HomeLeftBar'

function Home(): React.JSX.Element {
  const [menu, setMenu] = React.useState<number>(0)
  const Pages = (): React.JSX.Element => {
    if (menu == 0) {
      return <Bibliotheque />
    } else if (menu == 1) {
      return <Download />
    }
  }

  return (
    <div className={'homeContainer'}>
      <TopBar menu={menu} setMenu={setMenu} />
      <div className={'homeWinDisplay'}>
        <HomeLeftBar />
        <Pages />
      </div>
    </div>
  )
}

export default Home
