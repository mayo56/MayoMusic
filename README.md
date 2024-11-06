# MayoMusic

MayoMusic is a local music player based on
[Arc Browser](https://arc.net "Arc Browser") style.

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

| Language | Supported | Documentation                                                     |
|----------|:---------:|-------------------------------------------------------------------|
| French   |     ✅     | [README fr](https://github.com/mayo56/MayoMusic/DOC/README_fr.md) |
| English  |     ❌     | [README en](https://github.com/mayo56/MayoMusic/README.md)        |

<!-- END Supported languages -->

<!-- BEGIN Summary -->

* [INSTALLATION](#INSTALLATION)
  * [Instructions](#detail-instructions)
  * [Update](#update)
  * [Dependencies](#dependencies)
  * [Compile](#compile)
* [USAGE](#usage)
  * [Music](#music)
* [CONFIGURATION](#configuration)
* [GOALS](#goals)

<!-- END Summary -->

# INSTALLATION

## Detail Instructions

| Platform | Available | Link |
|----------|-----------|------|
| MacOS    | Yes       | /    |
| Linux    | No        | /    |
| Windows  | No        | /    |

## Update

`Not available yet`

## Dependencies

Optional dependencies

| Name    | Download                         | Usage                                   |
|---------|----------------------------------|-----------------------------------------|
| YT-DLP* | https://github.com/yt-dlp/yt-dlp | Download musics directly into MayoMusic |

*YT-DLP: global viable must be `yt-dlp`.

## Compile

<div align="left">

[![Node.js Badge](https://img.shields.io/badge/node.js-node?style=for-the-badge&logo=nodedotjs&logoColor=green&color=black)](https://nodejs.org/ "Node.js")

</div>

Download the project and install it dependencies

```shell
git clone https://github.com/mayo56/MayoMusic.git
cd MayoMusic
npm install
```

Compile according to your operating system

```shell
# MacOS
npm build:mac
# Windows
npm build:win
# Linux
npm build:linux
```

The build is into the folder `dist`

ENJOY !

# USAGE

## Music

# CONFIGURATION

## Supported files

| File | Extension | Supported |
|------|-----------|:---------:|
| MPEG | `.mp3`    |     ✅     |
| MPEG | `.mp4`    |     ❌     |
| OGG  | `.ogg`    |     ✅     |
| WEBM | `.webm`   |     ✅     |
| OPUS | `.opus`   |     ✅     |
| M4A  | `.m4a`    |     ✅     |

# GOALS

Create beautiful music player, simply to use and local/server
- Player
  - [x] Read audio files
  - [ ] Queue system
  - [x] Volume
  - [x] Progress bar for music
  - [ ] Loop
- Settings
  - [ ] Modify path name for audio container
  - [ ] auto format folder
  - [x] Download music with YT-DLP (with bugs)
  - [ ] Modify window color
  - [ ] Connect to remote server (in the futur)
- Music
  - [x] Read album folder
  - [x] Display cover and albums
  - [x] Display music list
  - [ ] Show folder of the album
