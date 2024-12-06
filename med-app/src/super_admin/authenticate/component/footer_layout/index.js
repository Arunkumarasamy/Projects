import { Container, Link } from "@mui/material";
import typography from "assets/theme/base/typography";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

export default function Footer_layout({ light }) {
  const { size } = typography;

  return (
    <MDBox position="absolute" width="100%" bottom={0} py={4}>
      <Container>
        {/* <MDBox
          width="100%"
          display="flex"
          flexDirection={{ xs: "column", lg: "row" }}
          justifyContent="space-between"
          alignItems="center"
          px={1.5}
        > */}
        <MDBox
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexWrap="wrap"
          color={light ? "white" : "text"}
          fontSize={size.sm}
        >
          &copy; {new Date().getFullYear()}, powered by
          <Link href="https://www.hermonsolutions.com/" target="_blank">
            <MDTypography
              variant="button"
              fontWeight="medium"
              color={light ? "white" : "dark"}
            >
              &nbsp;HERMON Solutions.&nbsp;
            </MDTypography>
          </Link>
          All rights reserved.
        </MDBox>
        {/* <MDBox
          component="ul"
          sx={({ breakpoints }) => ({
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
            listStyle: "none",
            mt: 3,
            mb: 0,
            p: 0,

            [breakpoints.up("lg")]: {
              mt: 0,
            },
          })}
        >
          <MDBox component="li" px={2} lineHeight={1}>
            <Link href="#">
              <MDTypography
                variant="button"
                fontWeight="regular"
                color={light ? "white" : "dark"}
              >
                About Us
              </MDTypography>
            </Link>
          </MDBox>
          <MDBox component="li" px={2} lineHeight={1}>
            <Link href="#">
              <MDTypography
                variant="button"
                fontWeight="regular"
                color={light ? "white" : "dark"}
              >
                Terms & Conditions
              </MDTypography>
            </Link>
          </MDBox>
          <MDBox component="li" pl={2} lineHeight={1}>
            <Link href="#">
              <MDTypography
                variant="button"
                fontWeight="regular"
                color={light ? "white" : "dark"}
              >
                Privacy Policy
              </MDTypography>
            </Link>
          </MDBox>
        </MDBox> */}
        {/* </MDBox> */}
      </Container>
    </MDBox>
  );
}
// Setting default props for the Footer
Footer_layout.defaultProps = {
  light: false,
};

// Typechecking props for the Footer
Footer_layout.propTypes = {
  light: PropTypes.bool,
};
