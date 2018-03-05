import * as QtuminfoAPI from '@/services/qtuminfo-api'

function formatTimestamp(date) {
  let yyyy = date.getFullYear().toString()
  let mm = (date.getMonth() + 1).toString().padStart(2, '0')
  let dd = date.getDate().toString().padStart(2, '0')
  return yyyy + '-' + mm + '-' + dd
}

class Block {
  static get(id) {
    return QtuminfoAPI.get(`/block/${id}`)
  }

  static getRecentBlocks(size = 10) {
    return QtuminfoAPI.get('/recent-blocks')
  }

  static getBlocksByDate(date = new Date()) {
    return QtuminfoAPI.get('/blocks', {params: {date: formatTimestamp(date)}})
  }
}

export default Block
