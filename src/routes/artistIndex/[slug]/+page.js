import { env } from '$env/dynamic/public'

export function load({ fetch, params }) {

  const selectionName = params.slug[0].toUpperCase()
  
  const selections = {
    "#": "[^A-Z]"
  }

  var alphabet = "abcdefghijklmnopqrstuvwxyz".split("")
  for (let letter of alphabet) {
    selections[letter.toUpperCase()] = '(' + letter + '|' + letter.toUpperCase() + ')'
  }
  
  return fetch(env.BEETLE_API + '/album/query/albumartist_sort::^'+ selections[selectionName])
    .then(r => r.json())
    .then(albums => {
      return {
        albums: albums.results,
        selectionName: selectionName
      }
    })
}
