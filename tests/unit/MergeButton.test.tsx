import { describe, it, expect, vi } from "vitest";
import { render, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { MergeButton } from "@/components/MergeButton";

describe("MergeButton Component - Core Functionality", () => {
  it("should render merge button", () => {
    const { getByRole } = render(<MergeButton fileCount={2} onMerge={vi.fn()} />);

    const button = getByRole("button", { name: /merge/i });
    expect(button).toBeInTheDocument();
  });

  it("should be disabled when no files are selected", () => {
    const { getByRole } = render(<MergeButton fileCount={0} onMerge={vi.fn()} />);

    const button = getByRole("button", { name: /merge/i });
    expect(button).toBeDisabled();
  });

  it("should be enabled when files are selected", () => {
    const { getByRole } = render(<MergeButton fileCount={3} onMerge={vi.fn()} />);

    const button = getByRole("button", { name: /merge/i });
    expect(button).not.toBeDisabled();
  });

  it("should call onMerge when clicked", async () => {
    const user = userEvent.setup();
    const mockOnMerge = vi.fn();
    const { getByRole } = render(<MergeButton fileCount={2} onMerge={mockOnMerge} />);

    const button = getByRole("button", { name: /merge/i });
    await user.click(button);

    expect(mockOnMerge).toHaveBeenCalledTimes(1);
  });

  it("should show loading state when merging", () => {
    const { getByRole, getByText } = render(
      <MergeButton fileCount={2} onMerge={vi.fn()} isLoading={true} progress={45} />
    );

    // Button should show "Merging PDFs..." text
    expect(getByText(/merging pdfs/i)).toBeInTheDocument();

    // Should show progress percentage
    expect(getByText(/45%/i)).toBeInTheDocument();
  });

  it("should be disabled while merging", () => {
    const { getByRole } = render(
      <MergeButton fileCount={2} onMerge={vi.fn()} isLoading={true} />
    );

    const button = getByRole("button");
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent(/merging/i);
  });

  it("should show file count in button text", () => {
    const { getByRole } = render(<MergeButton fileCount={5} onMerge={vi.fn()} />);

    const button = getByRole("button", { name: /5.*pdf/i });
    expect(button).toBeInTheDocument();
  });
});
