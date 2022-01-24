import { WazeIcon } from '@patternfly/react-icons';
import axios, { AxiosRequestHeaders, AxiosInstance } from 'axios';

export class K8sApiUtils {
  axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: 'http://127.0.0.1:8001',
      headers: {
        // Authorization: 'Bearer <token>',
      },
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

  async getNamespaces() {
    const options: any = [];
    const response = await this.axiosInstance.get(`api/v1/namespaces`);
    if (response.status != 200) {
      throw new Error(`error in response. Code: ${response.status}`);
    }
    response.data.items.forEach(element => {
      const name = element.metadata.name;
      options.push({ value: name, label: name, disabled: false },)
    });
    return options;
  }

  async getCustomResources(namespace: string) {
    const response = await this.axiosInstance.get(`apis/webapp.appstudio.qe/v1/namespaces/${namespace}/contracttests`);
    if (response.status != 200) {
      throw new Error(`error in response. Code: ${response.status}`);
    }
    console.log(response.data);
    return response.data;
  }
  async deleteCustomResource(namespace: string, name: string) {
    const response = await this.axiosInstance.delete(`apis/webapp.appstudio.qe/v1/namespaces/${namespace}/contracttests/${name}`);
    if (response.status != 200) {
      throw new Error(`error in response. Code: ${response.status}`);
    }
    console.log(response.data);
    return response;
  }
  async getCustomResourcesAll() {
    const response = await this.axiosInstance.get(`apis/webapp.appstudio.qe/v1/contracttests`);
    if (response.status != 200) {
      throw new Error(`error in response. Code: ${response.status}`);
    }
    console.log(response.data);
    return response.data;
  }

  async postCustomResource(data: any, namespace: string, name: string){
    const response = await this.axiosInstance.post(`apis/webapp.appstudio.qe/v1/namespaces/${namespace}/contracttests`, data, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }});
    if (response.status != 201) {
      throw new Error(`error in response. Code: ${response.status}`);
    }
    console.log(response.data);
    return response;
  }
}
