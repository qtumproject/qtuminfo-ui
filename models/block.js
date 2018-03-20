import * as QtuminfoAPI from '@/services/qtuminfo-api'

function formatTimestamp(date) {
  let yyyy = date.getFullYear().toString()
  let mm = (date.getMonth() + 1).toString().padStart(2, '0')
  let dd = date.getDate().toString().padStart(2, '0')
  return yyyy + '-' + mm + '-' + dd
}

class Block {
  static get(id, options = {}) {
    return QtuminfoAPI.get(`/block/${id}`, options)
  }

  static getRecentBlocks(options = {}) {
    return QtuminfoAPI.get('/recent-blocks', options)
  }

  static getBlocksByDate(date = new Date(), options = {}) {
    return QtuminfoAPI.get('/blocks', {params: {date: formatTimestamp(date)}, ...options})
  }
}

export default Block
