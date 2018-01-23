import * as QtuminfoAPI from '@/services/qtuminfo-api'

function formatTimestamp(date) {
  let yyyy = date.getUTCFullYear().toString()
  let mm = (date.getUTCMonth() + 1).toString().padStart(2, '0')
  let dd = date.getUTCDate().toString().padStart(2, '0')
  return yyyy + '-' + mm + '-' + dd
}

class Block {
  static get(hash) {
    return QtuminfoAPI.get(`/block/${hash}`)
  }

  static async getHash(height) {
    let {blockHash} = await QtuminfoAPI.get(`/block-index/${height}`)
    return blockHash
  }

  static async getRecentBlocks(size = 10) {
    let {blocks, currentTs} = await QtuminfoAPI.get('/blocks', {params: {limit: size}})
    if (blocks.length < size) {
      let {block: additionalBlocks} = await QtuminfoAPI.get('/blocks', {
        params: {
          limit: size - blocks.length,
          blockDate: formatTimestamp(new Date(currentTs * 1000))
        }
      })
      blocks.push(...additionalBlocks)
    }
    return blocks
  }
}

export default Block
