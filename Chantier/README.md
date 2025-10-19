# Equal Task Cycle (ETC) 

## Production de l'icone

* Faire l’image en 1024 x 1024 px

* ouvrir un Terminal à ce dossier et produire les différentes tailles et l’icone : 

  ~~~shell
  mkdir icon.iconset
  magick icon.png -resize 16x16 icon.iconset/icon_16x16.png
  magick icon.png -resize 32x32 icon.iconset/icon_16x16@2x.png
  magick icon.png -resize 32x32 icon.iconset/icon_32x32.png
  magick icon.png -resize 64x64 icon.iconset/icon_32x32@2x.png
  magick icon.png -resize 128x128 icon.iconset/icon_128x128.png
  magick icon.png -resize 256x256 icon.iconset/icon_128x128@2x.png
  magick icon.png -resize 256x256 icon.iconset/icon_256x256.png
  magick icon.png -resize 512x512 icon.iconset/icon_256x256@2x.png
  magick icon.png -resize 512x512 icon.iconset/icon_512x512.png
  magick icon.png -resize 1024x1024 icon.iconset/icon_512x512@2x.png
  
  iconutil -c icns icon.iconset
  
  rm -rf ./icon.iconset
  mv icon.icns ../electron/icon.icns
  ~~~

  C’est tout bon, l’icone a été déplacé vers le dossier principal.
