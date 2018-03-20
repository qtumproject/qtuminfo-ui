import * as QtuminfoAPI from '@/services/qtuminfo-api'

class Misc {
  static richList({from, to}, options = {}) {
    return QtuminfoAPI.get(`/misc/rich-list`, {params: {from, to}, ...options})
  }

  static biggestMiners({from, to}, options = {}) {
    return QtuminfoAPI.get(`/misc/biggest-miners`, {params: {from, to}, ...options})
  }
}

export default Misc
