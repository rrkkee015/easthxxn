import { describe, it, expect } from "vitest";
import { extractToc, extractFirstImage } from "../mdx-utils";

describe("extractToc", () => {
  it("extracts h2 and h3 headings with string children", () => {
    const body = '.h2,{id:"intro",children:"Introduction"}.h3,{id:"sub",children:"Sub Section"}';
    const toc = extractToc(body);
    expect(toc).toEqual([
      { id: "intro", text: "Introduction", level: 2 },
      { id: "sub", text: "Sub Section", level: 3 },
    ]);
  });

  it("extracts headings with array children", () => {
    const body = '.h2,{id:"setup",children:["Getting Started"}';
    const toc = extractToc(body);
    expect(toc).toEqual([{ id: "setup", text: "Getting Started", level: 2 }]);
  });

  it("preserves order of multiple headings", () => {
    const body =
      '.h2,{id:"a",children:"First"}.h3,{id:"b",children:"Second"}.h2,{id:"c",children:"Third"}';
    const toc = extractToc(body);
    expect(toc.map((h) => h.id)).toEqual(["a", "b", "c"]);
  });

  it("returns empty array for empty body", () => {
    expect(extractToc("")).toEqual([]);
  });

  it("ignores h1 and h4", () => {
    const body = '.h1,{id:"title",children:"Title"}.h4,{id:"deep",children:"Deep"}';
    expect(extractToc(body)).toEqual([]);
  });
});

describe("extractFirstImage", () => {
  it("extracts the first image src", () => {
    const body = 'img,{src:"/images/hello.png",alt:"hi"}';
    expect(extractFirstImage(body)).toBe("/images/hello.png");
  });

  it("returns null when no image exists", () => {
    expect(extractFirstImage("just some text")).toBeNull();
  });

  it("returns only the first image when multiple exist", () => {
    const body = 'img,{src:"/images/first.png"}other stuff img,{src:"/images/second.png"}';
    expect(extractFirstImage(body)).toBe("/images/first.png");
  });
});
