export default function(req, res, next) {
  req.ip = req.headers['cf-connecting-ip']
      || req.headers['x-forwarded-for']
      || req.connection.remoteAddress
      || req.socket.remoteAddress
      || req.connection.socket.remoteAddress
  next()
}
