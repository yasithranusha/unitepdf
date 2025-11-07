import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { DuplexToggle } from "@/components/DuplexToggle";
import { TooltipProvider } from "@/components/ui/tooltip";

// Helper to render with TooltipProvider
function renderWithTooltipProvider(ui: React.ReactElement) {
  return render(<TooltipProvider>{ui}</TooltipProvider>);
}

describe("DuplexToggle Component", () => {
  it("should render the toggle switch", () => {
    const { getByRole } = renderWithTooltipProvider(<DuplexToggle enabled={false} onChange={vi.fn()} />);

    const toggle = getByRole("switch");
    expect(toggle).toBeInTheDocument();
  });

  it("should render label text", () => {
    const { getByText } = renderWithTooltipProvider(<DuplexToggle enabled={false} onChange={vi.fn()} />);

    expect(getByText(/duplex/i)).toBeInTheDocument();
    expect(getByText(/print/i)).toBeInTheDocument();
  });

  it("should show initial unchecked state", () => {
    const { getByRole } = renderWithTooltipProvider(<DuplexToggle enabled={false} onChange={vi.fn()} />);

    const toggle = getByRole("switch");
    expect(toggle).toHaveAttribute("aria-checked", "false");
  });

  it("should show initial checked state", () => {
    const { getByRole } = renderWithTooltipProvider(<DuplexToggle enabled={true} onChange={vi.fn()} />);

    const toggle = getByRole("switch");
    expect(toggle).toHaveAttribute("aria-checked", "true");
  });

  it("should call onChange when toggled", async () => {
    const user = userEvent.setup();
    const mockOnChange = vi.fn();
    const { getByRole } = renderWithTooltipProvider(<DuplexToggle enabled={false} onChange={mockOnChange} />);

    const toggle = getByRole("switch");
    await user.click(toggle);

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith(true);
  });

  it("should toggle from enabled to disabled", async () => {
    const user = userEvent.setup();
    const mockOnChange = vi.fn();
    const { getByRole } = renderWithTooltipProvider(<DuplexToggle enabled={true} onChange={mockOnChange} />);

    const toggle = getByRole("switch");
    await user.click(toggle);

    expect(mockOnChange).toHaveBeenCalledWith(false);
  });

  it("should have info tooltip", () => {
    const { container } = renderWithTooltipProvider(<DuplexToggle enabled={false} onChange={vi.fn()} />);

    // Tooltip trigger should be present (usually an info icon)
    const tooltipTrigger = container.querySelector('[data-testid="tooltip-trigger"]');
    expect(tooltipTrigger).toBeInTheDocument();
  });

  it("should show explanation in tooltip", async () => {
    const user = userEvent.setup();
    const { container, findAllByText } = renderWithTooltipProvider(<DuplexToggle enabled={false} onChange={vi.fn()} />);

    const tooltipTrigger = container.querySelector('[data-testid="tooltip-trigger"]') as HTMLElement;
    expect(tooltipTrigger).toBeInTheDocument();

    // Hover over tooltip trigger
    await user.hover(tooltipTrigger);

    // Tooltip content should appear with explanation about proper alignment
    const tooltipContents = await findAllByText(/proper alignment/i);
    expect(tooltipContents.length).toBeGreaterThan(0);
    expect(tooltipContents[0]).toHaveTextContent(/double-sided/i);
    expect(tooltipContents[0]).toHaveTextContent(/opposite sides/i);
  });

  it("should be keyboard accessible", async () => {
    const user = userEvent.setup();
    const mockOnChange = vi.fn();
    const { getByRole } = renderWithTooltipProvider(<DuplexToggle enabled={false} onChange={mockOnChange} />);

    const toggle = getByRole("switch");

    // Focus the toggle
    toggle.focus();
    expect(toggle).toHaveFocus();

    // Press Space to toggle
    await user.keyboard(" ");
    expect(mockOnChange).toHaveBeenCalled();
  });

  it("should have proper ARIA labels", () => {
    const { getByRole } = renderWithTooltipProvider(<DuplexToggle enabled={false} onChange={vi.fn()} />);

    const toggle = getByRole("switch");
    expect(toggle).toHaveAttribute("aria-label");
  });

  it("should show description text about odd pages", () => {
    const { getByText } = render(<DuplexToggle enabled={false} onChange={vi.fn()} />);

    // Should explain what duplex does
    expect(getByText(/odd.*page/i) || getByText(/blank.*page/i)).toBeInTheDocument();
  });
});
