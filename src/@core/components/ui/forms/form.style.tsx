import { styled } from "styled-components";
import { motion } from "motion/react";
import { FormFeedback, Label } from 'reactstrap'

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
`;

export const SelectGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

export const SelectWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

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
`;

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
`;

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
`;

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
`;

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
`;

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
`;

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
`;

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
`;

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
