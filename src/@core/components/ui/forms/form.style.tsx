import { styled, keyframes } from 'styled-components'
import { motion } from 'motion/react'
import { FormFeedback, Label } from 'reactstrap'

export const TableFadeIn = keyframes`
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
`

export const TableSlideIn = keyframes`
  from { opacity: 0; transform: translateX(-8px); }
  to { opacity: 1; transform: translateX(0); }
`

export const TableContainer = styled.div`
  border: 1px solid rgba(115, 103, 240, 0.2);
  border-radius: 12px;
  overflow: hidden;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.95) 0%,
    rgba(255, 255, 255, 0.98) 100%
  );
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06),
    0 0 0 1px rgba(115, 103, 240, 0.05);
  margin-bottom: 1rem;
  animation: ${TableFadeIn} 0.3s ease-out;
  backdrop-filter: blur(10px);
  position: relative;
  width: 100%;
  overflow-x: auto;

  .dark-layout & {
    background: linear-gradient(
      135deg,
      rgba(40, 48, 70, 0.95) 0%,
      rgba(40, 48, 70, 0.98) 100%
    );
    border-color: rgba(115, 103, 240, 0.3);
    box-shadow:
      0 4px 6px -1px rgba(0, 0, 0, 0.3),
      0 2px 4px -1px rgba(0, 0, 0, 0.2),
      0 0 0 1px rgba(115, 103, 240, 0.1);
  }
`

export const StyledTable = styled.table`
  margin-bottom: 0;
  font-size: 0.875rem;
  background: #f9fafb;
  border-collapse: separate;
  border-spacing: 0;
  width: 100%;

  .dark-layout & {
    background: #1f2937;
  }

  thead {
    background: linear-gradient(
      135deg,
      rgba(115, 103, 240, 0.12) 0%,
      rgba(115, 103, 240, 0.08) 50%,
      rgba(115, 103, 240, 0.12) 100%
    );
    border-bottom: 2px solid rgba(115, 103, 240, 0.25);

    th {
      padding: 0.875rem 0.75rem;
      font-weight: 700;
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #1f2937;
      border: 1px solid rgba(115, 103, 240, 0.2);
      border-top: none;
      white-space: nowrap;
      vertical-align: middle;
      text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8);
      background: linear-gradient(
        135deg,
        rgba(115, 103, 240, 0.12) 0%,
        rgba(115, 103, 240, 0.08) 50%,
        rgba(115, 103, 240, 0.12) 100%
      );

      &:first-child {
        text-align: center;
        width: 50px;
        border-top-left-radius: 12px;
        border-left: none;
      }
      &:last-child {
        text-align: center;
        width: 60px;
        border-top-right-radius: 12px;
        border-right: none;
      }
      &:not(:last-child) {
        border-right: 1px solid rgba(115, 103, 240, 0.2);
      }
    }

    .dark-layout & {
      background: linear-gradient(
        135deg,
        rgba(115, 103, 240, 0.2) 0%,
        rgba(115, 103, 240, 0.15) 50%,
        rgba(115, 103, 240, 0.2) 100%
      );
      border-bottom-color: rgba(115, 103, 240, 0.4);

      th {
        color: #f3f4f6;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        border-color: rgba(115, 103, 240, 0.3);
        background: linear-gradient(
          135deg,
          rgba(115, 103, 240, 0.2) 0%,
          rgba(115, 103, 240, 0.15) 50%,
          rgba(115, 103, 240, 0.2) 100%
        );
        &:not(:last-child) {
          border-right-color: rgba(115, 103, 240, 0.3);
        }
      }
    }
  }

  tbody {
    background: #ffffff;
    .dark-layout & {
      background: #283046;
    }

    tr {
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      animation: ${TableSlideIn} 0.3s ease-out;
      animation-fill-mode: both;
      position: relative;
      &:nth-child(even) {
        background: rgba(249, 250, 251, 0.8);
      }
      .dark-layout & {
        &:nth-child(even) {
          background: rgba(31, 41, 55, 0.5);
        }
      }
      &:hover {
        background: linear-gradient(
          90deg,
          rgba(115, 103, 240, 0.08) 0%,
          rgba(115, 103, 240, 0.06) 100%
        ) !important;
        transform: translateX(2px);
        box-shadow: -2px 0 8px rgba(115, 103, 240, 0.15);
      }

      td {
        border: 1px solid rgba(115, 103, 240, 0.15);
        border-top: none;
        vertical-align: middle;
        transition: all 0.2s ease;
        background: inherit;
        &:first-child {
          text-align: center;
          font-weight: 700;
          color: #7367f0;
          background: linear-gradient(
            135deg,
            rgba(115, 103, 240, 0.08) 0%,
            rgba(115, 103, 240, 0.05) 100%
          );
          border-left: none;
        }
        &:last-child {
          text-align: center;
          border-right: none;
        }
        &:not(:last-child) {
          border-right: 1px solid rgba(115, 103, 240, 0.15);
        }
      }
      &:last-child td {
        border-bottom: none;
      }
    }

    .dark-layout & {
      tr {
        &:hover {
          background: linear-gradient(
            90deg,
            rgba(115, 103, 240, 0.12) 0%,
            rgba(115, 103, 240, 0.08) 100%
          ) !important;
          box-shadow: -2px 0 8px rgba(115, 103, 240, 0.25);
        }
        td {
          border-color: rgba(115, 103, 240, 0.2);
          background: inherit;
          &:first-child {
            color: #a78bfa;
            background: linear-gradient(
              135deg,
              rgba(115, 103, 240, 0.15) 0%,
              rgba(115, 103, 240, 0.1) 100%
            );
          }
          &:not(:last-child) {
            border-right-color: rgba(115, 103, 240, 0.2);
          }
        }
      }
    }
  }
`

export const DeleteButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  border-radius: 6px;
  border: 1px solid transparent;
  background: rgba(239, 68, 68, 0.08);
  color: #ef4444;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  &:hover {
    background: rgba(239, 68, 68, 0.15);
    border-color: rgba(239, 68, 68, 0.3);
    color: #dc2626;
    transform: scale(1.1);
  }
  &:active {
    transform: scale(0.95);
  }
  .dark-layout & {
    background: rgba(239, 68, 68, 0.15);
    color: #f87171;
    &:hover {
      background: rgba(239, 68, 68, 0.25);
      border-color: rgba(239, 68, 68, 0.4);
      color: #fca5a5;
    }
  }
`

export const FormSkeleton = styled.div`
  display: grid;
  gap: 1rem;
  padding: 1rem;
  min-height: 24rem;

  .dark-layout & {
    background: #283046;
  }
`

export const SkeletonBlock = styled.div<{ $width?: string; $height?: string }>`
  width: ${({ $width = '100%' }) => $width};
  height: ${({ $height = '2.5rem' }) => $height};
  border-radius: 6px;
  background: linear-gradient(
    90deg,
    rgba(115, 103, 240, 0.08) 25%,
    rgba(115, 103, 240, 0.18) 50%,
    rgba(115, 103, 240, 0.08) 75%
  );
  background-size: 200% 100%;
  animation:
    ${TableFadeIn} 0.3s ease-out,
    skeletonShimmer 1.5s ease-in-out infinite;

  @keyframes skeletonShimmer {
    from {
      background-position: 200% 0;
    }
    to {
      background-position: -200% 0;
    }
  }

  .dark-layout & {
    background: linear-gradient(
      90deg,
      rgba(167, 139, 250, 0.12) 25%,
      rgba(167, 139, 250, 0.25) 50%,
      rgba(167, 139, 250, 0.12) 75%
    );
    background-size: 200% 100%;
  }
`

export const SelectionCard = styled.div`
  background: linear-gradient(
    135deg,
    rgba(115, 103, 240, 0.08) 0%,
    rgba(139, 92, 246, 0.05) 100%
  );
  border: 2px solid rgba(115, 103, 240, 0.2);
  border-radius: 12px;
  padding: 1.5rem;
  //margin-top: 1.5rem;
  box-shadow: 0 2px 8px rgba(115, 103, 240, 0.1);
  transition: all 0.3s ease;

  &:hover {
    border-color: rgba(115, 103, 240, 0.3);
    box-shadow: 0 4px 12px rgba(115, 103, 240, 0.15);
  }

  .dark-layout & {
    background: linear-gradient(
      135deg,
      rgba(115, 103, 240, 0.15) 0%,
      rgba(139, 92, 246, 0.1) 100%
    );
    border-color: rgba(115, 103, 240, 0.3);
    box-shadow: 0 2px 8px rgba(115, 103, 240, 0.2);
  }
`

export const SelectGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
`

export const SelectWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

export const LabelWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  svg {
    color: #7367f0;
    filter: drop-shadow(0 2px 4px rgba(115, 103, 240, 0.3));
  }

  .dark-layout & {
    svg {
      color: #9e95f5;
      filter: drop-shadow(0 2px 4px rgba(158, 149, 245, 0.4));
    }
  }

  label {
    font-size: 0.875rem;
    font-weight: 600;
    color: #2c3e50;
    text-transform: uppercase;
    letter-spacing: 0.03em;

    .dark-layout & {
      color: #e4e6eb;
    }
  }
`

export const ContentCard = styled.div`
  background: #ffffff;
  border: 2px solid rgba(115, 103, 240, 0.15);
  border-radius: 12px;
  padding: 0;
  margin-top: 1.5rem;
  box-shadow: 0 2px 8px rgba(115, 103, 240, 0.08);
  overflow: hidden;

  .dark-layout & {
    background: #283046;
    border-color: rgba(115, 103, 240, 0.25);
    box-shadow: 0 2px 8px rgba(115, 103, 240, 0.15);
  }
`

export const LoadingCard = styled.div`
  background: linear-gradient(
    135deg,
    rgba(59, 130, 246, 0.05) 0%,
    rgba(147, 51, 234, 0.05) 100%
  );
  border: 2px solid rgba(59, 130, 246, 0.2);
  border-radius: 12px;
  padding: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1.5rem;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.1);

  .dark-layout & {
    background: linear-gradient(
      135deg,
      rgba(59, 130, 246, 0.1) 0%,
      rgba(147, 51, 234, 0.1) 100%
    );
    border-color: rgba(59, 130, 246, 0.3);
  }
`

export const EmptyStateCard = styled.div`
  background: linear-gradient(
    135deg,
    rgba(168, 85, 247, 0.06) 0%,
    rgba(139, 92, 246, 0.04) 100%
  );
  border: 2px dashed rgba(168, 85, 247, 0.3);
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  margin-top: 1.5rem;
  transition: all 0.3s ease;

  &:hover {
    border-color: rgba(168, 85, 247, 0.4);
    background: linear-gradient(
      135deg,
      rgba(168, 85, 247, 0.08) 0%,
      rgba(139, 92, 246, 0.06) 100%
    );
  }

  .dark-layout & {
    background: linear-gradient(
      135deg,
      rgba(168, 85, 247, 0.1) 0%,
      rgba(139, 92, 246, 0.08) 100%
    );
    border-color: rgba(168, 85, 247, 0.4);
  }
`

export const ErrorCard = styled.div`
  background: linear-gradient(
    135deg,
    rgba(244, 67, 54, 0.06) 0%,
    rgba(233, 30, 99, 0.04) 100%
  );
  border: 2px dashed rgba(244, 67, 54, 0.3);
  border-radius: 12px;
  padding: 3rem;
  text-align: center;
  margin-top: 1.5rem;
  transition: all 0.3s ease;

  &:hover {
    border-color: rgba(244, 67, 54, 0.4);
    background: linear-gradient(
      135deg,
      rgba(244, 67, 54, 0.08) 0%,
      rgba(233, 30, 99, 0.06) 100%
    );
  }

  .dark-layout & {
    background: linear-gradient(
      135deg,
      rgba(244, 67, 54, 0.1) 0%,
      rgba(233, 30, 99, 0.08) 100%
    );
    border-color: rgba(244, 67, 54, 0.4);
  }
`

export const TotalBadge = styled(motion.div)`
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #28c76f 0%, #48da89 100%);
  border-radius: 12px;
  color: white;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 15px rgba(40, 199, 111, 0.2);

  .total-label {
    font-size: 0.75rem;
    font-weight: 500;
    opacity: 0.9;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .total-value {
    font-size: 1.25rem;
    font-weight: 800;
    font-family: var(--font-mono);
  }
`

export const ItemsContainer = styled.div`
  background: white;
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  overflow: hidden;
  margin-top: 0.5rem;

  .dark-layout & {
    background: #283046;
    border-color: rgba(255, 255, 255, 0.05);
  }

  table {
    margin-bottom: 0;
    font-size: 0.85rem;

    th {
      background: rgba(0, 0, 0, 0.02);
      font-weight: 600;
      color: #5e5873;
      padding: 0.6rem;
      border-bottom: 2px solid rgba(0, 0, 0, 0.05);
      font-size: 0.75rem;
      text-transform: uppercase;
    }

    td {
      padding: 0rem;
      vertical-align: middle;
      border-bottom: 1px solid rgba(0, 0, 0, 0.03);
    }

    .dark-layout & {
      th {
        background: rgba(255, 255, 255, 0.02);
        color: #b4b7bd;
        border-bottom-color: rgba(255, 255, 255, 0.05);
      }
      td {
        border-bottom-color: rgba(255, 255, 255, 0.03);
      }
    }
  }
`

export const DeleteBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: none;
  background: rgba(234, 84, 85, 0.08);
  color: #ea5455;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(234, 84, 85, 0.15);
    transform: scale(1.05);
  }

  svg {
    width: 14px;
    height: 14px;
  }
`

export const StyledFormFeedback = styled(FormFeedback)`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-top: 0.375rem;
  font-size: 0.875rem;
  color: #ea5455;
  animation: fadeIn 0.2s ease-in-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`

export const StyledLabel = styled(Label)<{
  $error?: boolean
  $customClassName?: string
}>`
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  transition: color 0.2s ease;

  .dark-layout & {
    color: #d1d5db;
  }

  ${({ $error }) =>
    $error &&
    `
    color: #ea5455;

    .dark-layout & {
      color: #ea5455;
    }
  `}
`
