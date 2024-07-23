import React, { useContext } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import AuthContext from "@/utils/AuthContext";

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <ProtectedRoute>
      <div>Hello, </div>
    </ProtectedRoute>
  );
};

export default Dashboard;
