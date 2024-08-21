import * as React from "react";
import {
  RouterProvider,
  createBrowserRouter,
  Routes,
  Route,
  Outlet,
  Link,
  BrowserRouter,
} from "react-router-dom";
import Navbar from "./common/Navbar";
import SleepScheduleList from "../routes/SleepScheduleList";
import SleepScheduleForm from "./forms/SleepScheduleForm";

export default function Router() {
  return (
    <React.Fragment>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route index path="/" element={<SleepScheduleList />} />
          <Route index path="/form" element={<SleepScheduleForm/>} />
        </Routes>
      </BrowserRouter>
    </React.Fragment>
  );
}
