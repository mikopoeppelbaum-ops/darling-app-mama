import { describe, expect, it } from "vitest";
import { validateImageFile, MAX_IMAGE_BYTES } from "@/lib/files";

function makeFile(type: string, size: number): File {
  return new File([new Uint8Array(size)], "test", { type });
}

describe("validateImageFile", () => {
  it("akzeptiert erlaubte Bildformate innerhalb der Größe", () => {
    expect(validateImageFile(makeFile("image/jpeg", 1024))).toBeNull();
    expect(validateImageFile(makeFile("image/png", 1024))).toBeNull();
    expect(validateImageFile(makeFile("image/webp", 1024))).toBeNull();
  });

  it("lehnt nicht erlaubte Dateitypen ab", () => {
    expect(validateImageFile(makeFile("application/pdf", 1024))).not.toBeNull();
    expect(validateImageFile(makeFile("image/svg+xml", 1024))).not.toBeNull();
  });

  it("lehnt zu große Dateien ab und akzeptiert genau die Grenze", () => {
    expect(validateImageFile(makeFile("image/jpeg", MAX_IMAGE_BYTES + 1))).not.toBeNull();
    expect(validateImageFile(makeFile("image/jpeg", MAX_IMAGE_BYTES))).toBeNull();
  });
});
