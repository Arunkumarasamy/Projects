import { useState, useEffect, useMemo } from "react";

// react-router components
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

// @mui material components
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import Sidenav from "common/Sidenav";
import Configurator from "configurator";

// Material Dashboard 2 React themes
import theme from "assets/theme";

// Material Dashboard 2 React routes
import routes from "routes";

// Material Dashboard 2 React contexts
import {
  useMaterialUIController,
  setMiniSidenav,
  setOpenConfigurator,
} from "context";

// Images
import brandLogo from "assets/images/logo.svg";
import Basic from "views/authentication/sign-in";
import Cover from "views/authentication/sign-up";
import Login_super_admin from "super_admin/authenticate/login";
import Dashboard_super_admin from "super_admin/dashboard";
import Tenant from "super_admin/tanent_management";
import { UserProvider } from "userContext";
import Forgot_pass from "views/authentication/forgot_password";
import Reset_password from "views/authentication/reset-password";
import { boolean } from "yup";

export default function App() {
  const [controller, dispatch] = useMaterialUIController();
  const {
    miniSidenav,
    direction,
    layout,
    openConfigurator,
    sidenavColor,
    transparentSidenav,
    whiteSidenav,
    darkMode,
  } = controller;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const { pathname } = useLocation();

  // Open sidenav when mouse enter on mini sidenav
  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  // Close sidenav when mouse leave mini sidenav
  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

  // Change the openConfigurator state
  const handleConfiguratorOpen = () =>
    setOpenConfigurator(dispatch, !openConfigurator);

  // Setting the dir attribute for the body element
  useEffect(() => {
    document.body.setAttribute("dir", direction);
  }, [direction]);

  // Setting page scroll to 0 when changing the route
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  const [isLoginState, setISLoginState] = useState(
    localStorage.getItem("token") != null
  );
  useEffect(() => {
    setISLoginState(localStorage.getItem("token") != null);
  }, [localStorage.getItem("token")]);

  // --------
  const updateLoginState = (token) => {
    if (token) {
      localStorage.setItem("token", token);
      setISLoginState(true);
    } else {
      localStorage.removeItem("token");
      setISLoginState(false);
    }
  };
  // --------
  const getRoutes = (allRoutes) =>
    // const isLogin = localStorage.getItem("token") != null;
    allRoutes.map((route) => {
      if (route.children) {
        return getRoutes(route.children);
      }
      console.log("islogin-----", isLoginState);
      if (route.route) {
        if (!isLoginState) {
          return (
            <Route
              exact
              path={route.route}
              // element={route.component}
              // element={isLogin ? route.component : <Navigate to="/login" />}
              element={<Navigate to="/login" />}
              key={route.key}
            />
          );

          // return (
          //   <Route
          //     exact
          //     path={route.route}
          //     // element={route.component}
          //     element={isLogin ? route.component : <Navigate to="/login" />}
          //     // element={<Navigate to="/login" />}
          //     key={route.key}
          //   />
          // );
        } else {
          return (
            <Route
              exact
              path={route.route}
              element={route.component}
              // element={isLogin ? route.component : <Navigate to="/login" />}
              // element={<Navigate to="/login" />}
              key={route.key}
            />
          );
        }
      }

      return null;
    });

  return (
    <UserProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {layout === "dashboard" && isLoginState && (
          <>
            <Sidenav
              color={sidenavColor}
              brand={brandLogo}
              routes={routes}
              onMouseEnter={handleOnMouseEnter}
              onMouseLeave={handleOnMouseLeave}
            />
            <Configurator />
            {/* {configsButton} */}
          </>
        )}
        {layout === "vr" && <Configurator />}
        <Routes>
          {getRoutes(routes)}
          <Route path="/" element={<Login_super_admin />} />
          <Route
            path="/login"
            element={<Basic updateLoginState={updateLoginState} />}
          />
          <Route path="/forgot_password" element={<Forgot_pass />} />
          <Route path="/reset_password/:token" element={<Reset_password />} />
        </Routes>
      </ThemeProvider>
    </UserProvider>
  );
}

// const configsButton = (
//   <MDBox
//     display="flex"
//     justifyContent="center"
//     alignItems="center"
//     width="3.25rem"
//     height="3.25rem"
//     bgColor="white"
//     shadow="sm"
//     borderRadius="50%"
//     position="fixed"
//     right="2rem"
//     bottom="2rem"
//     zIndex={99}
//     color="dark"
//     sx={{ cursor: "pointer" }}
//     onClick={handleConfiguratorOpen}
//   >
//     <Icon fontSize="small" color="inherit">
//       settings
//     </Icon>
//   </MDBox>
// );
