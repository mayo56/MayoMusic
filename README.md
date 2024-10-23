# MayoMusic

### Build

```bash
# For windows
$ npm run build:win

# For macOS
$ npm run build:mac

# For Linux
$ npm run build:linux
```

### Settings.json

```json
{
  "settings": {
    "savePath": ""
  },
  "externalMusics": [
    {
      "name": "name",
      "path": "path/to/external/music/folder"
    },
    ...
  ],
  "pinMusic": [
    "name",
    ...
  ]
}
```

### Folder/File music setting

```json
{
  "type": "folder | file",
  "cover": "path/to/cover | null",
  "author": "author's name | null",
  "musicList": [
    "path/to/music/audio",
    ...
  ]
}
```
