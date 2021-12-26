export default class RandomItem {

  constructor(maxItemId) {
    this.maxItemId = maxItemId
  }

  getOne() {
    return  RandomItem.fetchItem(this.randomItemIndex())
      .then(item => (item) ? item : this.getOne())
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
