import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { JsonpOptions } from "@/request/http.service";
export declare class HttpService {
  private readonly instance;
  constructor(instance?: AxiosInstance);
  request<T = any>(config: AxiosRequestConfig): Promise<AxiosResponse<T>>;
  get<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>>;
  post<T = any>(
    url: string,
    data?: object,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>>;
  postFormData<T = any>(
    url: string,
    data?: object,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>>;
  postMultipartData<T = any>(
    url: string,
    formData: object
  ): Promise<AxiosResponse<T>>;
  jsonp(
    url: string,
    opts: JsonpOptions | null,
    fn: (err: Error, data: any) => void
  ): void;
}
