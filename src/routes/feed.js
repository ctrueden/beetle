import xml from 'xml'
import fetch from 'node-fetch'
const HOST = process.env.BEETLE_HOST + process.env.BEETLE_BASE

let albumFeed = function(albums) {
  const xmlObject = {
    rss: [
      {
        _attr: {
          version: '2.0',
          'xmlns:atom': 'http://www.w3.org/2005/Atom'
        }
      },
      {
        channel: [
          {
            'atom:link': {
              _attr: {
                href: HOST + '/feed',
                rel: 'self',
                type: 'application/rss+xml'
              }
            }
          },
          { title: 'Beetle' },
          { link: HOST },
          { description: '' },
          { language: 'en-us' },
          ...albums.map(album => {
            return {
              item: [
                { title: album.album + ' - ' + album.albumartist },
                { pubDate: new Date(album.added).toUTCString() },
                { link: HOST + 'album/' + album.id },
                { guid: HOST + 'album/' + album.id },
                { description: { _cdata: `<img src="${process.env.BEETLE_API}/album/${album.id}/art"/><p>${album.album}<br/>${album.albumartist}<br/>${album.year}</p>` } }
              ]
            }
          })
        ]
      }
    ]
  }

  return '<?xml version="1.0" encoding="UTF-8"?>' + xml(xmlObject)
}

export function get (req, res) {
  fetch(process.env.BEETLE_API + '/album/query/added-')
    .then(r => r.json())
    .then(albums => {
      let recentAlbums = albums.results.splice(0, 20)
      res.writeHead(200, {
        'Content-Type': 'application/rss+xml'
      })

      res.end(albumFeed(recentAlbums))
    })
}
