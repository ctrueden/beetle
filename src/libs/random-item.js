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

  // try to find the requested number of element, it may fail
  // it ensures to return at least one item
  getSome(number) {
    return  RandomItem.fetchItems(this.randomItemIds(number))
      .then(items => {
        if (items && items.length > 0) {
          for (let item of items)
            this.updateGenreFreq(item)
          return items
        } else
          return this.getSome(number)
      })
  }
  
  getOne() {
    return this.getSome(1)
      .then(items => items[0])
  }


  
  getSimilarOne(items) {

    return this.getSome(this.maxDepth).then(candidates => {
      console.log(candidates)
      let bestCandidate
      let bestSimilarity = 0

      for (let candidate of candidates) {
        let similarity = this.similarity(items, candidate)

        if (similarity > bestSimilarity) {
          bestCandidate = candidate
          bestSimilarity = similarity
        }

      }

      let genres = items.reduce((acc, it) => {
        if (it.genre) {acc = acc.concat(it.genre.split(',').map(g => g.trim()))} return acc}, [])
      
      console.log(bestCandidate.title, bestCandidate.artist, bestCandidate.genre, genres, bestSimilarity)
      return bestCandidate
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

  randomItemIds(number) {
    number = (number) ? number : 1
    const ids = []
    for (let i = 0; i < number; i++)
      ids.push(Math.floor(Math.random() * this.maxItemId + 1))
    return ids
  }

  static fetchItems(ids) {
    const idsString = ids.join(',')
    return fetch(process.env.BEETLE_API + `/item/${idsString}`)
      .then(res => {
        if (res.status == 404)
          return null
        return res.json()
          .then(data => {
            return (ids.length > 1) ? data.items : [data] 
          })
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
