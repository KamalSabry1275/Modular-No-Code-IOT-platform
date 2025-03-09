import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const RequireAccess = ({ children }) => {
  const resetPassword = useSelector((state) => state.resetPassword);

  console.log(resetPassword);
  if (!resetPassword) return <Navigate to="/login" />;
  return <>{children}</>;
};

export default RequireAccess;
