import * as React from "react";
import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box';
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableFooter from '@mui/material/TableFooter'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import PaperSheet from "../components/common/PaperSheet"
import api, { isErrorResponse, isPagedResponse } from "../api";
import { Alert, Button, Divider, Grid, IconButton, Paper, Snackbar, Typography } from "@mui/material";
import { BarChart } from "@mui/icons-material";
import SleepBarChart from "../components/chart/SleepBarChart";


export default function SleepScheduleList(){
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(5)
  const [total, setTotal] = React.useState(0)
  const [data, setData] = React.useState<SleepChart[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState('')
  const [showError, setShowError] = React.useState(false)
  const [selectedName, setSelectedName] = React.useState('')
  const [showChart, setShowChart] = React.useState(false)

   async function getData () {
    setIsLoading(true)

    var dataResquest = await api<SleepChart[]>(`/sleepChart?page=${page}&pageSize=${rowsPerPage}`, { method: 'GET' })
    setIsLoading(false)
    if(isErrorResponse(dataResquest)) {
      setError(dataResquest.error)
      setShowError(true)
      return
    } 
    if(!isPagedResponse(dataResquest)) {
      return
    }else{
      setData(dataResquest.payload)
      setTotal(dataResquest.total)
    } 
  }

  React.useEffect(() => {
    (async () => await getData())()
  }, [page, rowsPerPage])

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleToggleShowChart = () => {
    setShowChart(!showChart)
  }

  const handleSelectNameAndShowChart = (name: string) => {
    setSelectedName(name)
    handleToggleShowChart()
  }

  const handleToggleShowError = () => {
    setShowError(!showError)
  }

  return (
    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', marginTop: '65px' }}>
      <Grid container justifyContent={"space-between"} alignItems={"center"}>
        <Grid>
          <Typography
            variant="h5"
            style={{ paddingBottom: 10, textAlign: "left" }}
          >
            Sleep Schedule List
          </Typography>
        </Grid>
      </Grid>
      <Divider style={{ marginBottom: 20 }} />
      {showChart ? 
      <React.Fragment>
        <SleepBarChart name={selectedName} />
        <Button fullWidth onClick={handleToggleShowChart}>Back to Table</Button>
      </React.Fragment>
      :
      <React.Fragment>
        <Table sx={{ minWidth: 500 }} aria-label="sleep schedule list">
          <TableBody>
            {(rowsPerPage > 0
              ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : data
            ).map((row) => (
              <TableRow key={row.name}>
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell style={{ width: 160 }} align="right">
                  {row.gender}
                </TableCell>
                <TableCell style={{ width: 160 }} align="right">
                  {row.count}
                </TableCell>
                <TableCell style={{ width: 50 }} align="right">
                  <IconButton aria-label="Chart" onClick={() => handleSelectNameAndShowChart(row.name)}>
                    <BarChart />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                colSpan={3}
                count={total}
                rowsPerPage={rowsPerPage}
                page={page}
                slotProps={{
                  select: {
                    inputProps: {
                      'aria-label': 'rows per page',
                    },
                    native: true,
                  },
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableRow>
          </TableFooter>
        </Table>
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
      </React.Fragment>}
    </Paper>
  )
}