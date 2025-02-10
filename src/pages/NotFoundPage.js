import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AlertModal from "../components/common/AlertModal";

const NotFoundPage = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
    navigate("/");
  };

  return (
    <AlertModal
      open={open}
      onClose={handleClose}
      onConfirm={handleClose}
      title="페이지 오류"
      message="알 수 없는 페이지입니다."
      isSuccess={false}
    />
  );
};

export default NotFoundPage;
