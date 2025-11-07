import { describe, it, expect, vi } from "vitest";
import { render, act } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { PdfFileList } from "@/components/PdfFileList";

describe("PdfFileList Component", () => {
  const mockFiles = [
    new File(["content1"], "document1.pdf", { type: "application/pdf" }),
    new File(["content2"], "document2.pdf", { type: "application/pdf" }),
    new File(["content3"], "document3.pdf", { type: "application/pdf" }),
  ];

  it("should render list of PDF files", () => {
    const { getByText } = render(
      <PdfFileList files={mockFiles} onFilesChange={vi.fn()} onRemove={vi.fn()} />
    );

    expect(getByText("document1.pdf")).toBeInTheDocument();
    expect(getByText("document2.pdf")).toBeInTheDocument();
    expect(getByText("document3.pdf")).toBeInTheDocument();
  });

  it("should show file count", () => {
    const { getByText } = render(
      <PdfFileList files={mockFiles} onFilesChange={vi.fn()} onRemove={vi.fn()} />
    );

    expect(getByText(/3\s+pdfs?\s+ready\s+to\s+merge/i)).toBeInTheDocument();
  });

  it("should render empty state when no files", () => {
    const { getByText } = render(
      <PdfFileList files={[]} onFilesChange={vi.fn()} onRemove={vi.fn()} />
    );

    expect(getByText(/no.*files/i)).toBeInTheDocument();
  });

  it("should call onRemove when remove button is clicked", async () => {
    const user = userEvent.setup();
    const mockRemove = vi.fn();
    const { getAllByRole } = render(
      <PdfFileList files={mockFiles} onFilesChange={vi.fn()} onRemove={mockRemove} />
    );

    const removeButtons = getAllByRole("button", { name: /remove/i });
    expect(removeButtons).toHaveLength(3);

    await user.click(removeButtons[1]);

    expect(mockRemove).toHaveBeenCalledTimes(1);
    expect(mockRemove).toHaveBeenCalledWith(1); // Called with index
  });

  it("should show file size if available", () => {
    const { getByText } = render(
      <PdfFileList files={[mockFiles[0]]} onFilesChange={vi.fn()} onRemove={vi.fn()} />
    );

    // File size should be displayed (mocked files have some bytes)
    expect(getByText(/bytes?|KB|MB/i)).toBeInTheDocument();
  });

  it("should have draggable items", () => {
    const { container } = render(
      <PdfFileList files={mockFiles} onFilesChange={vi.fn()} onRemove={vi.fn()} />
    );

    const draggableItems = container.querySelectorAll('[draggable="true"]');
    expect(draggableItems.length).toBeGreaterThan(0);
  });

  it("should show visual feedback when dragging", async () => {
    const { container } = render(
      <PdfFileList files={mockFiles} onFilesChange={vi.fn()} onRemove={vi.fn()} />
    );

    const draggableItem = container.querySelector('[draggable="true"]') as HTMLElement;
    expect(draggableItem).toBeInTheDocument();

    // Simulate drag start
    const dragStartEvent = new DragEvent("dragstart", {
      bubbles: true,
      cancelable: true,
      dataTransfer: new DataTransfer(),
    });

    await act(async () => {
      draggableItem.dispatchEvent(dragStartEvent);
    });

    // Should add dragging class or attribute
    expect(draggableItem).toHaveAttribute("data-dragging");
  });

  it("should reorder files on drag and drop", async () => {
    const mockOnFilesChange = vi.fn();
    const { container } = render(
      <PdfFileList files={mockFiles} onFilesChange={mockOnFilesChange} onRemove={vi.fn()} />
    );

    const draggableItems = Array.from(
      container.querySelectorAll('[draggable="true"]')
    ) as HTMLElement[];

    // Create proper dataTransfer object
    const dataTransfer = new DataTransfer();
    Object.defineProperty(dataTransfer, 'effectAllowed', { writable: true, value: 'move' });

    // Drag first item (index 0) and drop on third item (index 2)
    await act(async () => {
      // Start dragging first item
      const dragStartEvent = new DragEvent("dragstart", {
        bubbles: true,
        cancelable: true,
        dataTransfer,
      });
      draggableItems[0].dispatchEvent(dragStartEvent);
    });

    await act(async () => {
      // Drag over third item
      const dragOverEvent = new DragEvent("dragover", {
        bubbles: true,
        cancelable: true,
        dataTransfer,
      });
      draggableItems[2].dispatchEvent(dragOverEvent);
    });

    await act(async () => {
      // Drop on third item
      const dropEvent = new DragEvent("drop", {
        bubbles: true,
        cancelable: true,
        dataTransfer,
      });
      draggableItems[2].dispatchEvent(dropEvent);
    });

    // Should call onFilesChange with reordered array
    expect(mockOnFilesChange).toHaveBeenCalled();
    const reorderedFiles = mockOnFilesChange.mock.calls[0][0];
    expect(reorderedFiles).toHaveLength(3);
    // First file should now be at index 2 (moved from 0 to 2)
    expect(reorderedFiles[2]).toBe(mockFiles[0]);
    // Third file should now be at index 1 (shifted down)
    expect(reorderedFiles[1]).toBe(mockFiles[2]);
  });

  it("should be keyboard accessible", () => {
    const { getAllByRole } = render(
      <PdfFileList files={mockFiles} onFilesChange={vi.fn()} onRemove={vi.fn()} />
    );

    // Remove buttons should be accessible
    const removeButtons = getAllByRole("button", { name: /remove/i });
    removeButtons.forEach((button) => {
      expect(button).toBeInTheDocument();
    });
  });

  it("should show drag handle indicator", () => {
    const { container } = render(
      <PdfFileList files={mockFiles} onFilesChange={vi.fn()} onRemove={vi.fn()} />
    );

    // Should have visual drag handle (icon or text)
    const dragHandles = container.querySelectorAll('[data-testid="drag-handle"]');
    expect(dragHandles.length).toBeGreaterThan(0);
  });
});
