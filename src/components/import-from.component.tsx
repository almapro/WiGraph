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
  const [file, setFile] = useState<File | null>(null);
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
    setFile(null);
    setSource("kismet");
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        setFile(e.target.files[0]);
      }
    },
    [],
  );

  const handleImport = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!file) return;
      try {
        await importFromFile(driver, file, source);
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
    [driver, file, onClose],
  );

  const handleClose = () => {
    setShowImportFromFile(false);
    setFile(null);
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
              accept=".json"
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="blue" type="submit" disabled={!file}>
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
