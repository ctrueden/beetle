export default class RandomItem {

  constructor(maxItemId) {
    this.maxItemId = maxItemId
    this.maxDepth = 20
    this.genreFreq = {}
    this.genreMaxFreq = 1
  }

  updateGenreFreq(item) {
    if (!item.genre)
      return

    for (let genre of item.genre.split(',').map(g => g.trim())) {
      if(this.genreFreq[genre]) {
        this.genreFreq[genre]++
        if (this.genreFreq[genre] > this.genreMaxFreq)
          this.genreMaxFreq = this.genreFreq[genre]
      } else {
        this.genreFreq[genre] = 1
      }
      this.genreCardinality++
    }
  }

  getOne() {
    return  RandomItem.fetchItem(this.randomItemIndex())
      .then(item => {
        if (item) {
          this.updateGenreFreq(item)
          return item
        } else
          return this.getOne()
      })
  }

  getSimilarOne(items, bestCandidate, depth) {
    if (depth === undefined)
      depth = 0

    if (depth > this.maxDepth) {
      let genres = items.reduce((acc, it) => {
        if (it.genre) {acc = acc.concat(it.genre.split(',').map(g => g.trim()))} return acc}, [])
      console.log(bestCandidate.title, bestCandidate.genre, genres)
      return Promise.resolve(bestCandidate)
    }


    return this.getOne()
      .then(candidate => {
        let similarity = this.similarity(items, candidate)
        let genres = items.reduce((acc, it) => {
          if (it.genre) {acc = acc.concat(it.genre.split(',').map(g => g.trim()))} return acc}, [])

        let bestSimilarity = (bestCandidate) ? this.similarity(items, bestCandidate) : 0
        if (!bestCandidate || similarity > bestSimilarity) {
          bestCandidate = candidate
        }

        if (depth > 3 && bestSimilarity > 1/Math.min(genres.length, 5)) {
          console.log(bestCandidate.title, bestCandidate.genre, genres, bestSimilarity)
          return Promise.resolve(bestCandidate)
        }

        return this.getSimilarOne(items, bestCandidate, ++depth)
      })
  }
  
  getOneWithGenre(genre, depth) {
    if (depth === undefined)
      depth = 0
    return this.getOne()
      .then(item => {
        if (depth > this.maxDepth)
          return null
        if (item.genre.includes(genre)) {
          return item
        } else {
          return this.getOneWithGenre(genre, ++depth)
        }
      })
    
  }

  randomItemIndex() {
    return Math.floor(Math.random() * this.maxItemId + 1)
  }

  static fetchItem(id) {
    return fetch(process.env.BEETLE_API + `/item/${id}`)
      .then(res => {
        if (res.status == 404)
          return null
        return res.json()
      })
  }

  similarity(items, item2) {
    if (!item2.genre)
      return 0
    const genres1 = items.reduce((acc, it) => {
      if (it.genre)
        return acc.concat(it.genre.split(',').map(g => g.trim()))
      return acc
    }, [])

    const genres2 = item2.genre.split(',').map(g => g.trim())
    let score = 0

    for (let genre1 of genres1) {
      for (let genre2 of genres2) {

        if (genre1 == genre2) {
          const newScore = 1 / (1 + (this.genreFreq[genre1]/ this.genreMaxFreq))
          score += newScore
          continue
        }
      }
    }

    score = score / (genres1.length)
    return score
  }
  
  static create() {
    return RandomItem.getMaxItemId()
      .then(maxItemId => {
        return new RandomItem(maxItemId)
      })
      .catch(e => {
        console.log(e)
        return new RandomItem(100)
      })
  }

  static getMaxItemId() {
    return fetch(process.env.BEETLE_API + `/stats`)
      .then(res => res.json())
      .then(stats => {
        // it is a bloody hack ...
        return 1.5 * stats.items
      })
  }

}
