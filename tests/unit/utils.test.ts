import { describe, it, expect } from "vitest";
import { cn } from "@/lib/utils";

describe("Utils - cn function", () => {
  it("should merge class names correctly", () => {
    const result = cn("class1", "class2");
    expect(result).toBe("class1 class2");
  });

  it("should handle conditional classes", () => {
    const isActive = true;
    const isHidden = false;
    const result = cn("base", isActive && "conditional", isHidden && "hidden");
    expect(result).toContain("base");
    expect(result).toContain("conditional");
    expect(result).not.toContain("hidden");
  });

  it("should handle tailwind merge conflicts", () => {
    const result = cn("px-2 py-1", "px-4");
    // tailwind-merge should keep only px-4
    expect(result).toContain("px-4");
    expect(result).not.toContain("px-2");
  });
});
