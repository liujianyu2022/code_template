import axios, { type AxiosResponse } from "axios";
import store from "../store/store";
import { AppAction } from "../types/ReducerTypes";
import { CustomResponseType } from "@/types/ResponseType";

const request = axios.create({
    // ToDo
    baseURL: "http://127.0.0.1:8080/",

    // ToDo
    // baseURL: "https://xxx.xxx.xxx/",

    timeout: 100000,
})

// 定义白名单：哪些接口不需要 token
const whiteList = [
    "/api/login",
    "/api/register",
]

request.interceptors.request.use((config) => {
    store.dispatch({
        type: AppAction.LOADINGCHANGE,
        payload: {
            isLoading: true
        }
    })

    const token = localStorage.getItem("userToken")

    // 如果请求在白名单里，直接放行
    if (config.url && whiteList.some(api => config.url!.includes(api))) {
        return config
    }

    // 其他请求必须带 token
    if (!token) {
        store.dispatch({
            type: AppAction.LOADINGCHANGE,
            payload: { isLoading: false }
        })
        return Promise.reject(new Error("No token, request canceled"))
    }

    config.headers.Authorization = "Bearer " + token
    return config

}, (error) => {

    store.dispatch({
        type: AppAction.LOADINGCHANGE,
        payload: {
            isLoading: false
        }
    })
    return Promise.reject(error);
})

request.interceptors.response.use((response: AxiosResponse<CustomResponseType>) => {
    store.dispatch({
        type: AppAction.LOADINGCHANGE,
        payload: {
            isLoading: false
        }
    })

    return response
}, (error) => {
    store.dispatch({
        type: AppAction.LOADINGCHANGE,
        payload: {
            isLoading: false
        }
    })
    return Promise.reject(error);
})

export default request