import axios from "axios";
import { getCookie } from "cookies-next";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
});

/**
 * Reusable function to make API calls
 *
 * @param {string} url - API endpoint
 * @param {string} method - HTTP method
 * @param {object} [data] - Request body
 * @param {boolean} [useToken=true] - Whether to include the bearer token in the headers.
 * @param {object} [headers] - Request headers
 * @param {object} [params] - Request query parameters
 * @returns {Promise} - A promise that resolves with the response data or rejects with an error
 *
 */

async function apiCall(
  url: string,
  method: string = "GET",
  data: object | null = null,
  useToken: boolean = true,
  headers: Record<string, string | number> = {},
  params?: object
) {
  try {
    const token = getCookie("accessToken");
    const requestHeaders = headers || {};
    if (useToken && token) {
      requestHeaders.Authorization = `Bearer ${token}`;
    }

    const response = await api({
      url,
      method,
      data,
      headers: requestHeaders,
      params,
    });

    return response;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      //handle axios specific errors
      if (error.response) {
        console.error("API Error (Response): ", error.response);
        return {
          status: error.response.status,
          data: error.response.data,
        };
      } else if (error.request) {
        //handle network errors
        console.error("API Error (Request):", error.request);
        throw {
          status: 500,
          data: { message: "Network Error: No response received." },
        };
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("API Error (Setup):", error.message);
        throw {
          status: 500,
          data: { message: error.message || "API Error" },
        };
      }
    } else {
      // Handle non-Axios errors
      console.error("Non-Axios Error:", error);
      throw {
        status: 500,
        data: {
          message:
            error instanceof Error
              ? error.message
              : "An unexpected error occurred.",
        },
      };
    }
  }
}
export default apiCall;
