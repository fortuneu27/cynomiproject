import * as React from "react";
import {
  FormikProps,
  useFormik,
} from "formik";
import { Alert, Button, Divider, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Paper, Select, Snackbar, TextField, Typography } from "@mui/material";
import * as yup from "yup";
import { DateField, DateTimeField } from "@mui/x-date-pickers";
import moment, { Moment } from "moment";
import PaperSheet from "../common/PaperSheet";
import api, { isErrorResponse } from "../../api";

export interface Fields {
  name: string;
  gender: string;
  sleepDateTime: number;
  sleepDuration: number;
}

const validationSchema = yup.object({
  name: yup
    .string()
    .max(50, "Must be 50 characters or less")
    .required("Name is required"),
  gender: yup.string().required("gender is required"),
  sleepDuration: yup.number().required("Sleep Duration is required").min(0, "Cannot be less than 0")
});

export default function SleepScheduleForm() {
  const [message, setMessage] = React.useState('')
  const [isError, setIsError] = React.useState(false)
  const [showSnackbar, setShowSnackbar] = React.useState(false)

  const formik = useFormik({
    initialValues:{
      name: "",
      gender: "",
      sleepDateTime: moment().startOf('day').unix(),
      sleepDuration: 0
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      (async () => {
        var response = await api('sleepSchedule', {method: 'POST', body: JSON.stringify(values)})
        if(isErrorResponse(response)){
          setMessage(response.error)
          setIsError(true)
          return
        } else {
          setMessage('Successfully saved data!!')
          setIsError(false)
          return
        }
      })()
    },
  })

  const handleToggleShowSnackbar = () => {
    setShowSnackbar(!showSnackbar)
  }

  const handleDateChange = (date: Moment | null) => {
    var timeStamp: number
    try {
      timeStamp = date!.utc().unix()
    } catch {
      timeStamp = NaN
    }
    formik.setFieldValue('sleepDateTime',timeStamp)
  }
  return (
    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', marginTop: '65px'  }}>
      <Grid container justifyContent={"space-between"} alignItems={"center"}>
        <Grid>
          <Typography
            variant="h5"
            style={{ paddingBottom: 10, textAlign: "left" }}
          >
            Sleep Schedule Form
          </Typography>
        </Grid>
      </Grid>
      <Divider style={{ marginBottom: 20 }} />
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              fullWidth
              id="name"
              name="name"
              label="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Age</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={formik.values.gender}
                label="Age"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.gender && Boolean(formik.errors.gender)}
              >
                <MenuItem value={'male'}>Male</MenuItem>
                <MenuItem value={'female'}>Female</MenuItem>
                <MenuItem value={'prefer not to say'}>Prefer not to say</MenuItem>
              </Select>
              {formik.touched.gender && <FormHelperText>formik.errors.gender</FormHelperText>}
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <DateTimeField
              label="When did you fall asleep?"
              value={moment.unix(formik.values.sleepDateTime)}
              onChange={(e) => handleDateChange(e)}
              onBlur={formik.handleBlur}
//              format="YYYY-MM-DD"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              id="sleepDuration"
              name="sleepDuration"
              label="Sleep Duration in Hrs"
              type="number"
              value={formik.values.sleepDuration}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.sleepDuration && Boolean(formik.errors.sleepDuration)}
              helperText={formik.touched.sleepDuration && formik.errors.sleepDuration}
            />
          </Grid>
          <Grid item xs={12}>
            <Button color="primary" variant="contained" fullWidth type="submit">
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
      <Snackbar open={showSnackbar} autoHideDuration={6000}>
        <Alert
          onClose={handleToggleShowSnackbar}
          severity={isError ? 'error' : 'success'}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {message}
        </Alert>
      </Snackbar>
    </Paper>
  );
}
