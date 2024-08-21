interface ApiResponse {
  status: number;
  payload: any;
  error?: string;
}

interface PagedResponse extends ApiResponse {
  page: number;
  pageCount: number;
  pageSize: number;
  total: number;
}
