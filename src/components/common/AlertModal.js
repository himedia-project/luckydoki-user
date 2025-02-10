import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

const AlertModal = ({
  open,
  onClose,
  title,
  message,
  isSuccess,
  onConfirm,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          boxShadow: "0 4px 20px rgba(255, 183, 242, 0.25)",
        },
      }}
    >
      <DialogTitle
        sx={{
          bgcolor: isSuccess ? "#00de90" : "#00de90",
          color: "#2A0934",
        }}
      >
        {title}
      </DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        <Typography color="#2A0934">{message}</Typography>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button
          onClick={onConfirm || onClose}
          sx={{
            bgcolor: "#00de90",
            color: "#2A0934",
            "&:hover": {
              bgcolor: "#22df90",
            },
          }}
        >
          확인
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AlertModal;
