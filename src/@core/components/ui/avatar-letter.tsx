import React from "react";

// Beautiful, curated color palette with good contrast for white text
const colorPalette: Record<string, { bg: string; ring: string }> = {
  a: { bg: "bg-emerald-500", ring: "ring-emerald-200" },
  b: { bg: "bg-blue-500", ring: "ring-blue-200" },
  c: { bg: "bg-purple-500", ring: "ring-purple-200" },
  d: { bg: "bg-slate-600", ring: "ring-slate-200" },
  e: { bg: "bg-teal-500", ring: "ring-teal-200" },
  f: { bg: "bg-green-500", ring: "ring-green-200" },
  g: { bg: "bg-sky-500", ring: "ring-sky-200" },
  h: { bg: "bg-slate-700", ring: "ring-slate-300" },
  i: { bg: "bg-amber-500", ring: "ring-amber-200" },
  j: { bg: "bg-orange-500", ring: "ring-orange-200" },
  k: { bg: "bg-red-500", ring: "ring-red-200" },
  l: { bg: "bg-gray-500", ring: "ring-gray-200" },
  m: { bg: "bg-yellow-500", ring: "ring-yellow-200" },
  n: { bg: "bg-lime-500", ring: "ring-lime-200" },
  o: { bg: "bg-cyan-600", ring: "ring-cyan-200" },
  p: { bg: "bg-indigo-500", ring: "ring-indigo-200" },
  q: { bg: "bg-violet-500", ring: "ring-violet-200" },
  r: { bg: "bg-rose-500", ring: "ring-rose-200" },
  s: { bg: "bg-fuchsia-500", ring: "ring-fuchsia-200" },
  t: { bg: "bg-pink-500", ring: "ring-pink-200" },
  u: { bg: "bg-emerald-600", ring: "ring-emerald-200" },
  v: { bg: "bg-blue-600", ring: "ring-blue-200" },
  w: { bg: "bg-purple-600", ring: "ring-purple-200" },
  x: { bg: "bg-teal-600", ring: "ring-teal-200" },
  y: { bg: "bg-green-600", ring: "ring-green-200" },
  z: { bg: "bg-sky-600", ring: "ring-sky-200" },
};

// Size configuration
const sizeConfig = {
  xs: {
    container: "h-6 w-6",
    text: "text-xs",
    ring: "ring-1",
  },
  sm: {
    container: "h-8 w-8",
    text: "text-sm",
    ring: "ring-2",
  },
  md: {
    container: "h-10 w-10",
    text: "text-base",
    ring: "ring-1",
  },
  lg: {
    container: "h-12 w-12",
    text: "text-lg",
    ring: "ring-2",
  },
  xl: {
    container: "h-14 w-14",
    text: "text-xl",
    ring: "ring-3",
  },
  "2xl": {
    container: "h-16 w-16",
    text: "text-2xl",
    ring: "ring-3",
  },
};

type AvatarSize = keyof typeof sizeConfig;

interface AvatarLetterProps {
  /** The letter to display (first character will be used) */
  letter: string;
  /** Size variant of the avatar */
  size?: AvatarSize;
  /** Custom background color (overrides letter-based color) */
  customColor?: string;
  /** Show a ring around the avatar */
  showRing?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Status indicator */
  status?: "online" | "offline" | "away" | "busy";
}

/**
 * Get color classes based on the first letter
 */
export function getColorClasses(letter: string): { bg: string; ring: string } {
  const normalizedLetter = letter.toLowerCase().charAt(0);
  return (
    colorPalette[normalizedLetter] || {
      bg: "bg-gray-500",
      ring: "ring-gray-200",
    }
  );
}

/**
 * Status indicator colors
 */
const statusColors = {
  online: "bg-green-500",
  offline: "bg-gray-400",
  away: "bg-yellow-500",
  busy: "bg-red-500",
};

const AvatarLetter: React.FC<AvatarLetterProps> = ({
  letter,
  size = "md",
  customColor,
  showRing = false,
  className = "",
  status,
}) => {
  const displayLetter = letter.charAt(0).toUpperCase();
  const colors = getColorClasses(letter);
  const sizeClasses = sizeConfig[size];

  return (
    <div className={`relative inline-flex ${className}`}>
      <div
        className={`
          ${sizeClasses.container}
          ${customColor || colors.bg}
          ${showRing ? `${sizeClasses.ring} ${colors.ring} ring-offset-1` : ""}
          rounded-full
          flex items-center justify-center
          text-white
          font-semibold
          ${sizeClasses.text}
          uppercase
          shadow-md
          select-none
          transition-transform duration-200
          hover:scale-105
          hover:shadow-lg
        `}
        style={customColor ? { backgroundColor: customColor } : undefined}
      >
        <span className="leading-none antialiased">{displayLetter}</span>
      </div>

      {/* Status indicator */}
      {status && (
        <span
          className={`
            absolute bottom-0 right-0
            block
            ${size === "xs" || size === "sm" ? "h-2 w-2" : "h-3 w-3"}
            ${statusColors[status]}
            rounded-full
            ring-2 ring-white
          `}
        />
      )}
    </div>
  );
};

/**
 * Avatar group component for displaying multiple avatars
 */
interface AvatarGroupProps {
  letters: string[];
  size?: AvatarSize;
  max?: number;
  className?: string;
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({
  letters,
  size = "md",
  max = 4,
  className = "",
}) => {
  const visibleLetters = letters.slice(0, max);
  const remainingCount = letters.length - max;

  return (
    <div className={`flex -space-x-2 ${className}`}>
      {visibleLetters.map((letter, index) => (
        <div
          key={index}
          className="ring-2 ring-white rounded-full"
          style={{ zIndex: visibleLetters.length - index }}
        >
          <AvatarLetter letter={letter} size={size} />
        </div>
      ))}
      {remainingCount > 0 && (
        <div
          className={`
            ${sizeConfig[size].container}
            bg-gray-200
            text-gray-600
            font-semibold
            ${sizeConfig[size].text}
            rounded-full
            flex items-center justify-center
            ring-2 ring-white
          `}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  );
};

export default AvatarLetter;
