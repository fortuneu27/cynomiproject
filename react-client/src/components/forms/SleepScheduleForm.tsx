import * as React from "react";
import {
  FormikProps,
  useFormik,
} from "formik";
import { Alert, Button, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select, Snackbar, TextField } from "@mui/material";
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

  const handleDateChange = (date: Moment) => {
    var timeStamp: number
    try {
      timeStamp = date.utc().unix()
    } catch {
      timeStamp = NaN
    }

    formik.setFieldValue('sleepDateTime',timeStamp)
  }
  return (
    <PaperSheet title='Track your sleep'>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={40}>
          <Grid item>
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
          <Grid item>
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
        </Grid>
        <Grid container spacing={40}>
          <Grid item>
            <DateTimeField
              label="When did you fall asleep?"
              value={formik.values.sleepDateTime ? moment.unix(formik.values.sleepDateTime) : null}
              onChange={() => handleDateChange}
              onBlur={formik.handleBlur}
//              format="YYYY-MM-DD"
            />
          </Grid>
          <Grid item>
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
        </Grid>
        <Grid container spacing={40}>
          <Button color="primary" variant="contained" fullWidth type="submit">
            Submit
          </Button>
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
    </PaperSheet>
  );
}
