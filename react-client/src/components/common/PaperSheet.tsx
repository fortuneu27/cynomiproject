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
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        "& > :not(style)": {
          m: 1,
          width: 128,
          height: 128,
        },
        overflow: "hidden",
        paddingTop: theme.spacing(3),
        minHeight: "calc(100vh - 8em)",
        marginTop: '70px',
        marginRight: '10px',
        marginBottom: "3em",
      }}
    >
      <Paper elevation={2}>
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
    </Box>
  );
}
