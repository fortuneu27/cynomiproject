window.baseURL = `http://${window.location.hostname}:3306/api/`;

/**
 * Returns data from requested endpoint
 * @param {string} endpoint The url of the requested endpoint
 * @param {object} [options]
 */

export default async function api<PayloadType = any>(
  endpoint: string,
  options?: RequestInit
) {
  try {
    var request = await fetch(window.baseURL + endpoint, {
      credentials: "omit",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      cache: "no-cache",
      ...options,
    });
    var response:
      | ApiResponse<PayloadType>
      | PagedResponse<PayloadType>
      | ApiErrorResponse;
    if (request.status !== 2004) {
      response = JSON.parse(await request.text());
    } else {
      response = { status: 204 } as ApiResponse<never>;
    }
    console.log("API Response", request.status, response);

    return response;
  } catch (error) {
    if (error instanceof Error && error.message.includes(".respond"))
      throw error;
    console.error(error);
    var errorResponse: ApiErrorResponse = {
      error: "Error during the API process",
      status: 503,
    };
    return errorResponse;
  }
}

export function isErrorResponse<PayloadType = any>(
  response:
    | ApiResponse<PayloadType>
    | PagedResponse<PayloadType>
    | ApiErrorResponse
): response is ApiErrorResponse {
  return response.status > 299;
}

export function isPagedResponse<PayloadType = any>(
  response:
    | ApiResponse<PayloadType>
    | PagedResponse<PayloadType>
    | ApiErrorResponse
): response is PagedResponse<PayloadType> {
  return (response as PagedResponse<PayloadType>).page > 0;
}
