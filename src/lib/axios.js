import axios from 'axios'
import { baseURL } from '../config/index'

export const axiosInstance = axios.create({
  baseURL: baseURL,
  //即使这是一个跨域请求，我也希望你将与目标服务器域名相关的 Cookies 和 Authorization Headers 等凭据包含在请求中发送出去
  withCredentials: true
})