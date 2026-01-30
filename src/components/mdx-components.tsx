import * as runtime from "react/jsx-runtime";

const sharedComponents = {
  // Add custom MDX components here if needed
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
