/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface CompoundResponseDto {
  id: number;
  title: string;
  imageUrl: string | null;
  videoUrl: string | null;
  formula: string;
  description_eng: string;
  description_rus: string;
  specificH2oVolume: number;
  specificCo2Volume: number;
  class: string;
}

export interface CreateCompoundDto {
  title?: string;
  formula?: string;
  class?: string;
  description_eng?: string;
  description_rus?: string;
  /** @min 0 */
  specificH2oVolume?: number;
  /** @min 0 */
  specificCo2Volume?: number;
}

export interface UserRequestDto {
  /** @minLength 3 */
  name: string;
  /** @minLength 6 */
  password: string;
}

export interface UserResponseDto {
  name: string;
  isExpert: boolean;
}

export interface CombustionDraftBriefDto {
  combustionId: number | null;
  compoundsCount: number;
}

export interface CombustionListResponseDto {
  id: number;
  technicianName: string;
  expertName: string | null;
  status: string;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  formedAt: string | null;
  /** @format date-time */
  completedAt: string | null;
  h2oVolume: number | null;
  co2Volume: number | null;
  sampleDescription: string | null;
  resultsCount: number;
}

export interface CompoundInCombustionDto {
  id: number;
  title: string;
  imageUrl: string | null;
  specificH2oVolume: number;
  specificCo2Volume: number;
  comment: string | null;
  amount: number | null;
}

export interface CombustionSingleResponseDto {
  id: number;
  technicianId: number;
  expertId: number | null;
  status: string;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  formedAt: string | null;
  /** @format date-time */
  completedAt: string | null;
  h2oVolume: number | null;
  co2Volume: number | null;
  sampleDescription: string | null;
  compounds: CompoundInCombustionDto[];
}

export interface UpdateCombustionDto {
  sampleDescription?: string;
  /** @min 0 */
  co2Volume?: number;
  /** @min 0 */
  h2oVolume?: number;
}

export interface CompleteCombustionDto {
  action: "approve" | "reject";
}

export interface CompoundCombustionResponseDto {
  id: number;
  combustionId: number;
  compoundId: number;
  comment: string | null;
  amount: number | null;
}

export interface UpdateCompoundCombustionDto {
  comment: string;
}

import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || "",
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem),
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== "string"
    ) {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title BurnCalc API
 * @version 1.0.0
 * @contact
 *
 * Сессионная аутентификация. После login скопируйте sessionId из Set-Cookie и вставьте в Authorize → Cookie.
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  api = {
    /**
     * No description
     *
     * @tags compounds
     * @name CompoundControllerFindAll
     * @request GET:/api/compounds
     */
    compoundControllerFindAll: (
      query?: {
        search?: string;
        class?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<CompoundResponseDto[], CompoundResponseDto[]>({
        path: `/api/compounds`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags compounds
     * @name CompoundControllerCreate
     * @request POST:/api/compounds
     */
    compoundControllerCreate: (
      data: CreateCompoundDto,
      params: RequestParams = {},
    ) =>
      this.request<CompoundResponseDto, any>({
        path: `/api/compounds`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags compounds
     * @name CompoundControllerFindById
     * @request GET:/api/compounds/{id}
     */
    compoundControllerFindById: (id: number, params: RequestParams = {}) =>
      this.request<CompoundResponseDto, CompoundResponseDto>({
        path: `/api/compounds/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name UserControllerRegister
     * @request POST:/api/users/register
     */
    userControllerRegister: (
      data: UserRequestDto,
      params: RequestParams = {},
    ) =>
      this.request<UserResponseDto, any>({
        path: `/api/users/register`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name UserControllerAuth
     * @request POST:/api/users/login
     */
    userControllerAuth: (data: UserRequestDto, params: RequestParams = {}) =>
      this.request<UserResponseDto, any>({
        path: `/api/users/login`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name UserControllerLogout
     * @request POST:/api/users/logout
     */
    userControllerLogout: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/users/logout`,
        method: "POST",
        ...params,
      }),

    /**
     * No description
     *
     * @tags combustions
     * @name CombustionControllerGetCombustionIcon
     * @request GET:/api/combustions/draft-brief
     */
    combustionControllerGetCombustionIcon: (params: RequestParams = {}) =>
      this.request<CombustionDraftBriefDto, CombustionDraftBriefDto>({
        path: `/api/combustions/draft-brief`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags combustions
     * @name CombustionControllerFindAll
     * @request GET:/api/combustions
     */
    combustionControllerFindAll: (
      query?: {
        status?: string;
        formedAtFrom?: string;
        formedAtTo?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<CombustionListResponseDto[], CombustionListResponseDto[]>({
        path: `/api/combustions`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags combustions
     * @name CombustionControllerUpdate
     * @request PUT:/api/combustions
     */
    combustionControllerUpdate: (
      data: UpdateCombustionDto,
      params: RequestParams = {},
    ) =>
      this.request<CombustionSingleResponseDto, any>({
        path: `/api/combustions`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags combustions
     * @name CombustionControllerRemove
     * @request DELETE:/api/combustions
     */
    combustionControllerRemove: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/combustions`,
        method: "DELETE",
        ...params,
      }),

    /**
     * No description
     *
     * @tags combustions
     * @name CombustionControllerFindById
     * @request GET:/api/combustions/{id}
     */
    combustionControllerFindById: (id: number, params: RequestParams = {}) =>
      this.request<CombustionSingleResponseDto, CombustionSingleResponseDto>({
        path: `/api/combustions/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags combustions
     * @name CombustionControllerForm
     * @request PUT:/api/combustions/form
     */
    combustionControllerForm: (params: RequestParams = {}) =>
      this.request<CombustionListResponseDto, any>({
        path: `/api/combustions/form`,
        method: "PUT",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags combustions
     * @name CombustionControllerComplete
     * @request PUT:/api/combustions/{id}/complete
     */
    combustionControllerComplete: (
      id: number,
      data: CompleteCombustionDto,
      params: RequestParams = {},
    ) =>
      this.request<CombustionListResponseDto, any>({
        path: `/api/combustions/${id}/complete`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags compounds-combustions
     * @name CompoundCombustionControllerAddToCombustion
     * @request POST:/api/compounds-combustions/{compoundId}
     */
    compoundCombustionControllerAddToCombustion: (
      compoundId: number,
      params: RequestParams = {},
    ) =>
      this.request<CompoundCombustionResponseDto, any>({
        path: `/api/compounds-combustions/${compoundId}`,
        method: "POST",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags compounds-combustions
     * @name CompoundCombustionControllerUpdateInCombustion
     * @request PUT:/api/compounds-combustions/{compoundId}
     */
    compoundCombustionControllerUpdateInCombustion: (
      compoundId: number,
      data: UpdateCompoundCombustionDto,
      params: RequestParams = {},
    ) =>
      this.request<CompoundCombustionResponseDto, any>({
        path: `/api/compounds-combustions/${compoundId}`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags compounds-combustions
     * @name CompoundCombustionControllerRemoveFromCombustion
     * @request DELETE:/api/compounds-combustions/{compoundId}
     */
    compoundCombustionControllerRemoveFromCombustion: (
      compoundId: number,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/compounds-combustions/${compoundId}`,
        method: "DELETE",
        ...params,
      }),
  };
}
