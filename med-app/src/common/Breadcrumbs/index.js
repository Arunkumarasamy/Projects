/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// react-router-dom components
import { Link } from "react-router-dom";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @mui material components
import { Breadcrumbs as MuiBreadcrumbs } from "@mui/material";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import moment from "moment";
import { DateRangePicker } from "rsuite";

function Breadcrumbs({
  icon,
  title,
  route,
  light,
  date,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  handleDateFilter,
}) {
  const routes = route.slice(0, -1);

  // dateFilter
  const dateChange = (newValue) => {
    if (Array.isArray(newValue) && newValue.length === 2) {
      setStartDate(newValue[0] ? moment(newValue[0]) : null);
      setEndDate(newValue[1] ? moment(newValue[1]) : null);
    } else {
      setStartDate(null);
      setEndDate(null);
    }
  };

  return (
    <MDBox
      mr={{ xs: 0, xl: 8 }}
      sx={{ display: "flex", justifyContent: "space-between" }}
    >
      <MuiBreadcrumbs
        sx={{
          "& .MuiBreadcrumbs-separator": {
            color: ({ palette: { white, grey } }) =>
              light ? white.main : grey[600],
          },
        }}
      >
        <Link to="/">
          <MDTypography
            component="span"
            variant="body2"
            color={light ? "white" : "dark"}
            opacity={light ? 0.8 : 0.5}
            sx={{ lineHeight: 0 }}
          >
            <Icon>{icon}</Icon>
          </MDTypography>
        </Link>
        {routes.map((el) => (
          <Link to={`/${el}`} key={el}>
            <MDTypography
              component="span"
              variant="button"
              fontWeight="regular"
              textTransform="capitalize"
              color={light ? "white" : "dark"}
              opacity={light ? 0.8 : 0.5}
              sx={{ lineHeight: 0 }}
            >
              {el}
            </MDTypography>
          </Link>
        ))}
        <MDTypography
          variant="button"
          fontWeight="regular"
          textTransform="capitalize"
          color={light ? "white" : "dark"}
          sx={{ lineHeight: 0 }}
        >
          {title.replace("-", " ")}
        </MDTypography>
      </MuiBreadcrumbs>
      {date && (
        <MDBox
          width="18rem"
          ml="auto"
          display="flex"
          justifyContent="space-evenly"
          gap="2"
        >
          <DateRangePicker
            showOneCalendar
            placeholder="Select Date Range"
            value={[
              startDate ? startDate.toDate() : null,
              endDate ? endDate.toDate() : null,
            ]} // Convert moment to Date for the picker
            onChange={dateChange}
            // style={{ width: "fit-content" }} // Style adjustments
          />
          <Icon
            onClick={handleDateFilter}
            sx={{
              cursor: "pointer ",
              fontWeight: 600,
              mt: 0.8,
              ml: 0.5,
            }}
          >
            arrow_forward
          </Icon>
        </MDBox>
      )}
    </MDBox>
  );
}

// Setting default values for the props of Breadcrumbs
Breadcrumbs.defaultProps = {
  light: false,
  date: false,
};

// Typechecking props for the Breadcrumbs
Breadcrumbs.propTypes = {
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  route: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
  light: PropTypes.bool,
  date: PropTypes.bool,
};

export default Breadcrumbs;
