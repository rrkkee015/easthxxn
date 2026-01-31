import * as runtime from "react/jsx-runtime";
import React from "react";
import { MdxImage } from "./mdx-image";

function MdxParagraph({ children, ...props }: React.ComponentProps<"p">) {
  const childArray = React.Children.toArray(children);
  // MDX wraps standalone images in <p>. Block element inside <p> is invalid HTML —
  // browsers create empty <p> tags with prose margins, causing CLS.
  if (
    childArray.length === 1 &&
    React.isValidElement(childArray[0]) &&
    typeof childArray[0].type !== "string" &&
    "src" in (childArray[0].props as Record<string, unknown>)
  ) {
    return <>{children}</>;
  }
  return <p {...props}>{children}</p>;
}

const sharedComponents = {
  img: MdxImage,
  p: MdxParagraph,
};

const useMDXComponent = (code: string) => {
  const fn = new Function(code);
  return fn({ ...runtime }).default;
};

interface MDXContentProps {
  code: string;
}

export function MDXContent({ code }: MDXContentProps) {
  const Component = useMDXComponent(code);
  return <Component components={sharedComponents} />;
}
