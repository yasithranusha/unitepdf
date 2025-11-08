import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { CompressionToggle } from "@/components/CompressionToggle";
import { TooltipProvider } from "@/components/ui/tooltip";

// Helper to render with TooltipProvider
function renderWithTooltipProvider(ui: React.ReactElement) {
  return render(<TooltipProvider>{ui}</TooltipProvider>);
}

describe("CompressionToggle Component", () => {
  describe("Basic Rendering", () => {
    it("should render the toggle switch", () => {
      const { getByRole } = renderWithTooltipProvider(
        <CompressionToggle
          enabled={false}
          level="recommended"
          onEnabledChange={vi.fn()}
          onLevelChange={vi.fn()}
        />
      );

      const toggle = getByRole("switch");
      expect(toggle).toBeInTheDocument();
    });

    it("should render label text", () => {
      const { getByText } = renderWithTooltipProvider(
        <CompressionToggle
          enabled={false}
          level="recommended"
          onEnabledChange={vi.fn()}
          onLevelChange={vi.fn()}
        />
      );

      expect(getByText(/PDF Compression/i)).toBeInTheDocument();
      expect(getByText(/Reduce file size/i)).toBeInTheDocument();
    });

    it("should show initial unchecked state", () => {
      const { getByRole } = renderWithTooltipProvider(
        <CompressionToggle
          enabled={false}
          level="recommended"
          onEnabledChange={vi.fn()}
          onLevelChange={vi.fn()}
        />
      );

      const toggle = getByRole("switch");
      expect(toggle).toHaveAttribute("aria-checked", "false");
    });

    it("should show initial checked state", () => {
      const { getByRole } = renderWithTooltipProvider(
        <CompressionToggle
          enabled={true}
          level="recommended"
          onEnabledChange={vi.fn()}
          onLevelChange={vi.fn()}
        />
      );

      const toggle = getByRole("switch");
      expect(toggle).toHaveAttribute("aria-checked", "true");
    });
  });

  describe("Toggle Interaction", () => {
    it("should call onEnabledChange when toggled on", async () => {
      const user = userEvent.setup();
      const mockOnEnabledChange = vi.fn();
      const { getByRole } = renderWithTooltipProvider(
        <CompressionToggle
          enabled={false}
          level="recommended"
          onEnabledChange={mockOnEnabledChange}
          onLevelChange={vi.fn()}
        />
      );

      const toggle = getByRole("switch");
      await user.click(toggle);

      expect(mockOnEnabledChange).toHaveBeenCalledTimes(1);
      expect(mockOnEnabledChange).toHaveBeenCalledWith(true);
    });

    it("should call onEnabledChange when toggled off", async () => {
      const user = userEvent.setup();
      const mockOnEnabledChange = vi.fn();
      const { getByRole } = renderWithTooltipProvider(
        <CompressionToggle
          enabled={true}
          level="recommended"
          onEnabledChange={mockOnEnabledChange}
          onLevelChange={vi.fn()}
        />
      );

      const toggle = getByRole("switch");
      await user.click(toggle);

      expect(mockOnEnabledChange).toHaveBeenCalledWith(false);
    });
  });

  describe("Compression Level Options", () => {
    it("should not show compression levels when disabled", () => {
      const { queryByText } = renderWithTooltipProvider(
        <CompressionToggle
          enabled={false}
          level="recommended"
          onEnabledChange={vi.fn()}
          onLevelChange={vi.fn()}
        />
      );

      expect(queryByText(/Extreme Compression/i)).not.toBeInTheDocument();
      expect(queryByText(/Recommended Compression/i)).not.toBeInTheDocument();
      expect(queryByText(/Light Compression/i)).not.toBeInTheDocument();
    });

    it("should show compression levels when enabled", () => {
      const { getByText } = renderWithTooltipProvider(
        <CompressionToggle
          enabled={true}
          level="recommended"
          onEnabledChange={vi.fn()}
          onLevelChange={vi.fn()}
        />
      );

      expect(getByText(/Extreme Compression/i)).toBeInTheDocument();
      expect(getByText(/Recommended Compression/i)).toBeInTheDocument();
      expect(getByText(/Light Compression/i)).toBeInTheDocument();
    });

    it("should show compression level header when enabled", () => {
      const { getByText } = renderWithTooltipProvider(
        <CompressionToggle
          enabled={true}
          level="recommended"
          onEnabledChange={vi.fn()}
          onLevelChange={vi.fn()}
        />
      );

      expect(getByText(/Compression Level/i)).toBeInTheDocument();
    });

    it("should have descriptions for each compression level", () => {
      const { getByText } = renderWithTooltipProvider(
        <CompressionToggle
          enabled={true}
          level="recommended"
          onEnabledChange={vi.fn()}
          onLevelChange={vi.fn()}
        />
      );

      expect(getByText(/Maximum file size reduction/i)).toBeInTheDocument();
      expect(getByText(/Balanced quality and size/i)).toBeInTheDocument();
      expect(getByText(/Preserve maximum quality/i)).toBeInTheDocument();
    });
  });

  describe("Radio Button Selection", () => {
    it("should select recommended by default", () => {
      const { container } = renderWithTooltipProvider(
        <CompressionToggle
          enabled={true}
          level="recommended"
          onEnabledChange={vi.fn()}
          onLevelChange={vi.fn()}
        />
      );

      const recommendedRadio = container.querySelector('#compression-recommended');
      expect(recommendedRadio).toHaveAttribute("aria-checked", "true");
    });

    it("should select extreme when level is extreme", () => {
      const { container } = renderWithTooltipProvider(
        <CompressionToggle
          enabled={true}
          level="extreme"
          onEnabledChange={vi.fn()}
          onLevelChange={vi.fn()}
        />
      );

      const extremeRadio = container.querySelector('#compression-extreme');
      expect(extremeRadio).toHaveAttribute("aria-checked", "true");
    });

    it("should select light when level is light", () => {
      const { container } = renderWithTooltipProvider(
        <CompressionToggle
          enabled={true}
          level="light"
          onEnabledChange={vi.fn()}
          onLevelChange={vi.fn()}
        />
      );

      const lightRadio = container.querySelector('#compression-light');
      expect(lightRadio).toHaveAttribute("aria-checked", "true");
    });

    it("should call onLevelChange when selecting extreme", async () => {
      const user = userEvent.setup();
      const mockOnLevelChange = vi.fn();
      const { container } = renderWithTooltipProvider(
        <CompressionToggle
          enabled={true}
          level="recommended"
          onEnabledChange={vi.fn()}
          onLevelChange={mockOnLevelChange}
        />
      );

      const extremeRadio = container.querySelector('#compression-extreme') as HTMLElement;
      await user.click(extremeRadio);

      expect(mockOnLevelChange).toHaveBeenCalledWith("extreme");
    });

    it("should call onLevelChange when selecting light", async () => {
      const user = userEvent.setup();
      const mockOnLevelChange = vi.fn();
      const { container } = renderWithTooltipProvider(
        <CompressionToggle
          enabled={true}
          level="recommended"
          onEnabledChange={vi.fn()}
          onLevelChange={mockOnLevelChange}
        />
      );

      const lightRadio = container.querySelector('#compression-light') as HTMLElement;
      await user.click(lightRadio);

      expect(mockOnLevelChange).toHaveBeenCalledWith("light");
    });
  });

  describe("Tooltips", () => {
    it("should have info tooltip for main feature", () => {
      const { container } = renderWithTooltipProvider(
        <CompressionToggle
          enabled={false}
          level="recommended"
          onEnabledChange={vi.fn()}
          onLevelChange={vi.fn()}
        />
      );

      const tooltipTrigger = container.querySelector('[data-testid="compression-tooltip-trigger"]');
      expect(tooltipTrigger).toBeInTheDocument();
    });

    it("should show main tooltip content on hover", async () => {
      const user = userEvent.setup();
      const { container, findAllByText } = renderWithTooltipProvider(
        <CompressionToggle
          enabled={false}
          level="recommended"
          onEnabledChange={vi.fn()}
          onLevelChange={vi.fn()}
        />
      );

      const tooltipTrigger = container.querySelector('[data-testid="compression-tooltip-trigger"]') as HTMLElement;
      await user.hover(tooltipTrigger);

      const tooltipContents = await findAllByText(/Reduces the file size/i);
      expect(tooltipContents.length).toBeGreaterThan(0);
      expect(tooltipContents[0]).toHaveTextContent(/optimizing images/i);
    });
  });

  describe("Accessibility", () => {
    it("should be keyboard accessible", async () => {
      const user = userEvent.setup();
      const mockOnEnabledChange = vi.fn();
      const { getByRole } = renderWithTooltipProvider(
        <CompressionToggle
          enabled={false}
          level="recommended"
          onEnabledChange={mockOnEnabledChange}
          onLevelChange={vi.fn()}
        />
      );

      const toggle = getByRole("switch");

      // Focus the toggle
      toggle.focus();
      expect(toggle).toHaveFocus();

      // Press Space to toggle
      await user.keyboard(" ");
      expect(mockOnEnabledChange).toHaveBeenCalled();
    });

    it("should have proper ARIA label for switch", () => {
      const { getByRole } = renderWithTooltipProvider(
        <CompressionToggle
          enabled={false}
          level="recommended"
          onEnabledChange={vi.fn()}
          onLevelChange={vi.fn()}
        />
      );

      const toggle = getByRole("switch");
      expect(toggle).toHaveAttribute("aria-label", "Enable PDF compression");
    });

    it("should have proper ARIA labels for radio buttons", () => {
      const { container } = renderWithTooltipProvider(
        <CompressionToggle
          enabled={true}
          level="recommended"
          onEnabledChange={vi.fn()}
          onLevelChange={vi.fn()}
        />
      );

      const extremeRadio = container.querySelector('#compression-extreme');
      const recommendedRadio = container.querySelector('#compression-recommended');
      const lightRadio = container.querySelector('#compression-light');

      expect(extremeRadio).toHaveAttribute("role", "radio");
      expect(recommendedRadio).toHaveAttribute("role", "radio");
      expect(lightRadio).toHaveAttribute("role", "radio");
    });

    it("should support keyboard navigation between radio options", async () => {
      const user = userEvent.setup();
      const mockOnLevelChange = vi.fn();
      const { container } = renderWithTooltipProvider(
        <CompressionToggle
          enabled={true}
          level="recommended"
          onEnabledChange={vi.fn()}
          onLevelChange={mockOnLevelChange}
        />
      );

      const extremeRadio = container.querySelector('#compression-extreme') as HTMLElement;

      // Focus and select via keyboard
      extremeRadio.focus();
      await user.keyboard(" ");

      expect(mockOnLevelChange).toHaveBeenCalledWith("extreme");
    });
  });

  describe("Component Props", () => {
    it("should handle all compression levels correctly", () => {
      const levels: Array<"extreme" | "recommended" | "light"> = ["extreme", "recommended", "light"];

      levels.forEach((level) => {
        const { container } = renderWithTooltipProvider(
          <CompressionToggle
            enabled={true}
            level={level}
            onEnabledChange={vi.fn()}
            onLevelChange={vi.fn()}
          />
        );

        const levelMap = {
          extreme: '#compression-extreme',
          recommended: '#compression-recommended',
          light: '#compression-light',
        };

        const radio = container.querySelector(levelMap[level]);
        expect(radio).toHaveAttribute("aria-checked", "true");
      });
    });

    it("should maintain level selection when toggling enabled state", async () => {
      const { container, rerender, queryByText } = renderWithTooltipProvider(
        <CompressionToggle
          enabled={true}
          level="extreme"
          onEnabledChange={vi.fn()}
          onLevelChange={vi.fn()}
        />
      );

      // Verify extreme is selected
      const extremeRadio = container.querySelector('#compression-extreme');
      expect(extremeRadio).toHaveAttribute("aria-checked", "true");

      // Re-render with disabled
      rerender(
        <TooltipProvider>
          <CompressionToggle
            enabled={false}
            level="extreme"
            onEnabledChange={vi.fn()}
            onLevelChange={vi.fn()}
          />
        </TooltipProvider>
      );

      // Options should not be visible
      expect(queryByText(/Extreme Compression/i)).not.toBeInTheDocument();

      // Re-render with enabled again
      rerender(
        <TooltipProvider>
          <CompressionToggle
            enabled={true}
            level="extreme"
            onEnabledChange={vi.fn()}
            onLevelChange={vi.fn()}
          />
        </TooltipProvider>
      );

      // Extreme should still be selected
      const extremeRadioAfter = container.querySelector('#compression-extreme');
      expect(extremeRadioAfter).toHaveAttribute("aria-checked", "true");
    });
  });
});
