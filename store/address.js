export const state = () => ({
  myAddresses: []
})

export const mutations = {
  'my-addresses/add'(state, addresses) {
    if (!Array.isArray(addresses)) {
      addresses = [addresses]
    }
    for (let address of addresses) {
      if (!state.myAddresses.includes(address)) {
        state.myAddresses.push(address)
      }
    }
    state.myAddresses.sort()
    localStorage.setItem('my-addresses', state.myAddresses.join(','))
  },
  'my-addresses/remove'(state, addresses) {
    if (!Array.isArray(addresses)) {
      addresses = [addresses]
    }
    for (let address of addresses) {
      let index = state.myAddresses.indexOf(address)
      if (index >= 0) {
        state.myAddresses.splice(index, 1)
      }
    }
    localStorage.setItem('my-addresses', state.myAddresses.join(','))
  },
  'my-addresses/clear'(state) {
    state.myAddresses = []
    localStorage.removeItem('my-addresses')
  }
}
