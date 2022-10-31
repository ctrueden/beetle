// sourced from: https://github.com/mattdesl/browser-media-mime-type/blob/master/index.js

var mimeTypes = {
  'audio/midi': ['mid', 'midi', 'kar', 'rmi'],
  'audio/mp4': ['mp4a', 'm4a'],
  'audio/mpeg': ['mpga', 'mp2', 'mp2a', 'mp3', 'm2a', 'm3a'],
  'audio/ogg': ['oga', 'ogg', 'spx'],
  'audio/webm': ['weba'],
  'audio/x-matroska': ['mka'],
  'audio/x-mpegurl': ['m3u'],
  'audio/wav': ['wav'],
  'audio/flac': ['flac']
}

var mimeLookup = {}
Object.keys(mimeTypes).forEach(function (key) {
  var extensions = mimeTypes[key]
  extensions.forEach(function (ext) {
    mimeLookup[ext] = key
  })
})

export default function lookup (ext) {
  if (!ext) throw new TypeError('must specify extension string')
  if (ext.indexOf('.') === 0) {
    ext = ext.substring(1)
  }
  return mimeLookup[ext.toLowerCase()]
}
