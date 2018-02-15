import * as QtuminfoAPI from '@/services/qtuminfo-api'

class Misc {
  static richList() {
    return QtuminfoAPI.get(`/misc/rich-list`)
  }
}

export default Misc
