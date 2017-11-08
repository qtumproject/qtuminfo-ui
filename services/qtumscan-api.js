import axios from 'axios'

const resource = axios.create({baseURL: process.env.qtumscanAPIBase})

function request(...args) {
  return resource.request(...args)
}

function get(...args) {
  return resource.get(...args).then(response => {
    if (response.status === 200) {
      return response.data
    } else {
      return Promise.reject(response)
    }
  })
}

function post(...args) {
  return resource.post(...args).then(response => {
    if (response.status === 200) {
      return response.data
    } else {
      return Promise.reject(response)
    }
  })
}

export default resource
export {reqeust, get, post}
