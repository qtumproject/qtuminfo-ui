export default {
  render(createElement) {
    return createElement('div')
  },
  fetch({redirect}) {
    redirect(302, '/misc/rich-list')
  }
}
