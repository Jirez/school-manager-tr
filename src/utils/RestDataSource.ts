//import React from 'react';
import Axios from 'axios'
import type { Method, ResponseType } from 'axios'
//import config from '../../public/configuration.json';
//import {connect} from "react-redux";

/*const config = {
    serverAddress: `localhost`,
    serverPort: 8080,
    apachePort: 80,
    picturePath: '/root/'
};*/

const config = await fetch('/configuration.json').then((res) => res.json())

class RestDataSource {
  private locale: any
  private readonly BASE_URL: string

  constructor(locale?: any) {
    this.BASE_URL = `${config?.httpProtocol}://${config?.serverAddress}:${config?.serverPort}/api`
    this.locale = locale
  }

  async get(path: string, callback: Function) {
    await this.sendRequest('get', `${this.BASE_URL}/${path}`, callback)
  }

  async getPdf(path: string, callback: Function) {
    return this.sendPdfRequest(
      'get',
      `${this.BASE_URL}/${path}`,
      callback,
      null,
      'arraybuffer',
    )
  }

  async post(path: string, data: any, callback: Function) {
    await this.sendRequest('post', `${this.BASE_URL}/${path}`, callback, data)
  }

  async put(path: string, data: any, callback: Function) {
    await this.sendRequest('put', `${this.BASE_URL}/${path}`, callback, data)
  }

  async delete(path: string, data: any, callback: Function) {
    await this.sendRequest('delete', `${this.BASE_URL}/${path}`, callback, data)
  }

  async upload(path: string, data: any, callback: Function) {
    return this.sendFile('POST', `${this.BASE_URL}/${path}`, callback, data)
  }

  async sendRequest(
    method: Method,
    url: string,
    callback: Function,
    data?: any,
  ) {
    try {
      callback(
        (
          await Axios.request({
            method: method,
            url: url,
            data: data,
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
              'Accept-Language': this.locale,
            },
          })
        ).data,
      )
    } catch (e) {
      console.log(e)
    }
  }

  async sendPdfRequest(
    method: Method,
    url: string,
    callback: Function,
    data?: any,
    responseType?: ResponseType,
  ) {
    //try {
    callback(
      (
        await Axios.request({
          method: method,
          url: url,
          data: data,
          responseType: responseType,
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/pdf',
            'Accept-Language': this.locale,
          },
        })
      ).data,
    )
    /*} catch (e) {
            console.log(e);
        }*/
  }

  async sendFile(method: Method, url: string, callback: Function, data: any) {
    //try {
    callback(
      (
        await Axios.request({
          method: method,
          url: url,
          data: data,
          headers: {
            'content-type': 'multipart/form-data',
          },
        })
      ).data,
    )
    // } catch (e) {
    //message('Error', 5);
    //console.log(e)
    // }
  }

  async uploadFile(url: string, file: any, title: string, details: string) {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('title', title)
    formData.append('details', details)

    await Axios.request({
      method: 'POST',
      url: `${this.BASE_URL}/${url}`,
      data: formData,
      headers: {
        'content-type': 'multipart/form-data',
      },
    }).then(this.handleErrors)
  }

  handleErrors(response: any) {
    if (!(response.status === 200 || response.status === 204)) {
      return response
        .json()
        .then((response: any) => {
          return Promise.reject({
            code: response.status,
            message: response.message,
          })
        })
        .catch((err: any) => {
          throw err
        })
    } else {
      return response.status === 200
        ? response.json()
        : new Promise(function (resolve, reject) {
            resolve(null)
          })
    }
  }
}

export default RestDataSource
