import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart'
import api, { isErrorResponse } from '../../api';
import { Alert, Snackbar } from '@mui/material';

interface Props{
  name: string
}

const chartSetting = {
  yAxis: [
    {
      label: 'sleep duration(hrs)',
    },
  ],
  xAxis: [
    {
      label: 'date'
    }
  ],
  width: 500,
  height: 400,
}

export default function SleepBarChart(props: Props) {
  const [chartData, setChartData] = React.useState<{date: string, sleepDuration: number}[]>([])
  const [error, setError] = React.useState('')
  const [showError, setShowError] = React.useState(false)

  async function getData() {
    var response = await api<SleepBarChartItem[]>(`/sleepSchedule/chart/${props.name}`, { method: 'GET' })
    if(isErrorResponse(response)) {
      setError(response.error)
      setShowError(true)
      return
    } else {
      setChartData(response.payload)
    }
  }

  React.useEffect(() =>{
    ( async () => {
      var response = await api<SleepBarChartItem[]>(`/sleepSchedule/chart/${props.name}`, { method: 'GET' })
      if(isErrorResponse(response)) {
        setError(response.error)
        setShowError(true)
        return
      } else {
        setChartData(response.payload)
      }
    })()
  }, [props.name])

  const handleToggleShowError = () => {
    setShowError(!showError)
  }

  return (
    <React.Fragment>
      <BarChart
        dataset={chartData}
        xAxis={[{ scaleType: 'band', dataKey: 'date'}]}
        series={[{dataKey: 'sleepDuration', label: props.name + ' sleep'}]}
        width={500}
        height={300}
      />
      <Snackbar open={showError} autoHideDuration={6000}>
        <Alert
          onClose={handleToggleShowError}
          severity="error"
          variant="filled"
          sx={{ width: '100%' }}
        >
          {error}
        </Alert>
      </Snackbar>
    </React.Fragment>
  )
}