import { useDispatch, useSelector } from "react-redux";
import {
  SET_THEME_DARK,
  SET_THEME_LIGHT,
} from "../../redux/actions/actions.types";

const useThemeSwitch = () => {
  /*
   * Returns a function that switches the theme from light to dark and vice-versa, also adds/removes "is-dark"
   * class from body element. Takes no arguments
   **/
  const { theme } = useSelector((state) => state.themeData);
  const dispatch = useDispatch();
  const themeSwitcher = () => {
    if (theme === "light") {
      document.body.classList.add("is-dark");
      dispatch({ type: SET_THEME_DARK });
    } else {
      document.body.classList.remove("is-dark");
      dispatch({ type: SET_THEME_LIGHT });
    }
  };
  return themeSwitcher;
};

export default useThemeSwitch;
