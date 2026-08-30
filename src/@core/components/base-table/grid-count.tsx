import React from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "motion/react";

interface GridCountProps {
  totalCount?: number;
  variant?: "default" | "success" | "warning" | "info" | "primary";
}

const variantConfig = {
  default: {
    bg: "linear-gradient(135deg, #626e82 0%, #444f60 100%)",
    shadow: "rgba(68, 79, 96, 0.3)",
    border: "rgba(68, 79, 96, 0.2)",
  },
  success: {
    bg: "linear-gradient(135deg, #28c76f 0%, #17ad5e 100%)",
    shadow: "rgba(40, 199, 111, 0.3)",
    border: "rgba(40, 199, 111, 0.2)",
  },
  warning: {
    bg: "linear-gradient(135deg, #ff9f43 0%, #ed8d2d 100%)",
    shadow: "rgba(255, 159, 67, 0.3)",
    border: "rgba(255, 159, 67, 0.2)",
  },
  info: {
    bg: "linear-gradient(135deg, #00cfe8 0%, #00acc1 100%)",
    shadow: "rgba(0, 207, 232, 0.3)",
    border: "rgba(0, 207, 232, 0.2)",
  },
  primary: {
    bg: "linear-gradient(135deg, #7367f0 0%, #5e50ee 100%)",
    shadow: "rgba(115, 103, 240, 0.3)",
    border: "rgba(115, 103, 240, 0.2)",
  },
};

const BadgeWrapper = styled(motion.span)<{ $variant: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 22px;
  height: 20px;
  padding: 0 7px;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  color: #ffffff;
  white-space: nowrap;
  user-select: none;
  cursor: default;
  position: relative;
  overflow: hidden;

  background: ${(props) =>
    variantConfig[props.$variant as keyof typeof variantConfig].bg};
  box-shadow: 0 1px 1px
    ${(props) =>
      variantConfig[props.$variant as keyof typeof variantConfig].shadow};
  border: 1px solid rgba(255, 255, 255, 0.25);

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      rgba(255, 255, 255, 0.2) 0%,
      rgba(255, 255, 255, 0) 100%
    );
    pointer-events: none;
  }

  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    transform: translateY(-1px) scale(1.08);
    filter: brightness(1.1);
    box-shadow: 0 5px 12px
      ${(props) =>
        variantConfig[props.$variant as keyof typeof variantConfig].shadow};
  }
`;

const GridCount: React.FC<GridCountProps> = ({
  totalCount = 0,
  variant = "success",
}) => {
  // Format large numbers
  const formatCount = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 10000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <AnimatePresence mode="wait">
      <BadgeWrapper
        id="gridCount"
        $variant={variant}
        key={totalCount}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 25,
        }}
        title={totalCount > 999 ? totalCount.toLocaleString() : undefined}
      >
        {formatCount(totalCount)}
      </BadgeWrapper>
    </AnimatePresence>
  );
};

export default GridCount;
