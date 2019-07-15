import axios from 'axios'
import {ExtendableError} from '@/utils/error'

export class RequestError extends ExtendableError {
  constructor(message, code) {
    super(message)
    this.code = code
  }
}

const resource = axios.create({baseURL: process.env.qtuminfoAPIBase})
export default resource

export function request(...args) {
  return resource.request(...args)
}

export async function get(url, {params, ip} = {}) {
  try {
    let response = await resource.get(url, {
      params,
      ...(ip ? {headers: {'X-Forwarded-For': ip}} : {})
    })
    return response.data
  } catch (err) {
    throw new RequestError(err.response.statusText, err.response.status)
  }
}

export async function post(url, data, {ip} = {}) {
  try {
    let response = await resource.post(url, data, {
      ...(ip ? {headers: {'X-Forwarded-For': ip}} : {})
    })
    return response.data
  } catch (err) {
    throw new RequestError(err.response.statusText, err.response.status)
  }
}
