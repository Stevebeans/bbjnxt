import React from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import AuthContext from "@/utils/AuthContext";

const dashboard = () => {
  const { user } = React.useContext(AuthContext);

  return (
    <ProtectedRoute>
      <div>Hello, </div>
    </ProtectedRoute>
  );
};

export default dashboard;
