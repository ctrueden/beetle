
function getPlaylistName({user, playlist}) {
  if (user && playlist) {
    return playlist + '@' + user
  }
  return ''
}

export default {
  getPlaylistName : getPlaylistName
}
