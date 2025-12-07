import { env } from '$env/dynamic/public'
import genresTree from './genres.json'

const MAX_DEPTH = 100
const TIMEOUT = 1500

export default class RandomItem {

  constructor(maxItemId) {
    this.maxItemId = maxItemId
    this.genreFreq = {}
    this.genreMaxFreq = 1
    this.genreMinFreq = 1

    // to start with wome genre frequencies
    this.getSome(MAX_DEPTH / 2)
    this.genresHierarchy = RandomItem.createHierarchy(genresTree)
  }

  getGenreFreq(genre) {
    return (this.genreFreq[genre] != null) ? this.genreFreq[genre] : this.genreMinFreq
  }

  updateGenreFreq(items) {
    for (let item of items) {
      if (!item.genre)
        continue

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

    let genreMinFreq = Infinity
    for (let genre in this.genreFreq) {
      if (genreMinFreq > this.genreFreq[genre])
        genreMinFreq = this.genreFreq[genre]
    }
    this.genreMinFreq = genreMinFreq
  }

  // try to find the requested number of element, it may fail
  // it ensures to return at least one item
  getSome(number) {
    return  RandomItem.fetchItems(this.randomItemIds(number))
      .then(items => {
        if (items && items.length > 0) {
          this.updateGenreFreq(items)
          return items
        } else
          return this.getSome(number)
      })
  }

  getOne() {
    return this.getSome(1)
      .then(items => items[0])
  }



  getSimilarOne(items, length, requiredSim, time=0, veryBestSim=0, veryBestCand) {
    const start = Date.now()
    const itemsToCompare = items.slice(-length)
    const itemIds = items.reduce((acc, item) => {acc[item.id] = true; return acc;}, {})

    return this._getSimilarOneStep(itemIds, itemsToCompare, MAX_DEPTH * requiredSim)
      .then(best => {
        time += Date.now() - start
        veryBestCand = (best.similarity > veryBestSim ) ? best.candidate : veryBestCand
        veryBestSim = Math.max(best.similarity, veryBestSim)
        if (veryBestSim > requiredSim || time > TIMEOUT) {
          console.log(veryBestCand.title, veryBestCand.artist, veryBestSim)
          return veryBestCand
        } else {
          return this.getSimilarOne(items, length, requiredSim, time, veryBestSim, veryBestCand)
        }
      })
  }

  _getSimilarOneStep(itemIds, itemsToCompare, depth) {
    return this.getSome(depth)
      .then(candidates => {
        // need to be instantiated
        let bestCandidate = candidates[0]
        let bestSimilarity = 0

        for (let candidate of candidates) {
          let similarity = this.similarity(itemsToCompare, candidate)
          if (similarity > bestSimilarity && !itemIds[candidate.id]) {
            bestCandidate = candidate
            bestSimilarity = similarity
          }
        }

        let genres = itemsToCompare.reduce((acc, it) => {
          if (it.genre) {acc = acc.concat(it.genre.split(',').map(g => g.trim()))} return acc}, [])
        //console.log("winner", bestCandidate.title, bestCandidate.artist, bestCandidate.genre, genres, bestSimilarity)
        return {similarity: bestSimilarity, candidate: bestCandidate}
      })
  }


  getOneWithGenre(genre, depth) {
    if (depth === undefined)
      depth = 0
    return this.getOne()
      .then(item => {
        if (depth > MAX_DEPTH)
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
    return fetch(env.BEETLE_API_CLIENT + `/item/${idsString}`)
      .then(res => {
        if (res.status == 404)
          return null
        return res.json()
          .then(data => {
            return (ids.length > 1) ? data.items : [data]
          })
      })
  }

  itemGenres(item) {
    if (item.genre)
      return item.genre.split(',').map(g => g.trim())
    else
      return []
  }
  
  similarity(items, item2) {
    let score = 0
    
    for (let item1 of items) {
      let itemScore = 0
      let norm = 0
      for (let genre2 of this.itemGenres(item2)) {
        norm = 0
        for (let genre1 of this.itemGenres(item1)) {
          // const newScore = 1 / (1 + (this.genreFreq[genre1]/ this.genreMaxFreq))
          const newScore = Math.pow(this.genreMinFreq / this.getGenreFreq(genre1), 2)
          itemScore += newScore * this.genreSimilarity(genre1, genre2)

          norm += newScore
        }
      }
      if (itemScore && norm)
        score += itemScore / (2*norm)
    }

    score = score / (items.length)

    // console.log(item2.title, item2.artist, item2.genre, score)

    return score
  }

  genreSimilarity(genre1, genre2) {
    let g1 = genre1
    let g2 = genre2
    let h1 = 0
    let h2 = 0

    if (g1 === g2)
      return 1

    if (!this.genresHierarchy[g1] || !this.genresHierarchy[g2]) {
      // the genres hierarchy does contain some generic types like dance, rap
      if (g1.includes(g2) || g2.includes(g1))
        return .25
      else
        return 0
    }

    while(this.genresHierarchy[g1].parent) {
      h2 = 0
      g2 = genre2
      while(this.genresHierarchy[g2].parent) {
        if (g1 === g2) {
          return 1 / Math.pow(h1 + h2 + 1, 2)
        }
        h2++
        g2 = this.genresHierarchy[g2].parent.id
      }
      h1++
      g1 = this.genresHierarchy[g1].parent.id
    }
    return 0
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
    return fetch(env.BEETLE_API_CLIENT + `/stats`)
      .then(res => res.json())
      .then(stats => {
        // it is a bloody hack ...
        return 1.5 * stats.items
      })
  }

  static createHierarchy(children) {
    const hierarchy = {}
    const ROOT = {
      id: '_ROOT',
      parent: null
    }
    hierarchy['_ROOT'] = ROOT

    const createRec = function(parent, arr) {
      for(let genre of arr) {
        let name = genre
        let nextChildren = []
        if (typeof genre !== 'string') {
          name = Object.keys(genre)[0]
          nextChildren = genre[name]
        }
        name = RandomItem.toTitleCase(name)

        hierarchy[name] = {
          id: name,
          parent: parent
        }
        createRec(hierarchy[name], nextChildren)
      }
    }

    createRec(ROOT, children)
    return hierarchy
  }

  static toTitleCase(str) {
    let toUp = true
    let arr = []
    for (let i in str) {
      if (toUp) {
        arr[i] = str[i].toUpperCase()
        toUp = false
      } else {
        arr[i] = str[i]
      }
        
      if (str[i] === ' ' || str[i] === '-')
        toUp = true
    }
    
    return arr.join('')
  }
}
