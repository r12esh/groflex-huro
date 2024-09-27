import {
  SET_SIDEBAR_PANEL_ACTIVE,
  SET_SIDEBAR_PANEL_INACTIVE,
} from "../../redux/actions/actions.types";
import { useDispatch, useSelector } from "react-redux";

const useToggleSidebar = () => {
  /*
   * Returns a function that toggles the sidebar, takes no arguments
   **/
  const dispatch = useDispatch();
  const { sidebarIsActive } = useSelector((state) => state.themeData);
  const toggleSideBar = () => {
    if (sidebarIsActive) {
      dispatch({ type: SET_SIDEBAR_PANEL_INACTIVE });
    } else {
      dispatch({ type: SET_SIDEBAR_PANEL_ACTIVE });
    }
  };
  return toggleSideBar;
};

export default useToggleSidebar;
