import axios from 'axios'
import {ExtendableError} from '@/utils/error'

class RequestError extends ExtendableError {
  constructor(message, code) {
    super(message)
    this.code = code
  }
}

const resource = axios.create({baseURL: process.env.qtumscanAPIBase})

function request(...args) {
  return resource.request(...args)
}

function get(...args) {
  return resource.get(...args).then(response => {
    if (response.status === 200) {
      return response.data
    } else {
      return Promise.reject(new RequestError(response.statusText, response.status))
    }
  })
}

function post(...args) {
  return resource.post(...args).then(response => {
    if (response.status === 200) {
      return response.data
    } else {
      return Promise.reject(new RequestError(response.statusText, response.status))
    }
  })
}

export {resource as default, request, get, post, RequestError}
