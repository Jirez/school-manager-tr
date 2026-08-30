import { useState, useRef, useEffect, useMemo } from "react";
import styled, { keyframes } from "styled-components";
import { Search, X, ArrowRight, FileText } from "lucide-react";
import { useTranslation } from "react-i18next";

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const SearchInputWrapper = styled.div<{ $isOpen: boolean }>`
  position: relative;
  width: 100%;
`;

const SearchInputContainer = styled.div<{ $isOpen: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  background: #ffffff;
  border: 2px solid
    ${({ $isOpen }) =>
      $isOpen ? "rgba(115, 103, 240, 0.4)" : "rgba(115, 103, 240, 0.15)"};
  border-radius: 12px;
  transition: all 0.3s ease;
  box-shadow: ${({ $isOpen }) =>
    $isOpen
      ? "0 4px 20px rgba(115, 103, 240, 0.2)"
      : "0 2px 12px rgba(115, 103, 240, 0.1)"};

  &:hover {
    border-color: rgba(115, 103, 240, 0.3);
  }

  .dark-layout & {
    background: #283046;
    border-color: ${({ $isOpen }) =>
      $isOpen ? "rgba(115, 103, 240, 0.5)" : "rgba(115, 103, 240, 0.2)"};

    &:hover {
      border-color: rgba(115, 103, 240, 0.4);
    }
  }
`;

const SearchIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 1rem;
  color: #7367f0;
  flex-shrink: 0;

  svg {
    width: 20px;
    height: 20px;
  }
`;

const Input = styled.input`
  flex: 1;
  border: none;
  outline: none;
  padding: 1rem 0.5rem;
  font-size: 1rem;
  font-weight: 400;
  color: #2c3e50;
  background: transparent;

  &::placeholder {
    color: #9ca3af;
    opacity: 0.7;
  }

  .dark-layout & {
    color: #e4e6eb;

    &::placeholder {
      color: #6b7280;
    }
  }
`;

const ClearButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  margin-right: 0.5rem;
  border: none;
  background: transparent;
  color: #6c757d;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s ease;
  opacity: 0.7;

  &:hover {
    background: rgba(115, 103, 240, 0.1);
    color: #7367f0;
    opacity: 1;
  }

  .dark-layout & {
    color: #9ca3af;

    &:hover {
      color: #9e95f5;
      background: rgba(115, 103, 240, 0.2);
    }
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const Dropdown = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: #ffffff;
  border: 1px solid rgba(115, 103, 240, 0.2);
  border-radius: 12px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  max-height: 400px;
  overflow-y: auto;
  z-index: 1000;
  animation: ${fadeIn} 0.2s ease-out;
  display: ${({ $isOpen }) => ($isOpen ? "block" : "none")};

  .dark-layout & {
    background: #283046;
    border-color: rgba(115, 103, 240, 0.3);
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3),
      0 4px 6px -2px rgba(0, 0, 0, 0.2);
  }

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 12px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(115, 103, 240, 0.3);
    border-radius: 12px;

    &:hover {
      background: rgba(115, 103, 240, 0.5);
    }
  }

  .dark-layout & {
    &::-webkit-scrollbar-track {
      background: #1f2937;
    }

    &::-webkit-scrollbar-thumb {
      background: rgba(115, 103, 240, 0.4);

      &:hover {
        background: rgba(115, 103, 240, 0.6);
      }
    }
  }
`;

const ResultsHeader = styled.div`
  padding: 0.75rem 1rem;
  border-bottom: 1px solid rgba(115, 103, 240, 0.1);
  font-size: 0.75rem;
  font-weight: 600;
  color: #6c757d;
  text-transform: uppercase;
  letter-spacing: 0.05em;

  .dark-layout & {
    border-bottom-color: rgba(115, 103, 240, 0.2);
    color: #9ca3af;
  }
`;

const ResultItem = styled.div<{
  $isSelected: boolean;
  $isHighlighted: boolean;
}>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  cursor: pointer;
  transition: all 0.15s ease;
  background: ${({ $isSelected }) =>
    $isSelected ? "rgba(115, 103, 240, 0.1)" : "transparent"};
  border-left: 3px solid
    ${({ $isSelected }) => ($isSelected ? "#7367f0" : "transparent")};

  &:hover {
    background: rgba(115, 103, 240, 0.08);
    border-left-color: rgba(115, 103, 240, 0.5);
  }

  .dark-layout & {
    background: ${({ $isSelected }) =>
      $isSelected ? "rgba(115, 103, 240, 0.15)" : "transparent"};

    &:hover {
      background: rgba(115, 103, 240, 0.12);
    }
  }
`;

const ResultIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: rgba(115, 103, 240, 0.1);
  flex-shrink: 0;

  svg {
    color: #7367f0;
    width: 18px;
    height: 18px;
  }

  .dark-layout & {
    background: rgba(115, 103, 240, 0.2);

    svg {
      color: #9e95f5;
    }
  }
`;

const ResultContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const ResultTitle = styled.div`
  font-size: 0.95rem;
  font-weight: 500;
  color: #2c3e50;
  margin-bottom: 0.25rem;
  line-height: 1.4;

  .dark-layout & {
    color: #e4e6eb;
  }
`;

const HighlightedText = styled.span`
  background: rgba(115, 103, 240, 0.2);
  color: #7367f0;
  font-weight: 600;
  padding: 0 2px;
  border-radius: 3px;

  .dark-layout & {
    background: rgba(115, 103, 240, 0.3);
    color: #9e95f5;
  }
`;

const ResultArrow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  opacity: 0;
  transition: all 0.2s ease;
  flex-shrink: 0;

  ${ResultItem}:hover & {
    opacity: 1;
    color: #7367f0;
  }

  .dark-layout & {
    color: #6b7280;

    ${ResultItem}:hover & {
      color: #9e95f5;
    }
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const EmptyResults = styled.div`
  padding: 2rem 1rem;
  text-align: center;
  color: #6c757d;

  .dark-layout & {
    color: #9ca3af;
  }
`;

const EmptyResultsIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  margin: 0 auto 0.75rem;
  border-radius: 50%;
  background: rgba(115, 103, 240, 0.1);

  svg {
    color: #7367f0;
    width: 24px;
    height: 24px;
  }

  .dark-layout & {
    background: rgba(115, 103, 240, 0.2);

    svg {
      color: #9e95f5;
    }
  }
`;

const EmptyResultsText = styled.p`
  margin: 0;
  font-size: 0.9rem;
`;

interface SearchOption {
  id: string;
  title: string;
  link: string;
  [key: string]: any;
}

interface AlgoliaSearchProps {
  options: SearchOption[];
  placeholder?: string;
  onSelect: (option: SearchOption | null) => void;
  getOptionLabel?: (option: SearchOption) => string;
}

const AlgoliaSearch: React.FC<AlgoliaSearchProps> = ({
  options,
  placeholder = "Search...",
  onSelect,
  getOptionLabel = (option) => option.title,
}) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter options based on query
  const filteredOptions = useMemo(() => {
    if (!query.trim()) return [];
    const lowerQuery = query.toLowerCase();
    return options.filter((option) =>
      getOptionLabel(option).toLowerCase().includes(lowerQuery)
    );
  }, [query, options, getOptionLabel]);

  // Highlight matching text
  const highlightText = (text: string, searchQuery: string) => {
    if (!searchQuery.trim()) return text;
    const parts = text.split(new RegExp(`(${searchQuery})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === searchQuery.toLowerCase() ? (
        <HighlightedText key={index}>{part}</HighlightedText>
      ) : (
        part
      )
    );
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setIsOpen(value.length > 0);
    setSelectedIndex(-1);
  };

  // Handle option selection
  const handleSelect = (option: SearchOption) => {
    setQuery(getOptionLabel(option));
    setIsOpen(false);
    onSelect(option);
    inputRef.current?.blur();
  };

  // Handle clear
  const handleClear = () => {
    setQuery("");
    setIsOpen(false);
    setSelectedIndex(-1);
    onSelect(null);
    inputRef.current?.focus();
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || filteredOptions.length === 0) {
      if (e.key === "Enter" && query.trim()) {
        // Try to select first result if available
        if (filteredOptions.length > 0) {
          handleSelect(filteredOptions[0]);
        }
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredOptions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < filteredOptions.length) {
          handleSelect(filteredOptions[selectedIndex]);
        } else if (filteredOptions.length > 0) {
          handleSelect(filteredOptions[0]);
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Scroll selected item into view
  useEffect(() => {
    if (selectedIndex >= 0 && dropdownRef.current) {
      const selectedElement = dropdownRef.current.children[
        selectedIndex + 1
      ] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({
          block: "nearest",
          behavior: "smooth",
        });
      }
    }
  }, [selectedIndex]);

  return (
    <SearchInputWrapper ref={containerRef} $isOpen={isOpen}>
      <SearchInputContainer $isOpen={isOpen}>
        <SearchIconWrapper>
          <Search size={20} strokeWidth={2} />
        </SearchIconWrapper>
        <Input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length > 0 && setIsOpen(true)}
          placeholder={placeholder}
        />
        {query && (
          <ClearButton onClick={handleClear} type="button" aria-label="Clear">
            <X size={18} />
          </ClearButton>
        )}
      </SearchInputContainer>
      <Dropdown
        ref={dropdownRef}
        $isOpen={isOpen && filteredOptions.length > 0}
      >
        <ResultsHeader>
          {filteredOptions.length} {t("label-result")}
          {filteredOptions.length !== 1 ? "s" : ""}
        </ResultsHeader>
        {filteredOptions.map((option, index) => (
          <ResultItem
            key={option.id || index}
            $isSelected={index === selectedIndex}
            $isHighlighted={false}
            onClick={() => handleSelect(option)}
            onMouseEnter={() => setSelectedIndex(index)}
          >
            <ResultIcon>
              <FileText size={18} />
            </ResultIcon>
            <ResultContent>
              <ResultTitle>
                {highlightText(getOptionLabel(option), query)}
              </ResultTitle>
            </ResultContent>
            <ResultArrow>
              <ArrowRight size={18} />
            </ResultArrow>
          </ResultItem>
        ))}
      </Dropdown>
      {isOpen && query.trim() && filteredOptions.length === 0 && (
        <Dropdown $isOpen={true}>
          <EmptyResults>
            <EmptyResultsIcon>
              <Search size={24} />
            </EmptyResultsIcon>
            <EmptyResultsText>
              {t("label-noResultsFoundFor", { query })}
            </EmptyResultsText>
          </EmptyResults>
        </Dropdown>
      )}
    </SearchInputWrapper>
  );
};

export default AlgoliaSearch;
