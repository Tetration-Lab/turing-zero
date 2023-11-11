import { useBreakpointValue } from "@chakra-ui/react";
import { Editor as Monaco } from "@monaco-editor/react";
export const Editor = ({
  code,
  setCodeDebounced,
}: {
  code: string;
  setCodeDebounced: (value: string) => void;
}) => {
  const fontSize = useBreakpointValue({ base: "12px", sm: "14px" });
  return (
    <Monaco
      className="editor"
      value={code}
      language="json"
      data-color-mode="light"
      onChange={(value: any) => setCodeDebounced(value ?? "")}
      options={{
        fontSize,
        fontFamily: "Fira Code",
      }}
    />
  );
};
