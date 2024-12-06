import React, { useState } from "react";
import { Button, Box } from "@mui/material";

const FileUpload = () => {
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");

  const MAX_FILE_SIZE = 2 * 1024 * 1024;

  const fileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        setError("File maxmium size 2MB");
        setFileName("");
      } else {
        setError("");
        setFileName(file.name);
      }
    } else {
      setFileName("");
    }
  };

  return (
    <Box display="flex" alignItems="center" marginTop={2}>
      <input
        style={{ display: "none" }}
        id="upload-button-file"
        type="file"
        onChange={fileChange}
      />
      <label htmlFor="upload-button-file">
        <Button variant="contained" component="span">
          Upload Prescription
        </Button>
      </label>
      <span> {fileName}</span>
    </Box>
  );
};

export default FileUpload;
