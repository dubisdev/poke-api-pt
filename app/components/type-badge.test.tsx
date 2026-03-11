import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import TypeBadge from "./type-badge";

describe("TypeBadge", () => {
  it("renders the formatted type name", () => {
    render(<TypeBadge type="fire" />);
    expect(screen.getByText("Fire")).toBeInTheDocument();
  });

  it("formats hyphenated type names", () => {
    render(<TypeBadge type="ground" />);
    expect(screen.getByText("Ground")).toBeInTheDocument();
  });

  it("applies sm size classes by default", () => {
    const { container } = render(<TypeBadge type="water" />);
    expect(container.firstChild).toHaveClass("px-2", "py-0.5", "text-xs");
  });

  it("applies md size classes when size is md", () => {
    const { container } = render(<TypeBadge type="water" size="md" />);
    expect(container.firstChild).toHaveClass("px-3", "py-1", "text-sm");
  });

  it("applies a fallback color for unknown types", () => {
    const { container } = render(<TypeBadge type="unknown-type" />);
    expect(container.firstChild).toHaveClass("bg-gray-400");
  });

  it("applies the correct color class for known types", () => {
    const { container } = render(<TypeBadge type="fire" />);
    expect(container.firstChild).toHaveClass("bg-orange-500");
  });
});
