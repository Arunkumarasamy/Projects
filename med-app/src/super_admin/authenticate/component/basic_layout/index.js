import { Grid } from "@mui/material";
import MDBox from "components/MDBox";
import PageLayout from "layoutContainers/PageLayout";
import Footer_layout from "../footer_layout";
// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

export default function Basic_layout({ image, children }) {
  return (
    <PageLayout>
      <MDBox
        position="absolute"
        width="100%"
        minHeight="100vh"
        sx={{
          backgroundImage: ({
            functions: { linearGradient, rgba },
            palette: { gradients },
          }) =>
            image &&
            `${linearGradient(
              rgba(gradients.dark.main, 0.6),
              rgba(gradients.dark.state, 0.6)
            )}, url(${image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
      <MDBox px={1} width="100%" height="100vh" mx="auto">
        <Grid
          container
          spacing={1}
          justifyContent="center"
          alignItems="center"
          height="100%"
        >
          <Grid item xs={11} sm={9} md={5} lg={4} xl={3}>
            {children}
          </Grid>
        </Grid>
      </MDBox>
      <Footer_layout light />
    </PageLayout>
  );
}

// Typechecking props for the BasicLayout
Basic_layout.propTypes = {
  image: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};
