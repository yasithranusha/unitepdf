import { describe, it, expect, vi } from "vitest";
import { render, act, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { PdfUploader } from "@/components/PdfUploader";

describe("PdfUploader Component", () => {
  it("should render the upload area", () => {
    const { getByText } = render(<PdfUploader onFilesSelected={vi.fn()} />);

    expect(getByText(/upload/i)).toBeInTheDocument();
    expect(getByText(/drag.*drop/i)).toBeInTheDocument();
  });

  it("should have a file input that accepts PDF files", () => {
    const { container } = render(<PdfUploader onFilesSelected={vi.fn()} />);

    const input = container.querySelector('input[type="file"]');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("accept", ".pdf,application/pdf");
    expect(input).toHaveAttribute("multiple");
  });

  it("should call onFilesSelected when files are selected", async () => {
    const user = userEvent.setup();
    const mockCallback = vi.fn();
    const { container } = render(<PdfUploader onFilesSelected={mockCallback} />);

    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(["dummy content"], "test.pdf", { type: "application/pdf" });

    await user.upload(input, file);

    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith([file]);
  });

  it("should handle multiple PDF files", async () => {
    const user = userEvent.setup();
    const mockCallback = vi.fn();
    const { container } = render(<PdfUploader onFilesSelected={mockCallback} />);

    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    const file1 = new File(["content1"], "test1.pdf", { type: "application/pdf" });
    const file2 = new File(["content2"], "test2.pdf", { type: "application/pdf" });

    await user.upload(input, [file1, file2]);

    expect(mockCallback).toHaveBeenCalledWith([file1, file2]);
  });

  it("should filter out non-PDF files", async () => {
    const user = userEvent.setup();
    const mockCallback = vi.fn();
    const { container } = render(<PdfUploader onFilesSelected={mockCallback} />);

    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    const pdfFile = new File(["pdf content"], "test.pdf", { type: "application/pdf" });
    const txtFile = new File(["text content"], "test.txt", { type: "text/plain" });

    await user.upload(input, [pdfFile, txtFile]);

    // Should only pass PDF files to callback
    expect(mockCallback).toHaveBeenCalledWith([pdfFile]);
  });

  it("should show visual feedback when dragging over", async () => {
    const { container } = render(<PdfUploader onFilesSelected={vi.fn()} />);

    const dropzone = container.querySelector('[data-testid="dropzone"]') as HTMLElement;
    expect(dropzone).toBeInTheDocument();

    // Simulate drag over
    const dragEvent = new DragEvent("dragover", { bubbles: true, cancelable: true });
    await act(async () => {
      dropzone.dispatchEvent(dragEvent);
    });

    // Wait for state update and check visual feedback
    await waitFor(() => {
      expect(dropzone).toHaveAttribute("data-drag-active", "true");
    });
  });

  it("should handle drop events", async () => {
    const mockCallback = vi.fn();
    const { container } = render(<PdfUploader onFilesSelected={mockCallback} />);

    const dropzone = container.querySelector('[data-testid="dropzone"]') as HTMLElement;
    const file = new File(["content"], "dropped.pdf", { type: "application/pdf" });

    const dropEvent = new DragEvent("drop", {
      bubbles: true,
      dataTransfer: new DataTransfer(),
    });
    Object.defineProperty(dropEvent, "dataTransfer", {
      value: { files: [file] },
    });

    dropzone.dispatchEvent(dropEvent);

    expect(mockCallback).toHaveBeenCalledWith([file]);
  });

  it("should be accessible with keyboard navigation", () => {
    const { container } = render(<PdfUploader onFilesSelected={vi.fn()} />);

    const input = container.querySelector('input[type="file"]');
    expect(input).toBeInTheDocument();

    // File input should be keyboard accessible (native behavior)
    // Check for proper labeling
    const label = container.querySelector('label');
    expect(label).toBeInTheDocument();
  });
});
