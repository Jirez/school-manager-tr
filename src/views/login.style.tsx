import { styled } from "styled-components";

export const SocialIconsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.25rem;
  margin-top: 1.5rem;
`;

export const SocialIconButton = styled.a<{
  $brand: "facebook" | "twitter" | "google" | "github";
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  border: 1px solid
    ${({ $brand }) => {
      switch ($brand) {
        case "facebook":
          return "rgba(59, 89, 152, 0.2)";
        case "twitter":
          return "rgba(29, 161, 242, 0.2)";
        case "google":
          return "rgba(219, 68, 55, 0.2)";
        case "github":
          return "rgba(36, 41, 46, 0.2)";
      }
    }};
  background-color: #ffffff;
  color: ${({ $brand }) => {
    switch ($brand) {
      case "facebook":
        return "#3b5998";
      case "twitter":
        return "#1da1f2";
      case "google":
        return "#db4437";
      case "github":
        return "#24292e";
    }
  }};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  text-decoration: none;

  &:hover {
    transform: translateY(-4px) scale(1.05);
    border-color: transparent;
    box-shadow: 0 10px 15px -3px
      ${({ $brand }) => {
        switch ($brand) {
          case "facebook":
            return "rgba(59, 89, 152, 0.3)";
          case "twitter":
            return "rgba(29, 161, 242, 0.3)";
          case "google":
            return "rgba(219, 68, 55, 0.3)";
          case "github":
            return "rgba(36, 41, 46, 0.3)";
        }
      }};
    background-color: ${({ $brand }) => {
      switch ($brand) {
        case "facebook":
          return "#3b5998";
        case "twitter":
          return "#1da1f2";
        case "google":
          return "#db4437";
        case "github":
          return "#24292e";
      }
    }};
    color: #ffffff;
  }

  .dark-layout & {
    background-color: #283046;
    border-color: rgba(255, 255, 255, 0.1);
    color: ${({ $brand }) => {
      switch ($brand) {
        case "facebook":
          return "#5a7fc2";
        case "twitter":
          return "#4db5f5";
        case "google":
          return "#e67c73";
        case "github":
          return "#e4e6eb";
      }
    }};

    &:hover {
      background-color: ${({ $brand }) => {
        switch ($brand) {
          case "facebook":
            return "#3b5998";
          case "twitter":
            return "#1da1f2";
          case "google":
            return "#db4437";
          case "github":
            return "#6e7681";
        }
      }};
      color: #ffffff;
      border-color: transparent;
    }
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

export const DividerContainer = styled.div`
  display: flex;
  align-items: center;
  margin: 1.5rem 0;

  &::before,
  &::after {
    content: "";
    flex: 1;
    height: 1px;
    background: #e9ecef;
  }

  .dark-layout & {
    &::before,
    &::after {
      background: rgba(255, 255, 255, 0.1);
    }
  }
`;

export const DividerText = styled.span`
  padding: 0 1rem;
  font-size: 0.8125rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #adb5bd;
  font-weight: 600;
`;
