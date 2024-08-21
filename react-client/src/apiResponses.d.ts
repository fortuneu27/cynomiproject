interface ApiResponse<PayloadType = any> {
  status: number;
  payload: PayloadType;
}

interface PagedResponse<PayloadType> extends ApiResponse<PayloadType> {
  page: number;
  pageCount: number;
  pageSize: number;
  total: number;
}

interface ApiErrorResponse {
  status: number;
  error: string;
  payload?: any;
}

// Payload types:

interface SleepSchedule {
  id: number;
  name: string;
  gender: string;
  sleepDateTime: number;
  sleepDuration: number
}

interface SleepChart {
  name: string
  gender: string
  count: number
}

interface SleepBarChartItem {
  date: string
  sleepDuration: number
}
