import { useSkin } from '@/hooks/useSkin'
import { Moon, Sun } from 'react-feather'
import styled from 'styled-components'

const ThemeToggleButton = styled.button<{ $isDark: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  padding: 0;
  border: 1px solid
    ${({ $isDark }) =>
      $isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(115, 103, 240, 0.18)'};
  border-radius: 14px;
  color: ${({ $isDark }) => ($isDark ? '#fbbf24' : '#7367f0')};
  background: ${({ $isDark }) =>
    $isDark
      ? 'linear-gradient(145deg, rgba(30, 41, 59, 0.96), rgba(15, 23, 42, 0.92))'
      : 'linear-gradient(145deg, rgba(255, 255, 255, 0.98), rgba(245, 243, 255, 0.92))'};
  box-shadow: ${({ $isDark }) =>
    $isDark
      ? '0 6px 18px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.06)'
      : '0 6px 18px rgba(31, 41, 55, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)'};
  cursor: pointer;
  backdrop-filter: blur(12px);
  transition:
    transform 180ms ease,
    box-shadow 180ms ease,
    border-color 180ms ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ $isDark }) =>
      $isDark
        ? '0 9px 22px rgba(0, 0, 0, 0.3)'
        : '0 9px 22px rgba(31, 41, 55, 0.15)'};
  }

  &:active {
    transform: translateY(0) scale(0.96);
  }

  &:focus-visible {
    outline: 3px solid rgba(115, 103, 240, 0.4);
    outline-offset: 3px;
  }

  svg {
    transition: transform 180ms ease;
  }

  &:hover svg {
    transform: rotate(-12deg) scale(1.08);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;

    svg {
      transition: none;
    }
  }
`

const ThemeToggler = () => {
  const { skin, setSkin } = useSkin()
  const isDark = skin === 'dark'
  const nextSkin = isDark ? 'light' : 'dark'

  return (
    <ThemeToggleButton
      type="button"
      $isDark={isDark}
      aria-label={`Switch to ${nextSkin} mode`}
      aria-pressed={isDark}
      title={`Switch to ${nextSkin} mode`}
      onClick={() => setSkin(nextSkin)}
    >
      {isDark ? (
        <Sun size={18} aria-hidden="true" />
      ) : (
        <Moon size={18} aria-hidden="true" />
      )}
    </ThemeToggleButton>
  )
}

export default ThemeToggler
