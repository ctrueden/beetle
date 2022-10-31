import xml from 'xml'
// import fetch from 'node-fetch'
import { env } from '$env/dynamic/public'
const HOST = env.BEETLE_HOST + env.BEETLE_BASE

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
                { description: { _cdata: `<img src="${env.BEETLE_API}/album/${album.id}/art"/><p>${album.album}<br/>${album.albumartist}<br/>${album.year}</p>` } }
              ]
            }
          })
        ]
      }
    ]
  }

  return '<?xml version="1.0" encoding="UTF-8"?>' + xml(xmlObject)
}

export async function GET ({fetch, request}) {
  const recentAlbums = await fetch(env.BEETLE_API + '/album/query/added-')
    .then(r => r.json())
    .then(albums => {
      return albums.results.splice(0, 20)
    })

  const headers = new Headers()
  headers.append('Content-Type', 'application/rss+xml')
  const options = {
    'headers': headers
  }
  return new Response(String(albumFeed(recentAlbums)), options)
}
