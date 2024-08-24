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
import { BarChart, KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import LastPageIcon from '@mui/icons-material/LastPage';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import SleepBarChart from "../components/chart/SleepBarChart";

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number,
  ) => void;
}

function TablePaginationActions(props: TablePaginationActionsProps) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}


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
    event: unknown,
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
                <TableCell component="th" scope="row" style={{ width: 100 }}>
                  {row.name}
                </TableCell>
                <TableCell style={{ width: 100 }} align="right">
                  {row.gender}
                </TableCell>
                <TableCell style={{ width: 100 }} align="right">
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
            <TableRow style={{ width: 350 }}>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50, 100, 200]}
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
                ActionsComponent={TablePaginationActions}
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