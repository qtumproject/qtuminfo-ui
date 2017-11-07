import axios from 'axios'

const QtumscanAPI = axios.create({
  baseURL: process.env.qtumscanAPIBase
})

export default QtumscanAPI
