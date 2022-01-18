import axios, { AxiosRequestHeaders, AxiosInstance } from 'axios';

export class K8sApiUtils {
  axiosInstance: AxiosInstance;

  constructor(baseURL: string, headers: AxiosRequestHeaders) {
    this.axiosInstance = axios.create({
      baseURL: baseURL,
      headers: headers,
    });
  }

  async getPods(namespace: string) {
    const response = await this.axiosInstance.get(`api/v1/namespaces/${namespace}/pods`);
    if (response.status != 200) {
      throw new Error(`error in response. Code: ${response.status}`);
    }
    console.log(response.data);
    return response.data;
  }

  async getHelloWorlds(namespace: string) {
    const response = await this.axiosInstance.get(`apis/webapp.appstudio.qe/v1/namespaces/${namespace}/contracttests`);
    if (response.status != 200) {
      throw new Error(`error in response. Code: ${response.status}`);
    }
    console.log(response.data);
    return response.data;
  }
}
