import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import ReorderMenu from "../../components/admin/ReorderMenu";

const MenuSettings = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  if (!user || user.role_id !== 1) {
    return <p className="text-red-500 text-center mt-10">Access Denied</p>;
  }

  return (
    <div className="p-4">
      <ReorderMenu />
    </div>
  );
};

export default MenuSettings;
