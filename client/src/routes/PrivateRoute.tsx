import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import type { RootState } from "../redux/store";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const PrivateRoute = ({ children }: Props) => {
  const token = useSelector((state: RootState) => state.auth.token);
  return token ? <>{children}</> : <Navigate to="/login" />;
};
export default PrivateRoute;
