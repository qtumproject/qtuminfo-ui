import * as QtuminfoAPI from '@/services/qtuminfo-api'

function formatTimestamp(date) {
  let yyyy = date.getUTCFullYear().toString()
  let mm = (date.getUTCMonth() + 1).toString().padStart(2, '0')
  let dd = date.getUTCDate().toString().padStart(2, '0')
  return yyyy + '-' + mm + '-' + dd
}

class Block {
  static get(id) {
    return QtuminfoAPI.get(`/block/${id}`)
  }

  static getRecentBlocks(size = 10) {
    return QtuminfoAPI.get('/recent-blocks')
  }

  static async getBlocksByDate(date = new Date()) {
    let {blocks} = await QtuminfoAPI.get('/blocks', {
      params: {blockDate: formatTimestamp(date)}
    })
    return blocks
  }
}

export default Block
