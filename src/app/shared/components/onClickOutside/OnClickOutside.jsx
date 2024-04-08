import { useEffect, useRef } from "react";

const isClickInsideClass = (className) => {
  return function (event) {
    const targetElement = event.target;
    if (targetElement.classList.contains(className)) {
      return true;
    } else {
      let parentElement = targetElement.parentElement;
      while (parentElement) {
        if (parentElement.classList.contains(className)) {
          return true;
        }
        parentElement = parentElement.parentElement;
      }
      return false;
    }
  };
};

export default function OnClickOutside({
  onClickOutside,
  onCLickInside,
  children,
  className,
  style,
  excludeClasses = [],
}) {
  const ref = useRef(null);

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [onClickOutside]);

  const handleClickOutside = (event) => {
    if (
      ref.current &&
      !ref.current.contains(event.target) &&
      !excludeClasses.length
    ) {
      onClickOutside && onClickOutside();
      return;
    }

    if (excludeClasses.length) {
      let actuallyClickedOutsideOfExcludedClasses = true;
      excludeClasses?.forEach((className) => {
        if (
          ref.current &&
          !ref.current.contains(event.target) &&
          !isClickInsideClass(className)(event)
        ) {
          return;
        } else {
          actuallyClickedOutsideOfExcludedClasses = false;
        }
      });

      if (actuallyClickedOutsideOfExcludedClasses) {
        onClickOutside && onClickOutside();
        return;
      }
    }
  };

  return (
    <div ref={ref} style={style} className={className} onClick={onCLickInside}>
      {children}
    </div>
  );
}
