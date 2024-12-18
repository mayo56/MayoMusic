# MayoMusic

MayoMusic est un lecteur de musique en local basé sur
le style de [Arc Browser](https://arc.net "Arc Browser").

<!-- BEGIN Version & Dependencies -->
<div align="center">

[![GitHub Pre-Release](https://img.shields.io/github/v/release/mayo56/MayoMusic?include_prereleases&style=for-the-badge&label=Pre-release&color=brightgreen)](#INSTALLATION)
[![GitHub Release](https://img.shields.io/github/v/release/mayo56/MayoMusic?style=for-the-badge&label=Release&color=brightgreen)](#INSTALLATION)

[![Node.js Badge](https://img.shields.io/badge/node.js-node?style=for-the-badge&logo=nodedotjs&logoColor=green&color=black)](https://nodejs.org/ "Node.js")
[![TypeScript Badge](https://img.shields.io/badge/typescript-ts?style=for-the-badge&logo=typescript&logoColor=blue&color=black)](https://nodejs.org/ "Node.js")
[![Electron Vite Badge](https://img.shields.io/badge/electron%20vite-vite?style=for-the-badge&logo=vite&logoColor=yellow&color=black)](https://electron-vite.org/ "Electron Vite JS")
[![ElectronJS Badge](https://img.shields.io/badge/electronjs-electron?style=for-the-badge&logo=electron&color=black)](https://www.electronjs.org/ "Electron JS")
[![ReactJS Badge](https://img.shields.io/badge/reactjs-react?style=for-the-badge&logo=react&color=black)](https://react.dev/ "ReactJS")

</div>
<!-- END Version & Dependencies -->

<!-- BEGIN Supported Languages -->

| Langue   | Supporté | Documentation                                                     |
|----------|:--------:|-------------------------------------------------------------------|
| Français |    ✅     | [README fr](https://github.com/mayo56/MayoMusic/DOC/README_fr.md) |
| Anglais  |    ❌     | [README en](https://github.com/mayo56/MayoMusic/README.md)        |

<!-- END Supported languages -->

<!-- BEGIN Summary -->

* [INSTALLATION](#INSTALLATION)
  * [Instructions](#instructions-détaillées)
  * [Mise à jour](#mises-à-jour)
  * [Dépendances](#dépendances)
  * [Compilation](#compilation)
* [UTILISATION](#utilisation)
  * [Musique](#musique)
* [CONFIGURATION](#configuration)
* [OBJECTIFS](#objectifs)

<!-- END Summary -->

# INSTALLATION

## Instructions détaillées

| Plateforme | Disponible | Lien |
|------------|------------|------|
| MacOS      | Oui        | /    |
| Linux      | Non        | /    |
| Windows    | Non        | /    |

## Mises à jour

`Pas encore disponible`

## Dépendances

Dépendances optionnelles

| Nom     | Télécharger                      | Usage                                     |
|---------|----------------------------------|-------------------------------------------|
| YT-DLP* | https://github.com/yt-dlp/yt-dlp | Télécharger les musiques depuis MayoMusic |

*YT-DLP: Attention à avoir la variable d'environnement nommée `yt-dlp`.

## Compilation

<div align="left">

[![Node.js Badge](https://img.shields.io/badge/node.js-node?style=for-the-badge&logo=nodedotjs&logoColor=green&color=black)](https://nodejs.org/ "Node.js")

</div>

Télécharger le projet et installez les dépendances

```shell
git clone https://github.com/mayo56/MayoMusic.git
cd MayoMusic
npm install
```

Compiler selon votre plateforme

```shell
# MacOS
npm build:mac
# Windows
npm build:win
# Linux
npm build:linux
```

Le build se trouve dans le dossier `dist`

ENJOY !

# UTILISATION

## Musique

# CONFIGURATION

## Fichier supporté

| Fichier | Extension | Supporté |
|---------|-----------|:--------:|
| MPEG    | `.mp3`    |    ✅     |
| MPEG    | `.mp4`    |    ❌     |
| OGG     | `.ogg`    |    ✅     |
| WEBM    | `.webm`   |    ✅     |
| OPUS    | `.opus`   |    ✅     |
| M4A     | `.m4a`    |    ✅     |

# Objectifs

Créer un lecteur de musique jolie, façile d'utilisation et en local/serveur

- Lecteur
  - [x] Lire des fichiers audio
  - [ ] Système de file d'attente
  - [x] Volume
  - [x] Bar de progression dans la musique
  - [ ] Boucle
- Paramètres
  - [ ] Modifier le chemin de stockage des musiques
  - [ ] Mise en forme automatique des dossiers
  - [x] Téléchargement via YT-DLP (avec bugs)
  - [ ] Modification des couleurs
  - [ ] Connexion à un serveur distant (dans le futur)
- Musiques
  - [x] Lecture du dossier répertoire de musique
  - [x] Affichage des cover/noms
  - [x] Affichage des musiques
  - [ ] Affichage du dossier répertoire des musiques
