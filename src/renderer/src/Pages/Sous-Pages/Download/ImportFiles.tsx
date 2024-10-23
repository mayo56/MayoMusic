import React from 'react'

function ImportFilesPage(): React.JSX.Element {
  const [folderPath, setFolderPath] = React.useState<string | null>(null)

  const handleOpenFolder = async (): Promise<void> => {
    const result = await window.api.openFolderDialog()
    if (result && result.length > 0) {
      setFolderPath(result[0]) // On prend le premier chemin (au cas où il y a plusieurs)
    }
  }
  return (
    <div>
      <h1>Dossier</h1>
      <button onClick={handleOpenFolder}>Sélectionner un dossier</button>
      <p>{folderPath}</p>
      <h1>Author</h1>
      <select>
        <option>lol</option>
        <option>mdr</option>
      </select>
      <h1>Nom</h1>
      <input type={'text'} />
      <button>Ajouter</button>
    </div>
  )
}

export default ImportFilesPage
