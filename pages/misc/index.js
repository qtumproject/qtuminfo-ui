export default {
  render(createElement) {
    return createElement('div')
  },
  fetch({redirect}) {
    redirect('/misc/charts')
  }
}
