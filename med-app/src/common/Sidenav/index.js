import React, { useEffect, useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

// react-router-dom components
import { useLocation, NavLink } from "react-router-dom";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @mui material components
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import Icon from "@mui/material/Icon";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ReceiptIcon from "@mui/icons-material/Receipt";
import CreditCardIcon from "@mui/icons-material/CreditCard";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Material Dashboard 2 React example components
import SidenavCollapse from "common/Sidenav/SidenavCollapse";

// Custom styles for the Sidenav
import SidenavRoot from "common/Sidenav/SidenavRoot";
import sidenavLogoLabel from "common/Sidenav/styles/sidenav";
import {
  Collapse,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Typography,
} from "@mui/material";
// import { useUser } from "serContext"; // Import the useUser hook
import { roles } from "roles";
// Custom styles for the SidenavCollapse
import { collapseItem } from "common/Sidenav/styles/sidenavCollapse";

// Material Dashboard 2 React context
import {
  useMaterialUIController,
  setMiniSidenav,
  setTransparentSidenav,
  setWhiteSidenav,
} from "context";
import Dashboard from "views/dashboard";
import {
  Assignment,
  CreditCard,
  ExpandLess,
  ExpandMore,
  Receipt,
  StarBorder,
} from "@mui/icons-material";
import {
  collapseIcon,
  collapseIconBox,
  collapseText,
} from "./styles/sidenavCollapse";
import { useUser } from "userContext";

function Sidenav({ color, brand, brandName, active, routes, ...rest }) {
  const [controller, dispatch] = useMaterialUIController();
  const {
    miniSidenav,
    transparentSidenav,
    whiteSidenav,
    darkMode,
    sidenavColor,
  } = controller;
  const { user } = useUser(); // Get the user from context
  const location = useLocation();
  const collapseName = location.pathname.replace("/", "");

  //changes
  const [openCollapse, setOpenCollapse] = useState({});
  const handleCollapseClick = (key) => {
    console.log("Have submenu.");
    setOpenCollapse((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  //-----

  let textColor = "white";

  if (transparentSidenav || (whiteSidenav && !darkMode)) {
    textColor = "dark";
  } else if (whiteSidenav && darkMode) {
    textColor = "inherit";
  }

  const closeSidenav = () => setMiniSidenav(dispatch, true);

  useEffect(() => {
    // A function that sets the mini state of the sidenav.
    function handleMiniSidenav() {
      setMiniSidenav(dispatch, window.innerWidth < 1200);
      setTransparentSidenav(
        dispatch,
        window.innerWidth < 1200 ? false : transparentSidenav
      );
      setWhiteSidenav(
        dispatch,
        window.innerWidth < 1200 ? false : whiteSidenav
      );
    }

    /** 
     The event listener that's calling the handleMiniSidenav function when resizing the window.
    */
    window.addEventListener("resize", handleMiniSidenav);

    // Call the handleMiniSidenav function to set the state with the initial value.
    handleMiniSidenav();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleMiniSidenav);
  }, [dispatch, location]);

  // Filter routes based on user role

  const filterRoutesByRole = (routes, role) => {
    switch (role) {
      case "admin":
        console.log("start filter");
        return routes.filter(
          (route) =>
            // route
            roles.admin.includes(route.route) ||
            (route.children &&
              route.children.some((child) => roles.admin.includes(child.route)))
        );
      case "super_admin":
        return routes.filter(
          (route) =>
            // route
            roles.super_admin.includes(route.route) ||
            (route.children &&
              route.children.some((child) =>
                roles.super_admin.includes(child.route)
              ))
        );
      default:
        return [];
    }
  };
  let userRole = localStorage.getItem("user_role");
  const filteredRoutes = filterRoutesByRole(routes, userRole); // Filter routes based on role
  // console.log("---user.role----");
  // console.log(user.role);

  // const filteredRoutes = routes.filter((route) => {
  //   console.log("----------role-------");
  //   console.log(roles);
  //   console.log("----------user-------");
  //   console.log(user);
  //   console.log("----------route.rote-------");

  //   console.log(route.route);
  //   console.log("----------route.children-------");

  //   console.log(route.children);
  //   // console.log(child.route + "---------------");
  //   roles[user.role].includes(route.route) ||
  //     (route.children &&
  //       route.children.some((child) => roles[user.role].includes(child.route)));
  // });

  // console.log("----------routes-------");
  // console.log(routes);

  // console.log("----------filteredRoutes-------");
  // console.log(filteredRoutes);

  // Render all the routes from the routes.js (All the visible items on the Sidenav)
  const renderRoutes = (routes) =>
    routes.map(
      ({ type, name, icon, title, noCollapse, key, href, route, children }) => {
        let returnValue;
        if (type === "collapse" && children) {
          return (
            <>
              <ListItem component="li" onClick={() => handleCollapseClick(key)}>
                <MDBox
                  {...rest}
                  sx={(theme) =>
                    collapseItem(theme, {
                      active,
                      transparentSidenav,
                      whiteSidenav,
                      darkMode,
                      sidenavColor,
                    })
                  }
                >
                  <ListItemIcon
                    sx={(theme) =>
                      collapseIconBox(theme, {
                        transparentSidenav,
                        whiteSidenav,
                        darkMode,
                        active,
                      })
                    }
                  >
                    {typeof icon === "string" ? (
                      <Icon sx={(theme) => collapseIcon(theme, { active })}>
                        {icon}
                      </Icon>
                    ) : (
                      icon
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={name}
                    sx={(theme) =>
                      collapseText(theme, {
                        miniSidenav,
                        transparentSidenav,
                        whiteSidenav,
                        active,
                      })
                    }
                  />
                  {openCollapse[key] ? <ExpandLess /> : <ExpandMore />}
                </MDBox>
              </ListItem>
              <Collapse
                in={openCollapse[key]}
                timeout="auto"
                unmountOnExit
                sx={{ paddingLeft: (theme) => theme.spacing(4) }}
              >
                <List component="li" disablePadding>
                  {renderRoutes(children)}
                </List>
              </Collapse>
            </>
          );
        } else if (type === "collapse") {
          return (
            <NavLink key={key} to={route}>
              <SidenavCollapse
                name={name}
                icon={icon}
                active={key === collapseName}
              />
            </NavLink>
          );
        } else if (type === "title") {
          return (
            <MDTypography
              key={key}
              color={textColor}
              display="block"
              variant="caption"
              fontWeight="bold"
              textTransform="uppercase"
              pl={3}
              mt={2}
              mb={1}
              ml={1}
            >
              {name}
            </MDTypography>
          );
        } else if (type === "divider") {
          return (
            <Divider
              key={key}
              light={
                (!darkMode && !whiteSidenav && !transparentSidenav) ||
                (darkMode && !transparentSidenav && whiteSidenav)
              }
            />
          );
        }

        return null;
      }
    );
  // const [open, setOpen] = React.useState(false);

  // const handleClick = () => {
  //   setOpen(!open);
  // };

  return (
    <SidenavRoot
      {...rest}
      variant="permanent"
      ownerState={{ transparentSidenav, whiteSidenav, miniSidenav, darkMode }}
    >
      <MDBox pt={3} pb={1} px={4} textAlign="center">
        <MDBox
          display={{ xs: "block", xl: "none" }}
          position="absolute"
          top={0}
          right={0}
          p={1.625}
          onClick={closeSidenav}
          sx={{ cursor: "pointer" }}
        >
          <MDTypography variant="h6" color="secondary">
            <Icon sx={{ fontWeight: "bold" }}>close</Icon>
          </MDTypography>
        </MDBox>
        <MDBox component={NavLink} to="/" display="flex" alignItems="center">
          {brand && <MDBox component="img" src={brand} alt="Brand" />}
          <MDBox
            width={!brandName && "100%"}
            sx={(theme) => sidenavLogoLabel(theme, { miniSidenav })}
          >
            <MDTypography
              component="h6"
              variant="button"
              fontWeight="medium"
              color={textColor}
            >
              {brandName}
            </MDTypography>
          </MDBox>
        </MDBox>
      </MDBox>
      <Divider
        light={
          (!darkMode && !whiteSidenav && !transparentSidenav) ||
          (darkMode && !transparentSidenav && whiteSidenav)
        }
      />
      <List>{renderRoutes(filteredRoutes)}</List>

      {/* 
      here
      enter
      code
      to
      nave
      
       */}
    </SidenavRoot>
  );
}

// Setting default values for the props of Sidenav
Sidenav.defaultProps = {
  color: "info",
  brand: "",
};

// Typechecking props for the Sidenav
Sidenav.propTypes = {
  color: PropTypes.oneOf([
    "primary",
    "secondary",
    "info",
    "success",
    "warning",
    "error",
    "dark",
  ]),
  brand: PropTypes.string,
  brandName: PropTypes.string.isRequired,
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Sidenav;
