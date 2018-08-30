self.addEventListener('notificationclick', event => {
  event.notification.close()
  let tag = event.notification.tag
  let url = '/'
  if (tag.startsWith('block/')) {
    url = '/tx/' + tag.slice('block/'.length)
  } else if (tag.startsWith('transaction/')) {
    url = '/tx/' + tag.slice('transaction/'.length)
  }
  event.waitUntil(self.clients.openWindow(url))
})
