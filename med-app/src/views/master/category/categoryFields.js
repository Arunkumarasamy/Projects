import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Box,
  IconButton,
  Typography,
} from "@mui/material";
import { Close } from "@mui/icons-material";

export default function AddCategoryDialog({
  open,
  onClose,
  name,
  description,
  onNameChange,
  onDescriptionChange,
  onSave,
  editingCategory,
}) {
  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {editingCategory ? (
          <Typography>Edit Category</Typography>
        ) : (
          <Typography>Add Category</Typography>
        )}
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
            "&:hover": {
              color: (theme) => theme.palette.primary.main,
            },
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box mb={2} mt={3}>
          <TextField
            label="Name"
            value={name}
            onChange={onNameChange}
            fullWidth
            autoFocus
          />
          <Box mt={1} fontSize="caption.fontSize" color="text.secondary">
            {name.length} / 255
          </Box>
        </Box>
        <TextField
          label="Description"
          value={description}
          onChange={onDescriptionChange}
          fullWidth
          multiline
          rows={4}
        />
        <Box mt={2} display="flex" justifyContent="flex-end">
          <Button onClick={onSave} variant="contained" color="primary">
            {editingCategory ? "Update" : "Save"}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
