import { useCallback, useState } from "react";
import {
  Button,
  TextInput,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Label,
  Select,
} from "flowbite-react";
import { useDashboardContext } from "../context";
import { getNodes, importFromFile } from "../neo4j";
import { enqueueSnackbar } from "notistack";
import { useReactFlow } from "@xyflow/react";
import { useStore } from "../store";
import { useShallow } from "zustand/react/shallow";

export const ImportFromComponent = () => {
  const [files, setFiles] = useState<File[]>([]);
  const { driver, setShowImportFromFile, showImportFromFile } =
    useDashboardContext();
  const { fitView } = useReactFlow();
  const { setNodes, setEdges } = useStore(
    useShallow((s) => ({
      setNodes: s.setNodes,
      setEdges: s.setEdges,
    })),
  );
  const [source, setSource] = useState<"airodump" | "kismet">("kismet");

  const onClose = useCallback(() => {
    setShowImportFromFile(false);
    setFiles([]);
    setSource("kismet");
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        setFiles(Array.from(e.target.files));
      }
    },
    [],
  );

  const handleImport = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (files.length === 0) return;
      try {
        await Promise.all(
          files.map((file) => importFromFile(driver, file, source)),
        );
        enqueueSnackbar("Import successful", {
          variant: "success",
          autoHideDuration: 3000,
        });
        onClose();
        await getNodes(driver, setNodes, setEdges, fitView);
      } catch (error) {
        enqueueSnackbar("Import failed", {
          variant: "error",
          autoHideDuration: 5000,
        });
      }
    },
    [driver, files, onClose],
  );

  const handleClose = () => {
    setShowImportFromFile(false);
    setFiles([]);
    setSource("kismet");
  };

  return (
    <Modal show={showImportFromFile} onClose={handleClose}>
      <ModalHeader>Import From File</ModalHeader>
      <form onSubmit={handleImport}>
        <ModalBody className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <div className="block">
              <Label htmlFor="source">Import Source</Label>
            </div>
            <Select
              id="source"
              value={source}
              onChange={(e) =>
                setSource(e.target.value as "airodump" | "kismet")
              }
            >
              <option value="kismet">Kismet</option>
              <option value="airodump">Airodump</option>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <div className="block">
              <Label htmlFor="file">Select File</Label>
            </div>
            <TextInput
              id="file"
              type="file"
              onChange={handleFileChange}
              multiple
              accept={
                source === "kismet"
                  ? ".json"
                  : source === "airodump"
                    ? ".netxml"
                    : ""
              }
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="blue" type="submit" disabled={files.length === 0}>
            Import
          </Button>
          <Button color="gray" onClick={handleClose}>
            Cancel
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
};
