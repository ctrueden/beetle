// about the queue in fact
export default class playlist {
  constructor () {
    this.idIndex = 0
    this.queue = []
    this.paused = true
    this.playingIndex = undefined

    this.playStateListeners = []
    this.playlistListeners = []
  }

  // Controlling the queue
  add (item, index=this.queue.length) {
    const songid = this.getFreshId()
    const obj = {
      uri: item.id,
      songid: songid,
      item: item
    }

    this.queue.splice(index, 0, obj)
    this.emitPlaylistUpdate()
    return obj
  }

  clear () {
    this.stop()
    this.queue = []
    this.emitPlaylistUpdate()
  }

  delete (index) {
    const obj = this.queue.splice(index, 1)[0]
    if (index === this.playingIndex) {
      this.stop()
    } else if (index < this.playingIndex) {
      this.playingIndex--
    }
    this.emitPlaylistUpdate()
    return obj
  }
  
  deleteid (songid) {
    const index = this.queue.findIndex(obj => obj.songid === songid)
    if (index !== -1) {
      return this.delete(index)
    }
  }

  // Controlling playback

  next () {
    if (this.playingIndex !== undefined) {
      if (this.playingIndex < this.queue.length - 1) {
        this.playingIndex++
        return this.pause(false)
      }
    }
  }

  pause (paused) {
    if (!paused &&
      this.playingIndex === undefined) {
      this.playingIndex = (this.queue.length) ? 0 : undefined
    }
    this.paused = (this.playingIndex !== undefined) ? paused : true
    return this.emitPlayStateUpdate()
  }

  playid (songid) {
    this.playingIndex = this.queue.findIndex(obj => obj.songid === songid)
    return this.pause(false)
  }

  previous () {
    if (this.playingIndex !== undefined) {
      if (this.playingIndex > 0) {
        this.playingIndex--
        return this.pause(false)
      }
    }
  }

  stop () {
    this.playingIndex = undefined
    return this.pause(true)
  }

  emitPlayStateUpdate() {
    for (let f of this.playStateListeners) {
      f({
        paused: this.paused,
        current: (this.playingIndex !== undefined) ? this.queue[this.playingIndex] : undefined
      })
    }
  }

  registerPlayStateListener (f) {
    this.playStateListeners.push(f)
  }

  emitPlaylistUpdate () {
    for (let f of this.playlistListeners) {
      f(this.queue)
    }
  }

  registerPlaylistListener (f) {
    this.playlistListeners.push(f)
  }

  getFreshId () {
    return this.idIndex++
  }
}
