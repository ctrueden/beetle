export default class RandomItem {

  constructor(maxItemId) {
    this.maxItemId = maxItemId
    this.maxDepth = 20
  }

  getOne() {
    return  RandomItem.fetchItem(this.randomItemIndex())
      .then(item => (item) ? item : this.getOne())
  }

  getSimilarOne(item, bestCandidate, depth) {
    if (depth === undefined)
      depth = 0

    if (depth > 10)
      return Promise.resolve(bestCandidate)

    return this.getOne()
      .then(candidate => {
        let similarity = RandomItem.similarity(item, candidate)
        console.log(candidate.title, similarity)

        if (similarity == 1)
          return Promise.resolve(candidate)

        let bestSimilarity = (bestCandidate) ? RandomItem.similarity(item, bestCandidate) : 0
        if (!bestCandidate || similarity > bestSimilarity) {
          bestCandidate = candidate
        }
        
        return this.getSimilarOne(item, bestCandidate, ++depth)
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

  static similarity(item1, item2) {
    if (!item1.genre || !item2.genre)
      return 0
    const genres1 = item1.genre.split(',').map(g => g.trim())
    const genres2 = item2.genre.split(',').map(g => g.trim())
    let score = 0

    for (let genre1 of genres1) {
      for (let genre2 of genres2) {
        if (genre1.includes(genre2))
          score +=0.5
        if (genre2.includes(genre1))
          score +=0.5
      }
    }
    score = score / Math.max(genres1.length, genres2.length)
    score = Math.min(score, 1)
    console.log(genres1, genres2, score)

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
        return 2 * stats.items
      })
  }
}
