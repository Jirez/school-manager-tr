import { styled } from "styled-components";

// Styled Components
export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100%;
`;

export const HeaderSection = styled.div`
  margin-bottom: 1.5rem;
`;

export const TabContainer = styled.div`
  width: 100%;

  .nav-tabs {
    border-bottom: 2px solid rgba(115, 103, 240, 0.1);
    margin-bottom: 1.5rem;
    gap: 0.5rem;

    .dark-layout & {
      border-bottom-color: rgba(115, 103, 240, 0.2);
    }
  }

  .nav-link {
    border: none;
    padding: 0.75rem 1.25rem;
    font-weight: 500;
    color: #6c757d;
    border-radius: 8px 8px 0 0;
    transition: all 0.2s ease;

    &:hover {
      color: #7367f0;
      background: rgba(115, 103, 240, 0.08);
    }

    &.active {
      color: #7367f0;
      background: rgba(115, 103, 240, 0.1);
      border-bottom: 2px solid #7367f0;
    }

    .dark-layout & {
      color: #9ca3af;

      &:hover {
        background: rgba(115, 103, 240, 0.15);
      }

      &.active {
        color: #7367f0;
        background: rgba(115, 103, 240, 0.2);
      }
    }
  }
`;

export const ConfigCard = styled.div`
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(115, 103, 240, 0.1);
  overflow: hidden;
  margin-bottom: 1.5rem;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4px 16px rgba(115, 103, 240, 0.12);
    border-color: rgba(115, 103, 240, 0.2);
  }

  .dark-layout & {
    background: #283046;
    border-color: rgba(115, 103, 240, 0.2);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);

    &:hover {
      box-shadow: 0 4px 16px rgba(115, 103, 240, 0.2);
      border-color: rgba(115, 103, 240, 0.4);
    }
  }
`;

export const CardHeader = styled.div<{ $isEditing?: boolean }>`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  background: ${({ $isEditing }) =>
    $isEditing
      ? "linear-gradient(135deg, rgba(255, 159, 67, 0.1) 0%, rgba(255, 159, 67, 0.05) 100%)"
      : "linear-gradient(135deg, rgba(115, 103, 240, 0.08) 0%, rgba(115, 103, 240, 0.03) 100%)"};
  border-bottom: 1px solid
    ${({ $isEditing }) =>
      $isEditing ? "rgba(255, 159, 67, 0.2)" : "rgba(115, 103, 240, 0.1)"};

  .dark-layout & {
    background: ${({ $isEditing }) =>
      $isEditing ? "rgba(255, 159, 67, 0.15)" : "rgba(115, 103, 240, 0.15)"};
    border-bottom-color: ${({ $isEditing }) =>
      $isEditing ? "rgba(255, 159, 67, 0.3)" : "rgba(115, 103, 240, 0.25)"};
  }
`;

export const HeaderLeft = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
`;

export const IconWrapper = styled.div<{ $color?: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: ${({ $color }) =>
    $color
      ? `linear-gradient(135deg, ${$color} 0%, ${$color}cc 100%)`
      : "linear-gradient(135deg, #7367f0 0%, #9e95f5 100%)"};
  box-shadow: 0 4px 12px
    ${({ $color }) => ($color ? `${$color}40` : "rgba(115, 103, 240, 0.3)")};
  flex-shrink: 0;

  svg {
    color: #ffffff;
  }
`;

export const TitleSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const CardTitle = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;

  .dark-layout & {
    color: #e4e6eb;
  }
`;

export const CardDescription = styled.p`
  margin: 0;
  font-size: 0.85rem;
  color: #6c757d;
  max-width: 400px;

  .dark-layout & {
    color: #9ca3af;
  }
`;

export const EditButton = styled.button<{ $isEditing?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${({ $isEditing }) =>
    $isEditing ? "rgba(234, 84, 85, 0.1)" : "rgba(115, 103, 240, 0.1)"};
  color: ${({ $isEditing }) => ($isEditing ? "#ea5455" : "#7367f0")};

  &:hover {
    background: ${({ $isEditing }) =>
      $isEditing ? "rgba(234, 84, 85, 0.2)" : "rgba(115, 103, 240, 0.2)"};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  .dark-layout & {
    background: ${({ $isEditing }) =>
      $isEditing ? "rgba(234, 84, 85, 0.2)" : "rgba(115, 103, 240, 0.2)"};

    &:hover {
      background: ${({ $isEditing }) =>
        $isEditing ? "rgba(234, 84, 85, 0.3)" : "rgba(115, 103, 240, 0.3)"};
    }
  }
`;

export const CardContent = styled.div`
  padding: 1.5rem;
`;

export const GridRow = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;

  @media (min-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export const EmptyTabContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  background: rgba(115, 103, 240, 0.03);
  border: 2px dashed rgba(115, 103, 240, 0.15);
  border-radius: 12px;

  .dark-layout & {
    background: rgba(115, 103, 240, 0.08);
    border-color: rgba(115, 103, 240, 0.25);
  }
`;

export const EmptyIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: rgba(115, 103, 240, 0.1);
  margin-bottom: 1rem;

  svg {
    color: #7367f0;
    opacity: 0.6;
  }

  .dark-layout & {
    background: rgba(115, 103, 240, 0.2);
  }
`;

export const EmptyText = styled.p`
  margin: 0;
  color: #6c757d;
  font-size: 0.95rem;

  .dark-layout & {
    color: #9ca3af;
  }
`;
