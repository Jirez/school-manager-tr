import { Badge } from "reactstrap";
import { styled } from "styled-components";

// styled components
export const PriceText = styled.span`
  font-family: "JetBrains Mono", monospace;
  font-weight: 500;
  color: #334155;
  .dark-layout & {
    color: #cbd5e1;
  }
`;

export const SkuText = styled.span`
  font-family: "JetBrains Mono", monospace;
  font-size: 0.75rem;
  padding: 2px 6px;
  background: #f1f5f9;
  border-radius: 4px;
  color: #475569;
  .dark-layout & {
    background: #1e293b;
    color: #94a3b8;
  }
`;

export const StockBadge = styled.span<{ $quantity: number }>`
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;

  ${(props) =>
    props.$quantity <= 0
      ? `
    background: #fff1f2;
    color: #e11d48;
    border: 1px solid #fda4af;
    .dark-layout & {
      background: rgba(225, 29, 72, 0.1);
      border-color: rgba(225, 29, 72, 0.2);
    }
  `
      : props.$quantity <= 5
      ? `
    background: #fff7ed;
    color: #ea580c;
    border: 1px solid #fdba74;
    .dark-layout & {
      background: rgba(234, 88, 12, 0.1);
      border-color: rgba(234, 88, 12, 0.2);
    }
  `
      : `
    background: #f0fdf4;
    color: #16a34a;
    border: 1px solid #86efac;
    .dark-layout & {
      background: rgba(22, 163, 74, 0.1);
      border-color: rgba(22, 163, 74, 0.2);
    }
  `}
`;

export const TypeBadge = styled.span<{
  $color?: "success" | "danger" | "warning" | "info" | "primary" | "secondary";
}>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 9999px; // Full pill
  font-size: 0.75rem;
  font-weight: 500;

  // Default (secondary/gray) styles if no color is provided
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  color: #64748b;

  .dark-layout & {
    background: #0f172a;
    border-color: #1e293b;
    color: #94a3b8;
  }

  ${(props) => {
    switch (props.$color) {
      case "success":
        return `
          background: #f0fdf4;
          color: #16a34a;
          border-color: #86efac;
          .dark-layout & {
            background: rgba(22, 163, 74, 0.1);
            border-color: rgba(22, 163, 74, 0.2);
            color: #4ade80;
          }
        `;
      case "danger":
        return `
          background: #fff1f2;
          color: #e11d48;
          border-color: #fda4af;
          .dark-layout & {
            background: rgba(225, 29, 72, 0.1);
            border-color: rgba(225, 29, 72, 0.2);
            color: #fb7185;
          }
        `;
      case "warning":
        return `
          background: #fff7ed;
          color: #ea580c;
          border-color: #fdba74;
          .dark-layout & {
            background: rgba(234, 88, 12, 0.1);
            border-color: rgba(234, 88, 12, 0.2);
            color: #fb923c;
          }
        `;
      case "info":
        return `
          background: #eff6ff;
          color: #2563eb;
          border-color: #93c5fd;
          .dark-layout & {
            background: rgba(37, 99, 235, 0.1);
            border-color: rgba(37, 99, 235, 0.2);
            color: #60a5fa;
          }
        `;
      case "primary":
        return `
          background: #f0f9ff;
          color: #2f8724;
          border-color: #86efac;
          .dark-layout & {
            background: rgba(47, 135, 36, 0.1);
            border-color: rgba(47, 135, 36, 0.2);
          }
        `;
      case "secondary":
      default:
        // Already handled by default styles above, but explicit case doesn't hurt
        return ``;
    }
  }}
`;
export const StatusBadge = styled.span<{
  $variant?: "success" | "warning" | "info" | "primary" | "secondary";
}>`
  display: inline-flex;
  align-items: center;
  gap: 2px;
  padding: 2px 6px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: capitalize;

  ${(props) => {
    switch (props.$variant) {
      case "success":
        return `
          background: #f0fdf4;
          color: #16a34a;
          border: 1px solid #86efac;
          .dark-layout & {
            background: rgba(22, 163, 74, 0.1);
            border-color: rgba(22, 163, 74, 0.2);
          }
        `;
      case "warning":
        return `
          background: #fff7ed;
          color: #ea580c;
          border: 1px solid #fdba74;
          .dark-layout & {
            background: rgba(234, 88, 12, 0.1);
            border-color: rgba(234, 88, 12, 0.2);
          }
        `;
      case "info":
        return `
          background: #eff6ff;
          color: #2563eb;
          border: 1px solid #93c5fd;
          .dark-layout & {
            background: rgba(37, 99, 235, 0.1);
            border-color: rgba(37, 99, 235, 0.2);
          }
        `;
      case "primary":
        return `
          background: #f0f9ff; /* slightly different for primary */
          color: #2f8724; /* Primary Green */
          border: 1px solid #86efac; // lighter green
          .dark-layout & {
            background: rgba(47, 135, 36, 0.1);
            border-color: rgba(47, 135, 36, 0.2);
          }
        `;
      case "secondary":
      default:
        return `
          background: #f8fafc;
          color: #64748b;
          border: 1px solid #e2e8f0;
          .dark-layout & {
            background: #1e293b;
            color: #94a3b8;
            border-color: #334155;
          }
        `;
    }
  }}
`;

export const GenderBadge = styled(Badge)<{ gender: string }>`
  padding: 0.35em 0.75em;
  font-size: 0.7rem;
  font-weight: 700;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: all 0.2s ease-in-out;
  cursor: default;

  ${(props) =>
    props.gender === "M"
      ? `
      background: #7367f0;
      color: #ffffff;
      box-shadow: 0 2px 6px rgba(115, 103, 240, 0.35);
      
      .dark-layout & {
        background: #8b7ff5;
        color: #ffffff;
        box-shadow: 0 2px 8px rgba(115, 103, 240, 0.4);
      }

      &:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 10px rgba(115, 103, 240, 0.45);
        background: #6358dc;
      }
      `
      : `
      background: #ea5455;
      color: #ffffff;
      box-shadow: 0 2px 6px rgba(234, 84, 85, 0.35);

      .dark-layout & {
        background: #f06d6e;
        color: #ffffff;
        box-shadow: 0 2px 8px rgba(234, 84, 85, 0.4);
      }

      &:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 10px rgba(234, 84, 85, 0.45);
        background: #d94849;
      }
      `}
`;

export const AgeBadge = styled.span<{ age: number }>`
  font-family: monospace;
  font-weight: 600;
  font-size: 0.8rem;
  padding: 2px 6px;
  border-radius: 4px;
  background: ${(props) => {
    if (props.age < 10) return "#28c76f15";
    if (props.age < 18) return "#7367f015";
    return "#ff9f4315";
  }};
  color: ${(props) => {
    if (props.age < 10) return "#28c76f";
    if (props.age < 18) return "#7367f0";
    return "#ff9f43";
  }};
`;

export const CompactDate = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: "JetBrains Mono", monospace;
  font-size: 0.75rem;
  color: #6e6b7b;

  svg {
    opacity: 0.6;
  }
`;

export const LocationText = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8125rem;
  color: #5e5873;
`;

export const RegistrationBadge = styled.span`
  font-family: monospace;
  font-size: 0.75rem;
  color: #7367f0;
  background: #7367f015;
  padding: 1px 4px;
  border-radius: 4px;
`;
