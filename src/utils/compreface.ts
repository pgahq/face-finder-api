import axios from 'axios';
import * as FormData from 'form-data';

export class ComprefaceService {
  private host: string;
  private apiKey: string;
  private baseUrl: string;
  constructor(host, apiKey) {
    this.host = host;
    this.apiKey = apiKey;
    this.baseUrl = 'api/v1/recognition/faces';
  }

  fullUrl(): string {
    return `${this.host}/${this.baseUrl}`;
  }

  formDataHeader(bodyFormData: FormData) {
    const headers = bodyFormData.getHeaders();
    headers['x-api-key'] = this.apiKey;
    return headers;
  }

  async addExample(
    bodyFormData: FormData,
    subjectId: number,
    options: any,
  ): Promise<string> {
    let params = { subject: subjectId };
    params = { ...params, ...options };
    return new Promise(async (resolve, reject) => {
      try {
        const response = await axios.post(this.fullUrl(), bodyFormData, {
          headers: this.formDataHeader(bodyFormData),
          params: params,
        });
        resolve(response.data.image_id);
      } catch (error) {
        reject(error.response.data.message);
      }
    });
  }

  async verify(
    bodyFormData: FormData,
    imageId: string,
    options: any,
  ): Promise<any> {
    const url = `${this.fullUrl()}/${imageId}/verify`;
    return new Promise(async (resolve, reject) => {
      try {
        const response = await axios.post(url, bodyFormData, {
          headers: this.formDataHeader(bodyFormData),
          params: options,
        });
        resolve(response.data.result);
      } catch (error) {
        reject(error.response);
      }
    });
  }
}
