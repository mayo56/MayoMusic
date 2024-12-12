import fs from 'fs'
import path from 'path'
import { AlbumConfig, AlbumData } from '../Types/types'
import { AppSettings } from './store'

/**
 * LibraryManager est une classe singleton gérant la bibliothèque musicale de l'application.
 * Elle permet d'initialiser, de rechercher, et de manipuler les albums et leurs métadonnées.
 */
class LibraryManager {
  /**
   * Instance unique de la classe LibraryManager (Singleton).
   */
  private static instance: LibraryManager

  /**
   * Liste des albums présents dans la bibliothèque.
   */
  private albums: AlbumData[] = []

  /**
   * Extensions audio supportées pour détecter les fichiers de musique.
   */
  private supportedAudioFormats = ['.ogg', '.mp3', '.webm', '.m4a', '.opus']

  /**
   * Constructeur privé empêchant l'instanciation directe.
   */
  private constructor() {
    /* Constructor vide - NE PAS REMPLIR */
  }

  /**
   * Récupère l'instance unique de LibraryManager.
   * @returns {LibraryManager} L'instance singleton.
   */
  public static getInstance(): LibraryManager {
    if (!LibraryManager.instance) {
      LibraryManager.instance = new LibraryManager()
    }
    return LibraryManager.instance
  }

  /**
   * Initialise ou rafraîchit la bibliothèque musicale en scannant le dossier des albums.
   * @async
   */
  public async initializeLibrary(): Promise<void> {
    const libraryPath = AppSettings().settings.savePath

    // Assure l'existence du dossier principal
    await this.ensureDirectoryExists(libraryPath)

    // Récupère et traite tous les dossiers représentant des albums
    const folderNames = await this.getSubdirectories(libraryPath)
    const albums_list = await Promise.all(
      folderNames.map((folderName) =>
        this.processAlbum(path.join(libraryPath, folderName), folderName)
      )
    )

    // Filtre les entrées nulles en cas d'erreurs lors du traitement des albums
    this.albums = albums_list.filter(Boolean) as AlbumData[]
  }

  /**
   * Retourne la liste complète des albums.
   * @returns {AlbumData[]} Liste des albums avec leurs métadonnées.
   */
  public getAlbums(): AlbumData[] {
    return this.albums
  }

  /**
   * Vérifie si un album avec le nom donné existe dans la bibliothèque.
   * @param albumName Nom de l'album à vérifier.
   * @returns {boolean} `true` si l'album existe, sinon `false`.
   */
  public hasAlbum(albumName: string): boolean {
    return this.albums.some((album) => album.name === albumName)
  }

  /**
   * Récupère les informations complètes d'un album.
   * @param albumName Nom de l'album à récupérer.
   * @returns {AlbumData | null} Les données de l'album, ou `null` si non trouvé.
   */
  public getAlbum(albumName: string): AlbumData | null {
    if (this.hasAlbum(albumName)) {
      return this.albums.find((e) => e.name === albumName)!
    }
    return null
  }

  /**
   * Récupère la liste des pistes d'un album donné.
   * @param albumName Nom de l'album.
   * @returns {string[] | null} Liste des pistes audio, ou `null` si non trouvé.
   */
  public getAlbumTracks(albumName: string): string[] | null {
    return this.getAlbum(albumName)?.tracks || null
  }

  /**
   * Récupère le chemin de l'image de couverture d'un album.
   * @param albumName Nom de l'album.
   * @returns {string | null} Chemin vers le fichier de couverture, ou `null` si non trouvé.
   */
  public getAlbumCoverPath(albumName: string): string | null {
    const album = this.getAlbum(albumName)
    return album?.coverPath || null
  }

  /**
   * Récupère la couverture d'un album en base64.
   * @param albumName Le chemin absolu vers le dossier de l'album.
   * @returns Une chaîne en base64 représentant l'image de couverture, ou `null` si aucune couverture n'est trouvée.
   */
  public getCoverAsBase64(albumName: string): string | undefined {
    const coverFile = this.getAlbumCoverPath(albumName) // Chemin attendu du fichier couverture

    // Vérifie si le fichier existe
    if (!coverFile || !fs.existsSync(coverFile)) {
      console.warn(`Fichier de couverture introuvable : ${albumName}`)
      return undefined
    }

    try {
      // Lecture et conversion en base64
      const fileBuffer = fs.readFileSync(coverFile)
      const base64 = fileBuffer.toString('base64')
      return `data:image/png;base64,${base64}`
    } catch (error) {
      console.error(`Erreur lors de la conversion de la couverture en base64 : ${error}`)
      return undefined
    }
  }

  // ------------------------------------------------------------------------------- //
  //                               METHODS PRIVATE                                   //
  // ------------------------------------------------------------------------------- //

  /**
   * Crée un dossier s'il n'existe pas.
   * @param directory Chemin du dossier à vérifier/créer.
   * @async
   */
  private async ensureDirectoryExists(directory: string): Promise<void> {
    try {
      await fs.promises.mkdir(directory, { recursive: true })
    } catch (error) {
      console.error(`Erreur lors de la création du dossier : ${directory}`, error)
    }
  }

  /**
   * Récupère les sous-dossiers d'un répertoire donné.
   * @param directory Chemin du répertoire.
   * @returns {Promise<string[]>} Liste des noms de sous-dossiers.
   * @async
   */
  private async getSubdirectories(directory: string): Promise<string[]> {
    try {
      const entries = await fs.promises.readdir(directory, {
        withFileTypes: true
      })
      return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name)
    } catch (error) {
      console.error(`Erreur lors de la lecture du répertoire : ${directory}`, error)
      return []
    }
  }

  /**
   * Traite un dossier d'album pour extraire ses métadonnées.
   * @param albumPath Chemin absolu vers le dossier de l'album.
   * @param folderName Nom du dossier (utilisé comme titre de l'album).
   * @returns {Promise<AlbumData | null>} Métadonnées de l'album, ou `null` en cas d'erreur.
   * @async
   */
  private async processAlbum(albumPath: string, folderName: string): Promise<AlbumData | null> {
    try {
      const configPath = path.join(albumPath, 'setting.json')
      const config = await this.loadAlbumConfig(configPath)
      const tracks =
        (config?.order?.length ?? 0) > 0 ? config?.order : await this.getAudioFiles(albumPath)

      return {
        name: folderName,
        path: albumPath,
        author: config?.author?.join(', ') || null,
        coverPath: config?.cover ? path.join(albumPath, config.cover) : null,
        tracks: tracks ?? []
      }
    } catch (error) {
      console.error(`Erreur lors du traitement de l'album : ${folderName}`, error)
      return null
    }
  }

  /**
   * Charge le fichier de configuration d'un album.
   * @param configPath Chemin vers le fichier `setting.json`.
   * @returns {Promise<AlbumConfig | null>} Configuration de l'album, ou `null` si non trouvée.
   * @async
   */
  private async loadAlbumConfig(configPath: string): Promise<AlbumConfig | null> {
    try {
      if (await this.fileExists(configPath)) {
        const rawData = await fs.promises.readFile(configPath, 'utf-8')
        return JSON.parse(rawData)
      }
    } catch (error) {
      console.error(`Erreur lors du chargement de la configuration : ${configPath}`, error)
    }
    return null
  }

  /**
   * Récupère tous les fichiers audio supportés dans un répertoire.
   * @param directory Chemin du répertoire.
   * @returns {Promise<string[]>} Liste des fichiers audio.
   * @async
   */
  private async getAudioFiles(directory: string): Promise<string[]> {
    try {
      const files = await fs.promises.readdir(directory)
      return files.filter((file) =>
        this.supportedAudioFormats.includes(path.extname(file).toLowerCase())
      )
    } catch (error) {
      console.error(`Erreur lors de la lecture des fichiers audio dans : ${directory}`, error)
      return []
    }
  }

  /**
   * Vérifie si un fichier existe.
   * @param filePath Chemin du fichier.
   * @returns {Promise<boolean>} `true` si le fichier existe, sinon `false`.
   * @async
   */
  private async fileExists(filePath: string): Promise<boolean> {
    try {
      await fs.promises.access(filePath)
      return true
    } catch {
      return false
    }
  }
}

export default LibraryManager
