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
          borderRadius: 2,
          boxShadow: "0 4px 20px rgba(255, 183, 242, 0.25)",
        },
      }}
    >
      <DialogTitle
        sx={{
          bgcolor: isSuccess ? "#FFB7F2" : "#FFE0F7",
          color: "#2A0934",
          fontWeight: "bold",
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
            bgcolor: "#FFB7F2",
            color: "#2A0934",
            fontWeight: "bold",
            "&:hover": {
              bgcolor: "#FF9BE8",
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
