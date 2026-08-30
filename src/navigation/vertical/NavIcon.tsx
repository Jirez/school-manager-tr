import React, { useState, useEffect } from "react";

interface NavIconProps {
  icon: React.ReactNode;
  color?: string;
  bgColor?: string;
  /** Size of the icon inside the container */
  iconSize?: number;
}

/**
 * Custom hook to detect dark mode by observing the body's class list.
 * This ensures the component re-renders when dark mode is toggled.
 */
const useDarkMode = (): boolean => {
  const [isDark, setIsDark] = useState(() => {
    if (typeof document !== "undefined") {
      return document.body.classList.contains("dark-layout");
    }
    return false;
  });

  useEffect(() => {
    if (typeof document === "undefined") return;

    const observer = new MutationObserver(() => {
      setIsDark(document.body.classList.contains("dark-layout"));
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return isDark;
};

/**
 * A styled wrapper for navigation icons with gradient background and color support.
 * Supports dark mode and is optimized for mobile visibility.
 */
const NavIcon: React.FC<NavIconProps> = ({
  icon,
  color = "#7367f0",
  bgColor,
  iconSize = 14,
}) => {
  // Use the hook to reactively detect dark mode changes
  const isDarkMode = useDarkMode();

  // Use higher opacity for dark mode to ensure visibility
  const lightBgOpacity = "22"; // ~13% opacity for light mode
  const darkBgOpacity = "55"; // ~33% opacity for dark mode (increased for better visibility)
  const bgOpacity = isDarkMode ? darkBgOpacity : lightBgOpacity;

  const background =
    bgColor ||
    `linear-gradient(135deg, ${color}${bgOpacity} 0%, ${color}${
      isDarkMode ? "0" : "11"
    } 100%)`;

  return (
    <>
      <span
        className="nav-icon-wrapper d-none d-md-block"
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: "24px",
          height: "24px",
          minWidth: "24px",
          minHeight: "24px",
          borderRadius: "6px",
          background,
          color: `${color}`,
          marginRight: "0.75rem",
          flexShrink: 0,
          fontSize: `${iconSize}px`,
          transition: "all 0.2s ease",
        }}
      >
        {React.isValidElement(icon)
          ? React.cloneElement(icon as React.ReactElement<{ size?: number }>, {
              size: iconSize,
            })
          : icon}
      </span>
      <span
        className="nav-icon-wrapper d-md-none"
        /* style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: "24px",
          height: "24px",
          minWidth: "24px",
          minHeight: "24px",
          borderRadius: "6px",
          background,
          color: `${color}`,
          marginRight: "0.75rem",
          flexShrink: 0,
          fontSize: `${iconSize}px`,
          transition: "all 0.2s ease",
        }} */
        style={{
          color: `${color}`,
          marginRight: "0.75rem",
          borderRadius: "6px",
        }}
      >
        {React.isValidElement(icon)
          ? React.cloneElement(icon as React.ReactElement<{ size?: number }>, {
              // size: iconSize,
              // @ts-ignore desc
              className: `!h-6 !w-6 !text-[${color}]`,
            })
          : ""}
      </span>
    </>
  );
};

export default NavIcon;
