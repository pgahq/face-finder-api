import axios from "axios";

export class ComprefaceService {
    private host: string
    private api_key: string
    private base_url: string
    constructor(host, api_key) {
        this.host = host;
        this.api_key = api_key
        this.base_url = 'api/v1/recognition/faces'
    }

    fullUrl(): string {
        return `${this.host}/${this.base_url}`;
    }

    formDataHeader(bodyFormData) {
        let headers = bodyFormData.getHeaders()
        headers["x-api-key"] = this.api_key;
        return headers
    }

    async addExample(bodyFormData, subject, options): Promise<string> {
        let params = {subject: subject};
        params = {...params, ...options};
        return new Promise( async (resolve, reject) => {
            try {
                const response = await axios.post(this.fullUrl(), bodyFormData, {headers: this.formDataHeader(bodyFormData), params: params})
                resolve(response.data.image_id)
            } catch (error) {
                reject(error.response.data.message);
            };
        });
    }

    async verify(bodyFormData, image_id, options): Promise<any> {
        let url = `${this.fullUrl()}/${image_id}/verify`;
        return new Promise( async (resolve, reject) => {
            try {
                const response = await axios.post(url, bodyFormData, {headers: this.formDataHeader(bodyFormData), params: options})
                resolve(response.data.result)
            } catch (error) {
                reject(error.response.data.message);
            };
        });
    }
}