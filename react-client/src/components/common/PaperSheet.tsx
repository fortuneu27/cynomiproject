import * as React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { createTheme, Divider, Grid, Typography } from "@mui/material";
import { spacing } from "@mui/system";

interface Props {
  title: React.ReactNode;
  children: React.ReactNode;
}

export default function PaperSheet(props: Props) {
  const theme = createTheme();
  return (
    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', minHeight:'calc(100vh -8em)', marginTop: '70px', marginRight: 10, overflow: 'hidden'  }}>
      <Grid container justifyContent={"space-between"} alignItems={"center"}>
        <Grid>
          <Typography
            variant="h5"
            style={{ paddingBottom: 10, textAlign: "left" }}
          >
            {props.title}
          </Typography>
        </Grid>
      </Grid>
      <Divider style={{ marginBottom: 20 }} />
      <div>{props.children}</div>
    </Paper>
  );
}
