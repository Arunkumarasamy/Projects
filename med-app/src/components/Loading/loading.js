import React from "react";
import { Backdrop } from "@mui/material";
import { Triangle } from "react-loader-spinner";
import PropTypes from "prop-types";

const TriangleLoader = ({ open, height, width, color }) => (
  <Backdrop open={open} style={{ zIndex: 1300, color: "#fff" }}>
    <Triangle
      visible={open}
      height={height}
      width={width}
      color={color}
      ariaLabel="triangle-loading"
    />
  </Backdrop>
);

TriangleLoader.propTypes = {
  open: PropTypes.bool.isRequired,
  height: PropTypes.string,
  width: PropTypes.string,
  color: PropTypes.string,
};

TriangleLoader.defaultProps = {
  height: "130",
  width: "800",
  color: "#b2be35",
};

export default TriangleLoader;
