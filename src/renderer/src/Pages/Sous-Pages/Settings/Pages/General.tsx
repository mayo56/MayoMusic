import React from 'react'
import Title from '@renderer/components/Settings/Title'
import Description from '@renderer/components/Settings/Description'

const General = (): React.JSX.Element => {
  return (
    <div className={'param-page'}>
      <div>
        <Title>Langue</Title>
        <Description>Mettez la langue qui vous correspond</Description>
        <select>
          <option>Français</option>
          <option>English</option>
        </select>
      </div>

      <div>
        <Title>Thème</Title>
      </div>

      <div>
        <Title>Notifications</Title>
        <Description>Activer ou désactiver les notifications</Description>
        <div>
          <p>Notifications de téléchargement</p>
          <input type={'checkbox'} />
        </div>
      </div>
    </div>
  )
}

export default General
