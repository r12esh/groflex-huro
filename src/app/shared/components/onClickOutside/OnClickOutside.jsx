import { useEffect, useRef } from "react";

export default function OnClickOutside({
  onClickOutside,
  children,
  className,
  style,
}) {
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        onClickOutside && onClickOutside();
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [onClickOutside]);

  return (
    <div ref={ref} style={style} className={className}>
      {children}
    </div>
  );
}
