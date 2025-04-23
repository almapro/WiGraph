import { Panel, useReactFlow } from "@xyflow/react";
import { Checkbox, TextInput, Tooltip } from "flowbite-react";
import { FaFilter } from "react-icons/fa";
import { useState } from "react";
import { useStore } from "../store";
import { useShallow } from "zustand/react/shallow";

export const FiltersPanel = () => {
  const [showFilters, setShowFilters] = useState(false);
  const { fitView } = useReactFlow();
  const {
    filterNodes,
    setSearch,
    search,
    showClients,
    showWifi,
    showConnectedNodesOnly,
    setShowClients,
    setShowWifi,
    setShowConnectedNodesOnly,
  } = useStore(
    useShallow((s) => ({
      filterNodes: s.filterNodes,
      setSearch: s.setSearch,
      search: s.search,
      showClients: s.showClients,
      showWifi: s.showWifi,
      showConnectedNodesOnly: s.showConnectedNodesOnly,
      setShowClients: s.setShowClients,
      setShowWifi: s.setShowWifi,
      setShowConnectedNodesOnly: s.setShowConnectedNodesOnly,
    })),
  );
  return (
    <Panel position="top-left" className="relative flex gap-2">
      <div className="flex flex-col gap-2">
        <div className="flex items-center">
          <TextInput
            placeholder="Search nodes..."
            className="w-full"
            onChange={(e) => {
              setSearch(e.target.value);
              filterNodes();
              fitView();
            }}
            value={search}
          />
        </div>
        <div
          data-show={`${showFilters}`}
          className="flex flex-col gap-2 rounded-lg border-2 border-gray-500 bg-white p-2 data-[show=false]:pointer-events-none data-[show=false]:opacity-0 data-[show=true]:pointer-events-auto data-[show=true]:opacity-100 dark:border-zinc-700 dark:bg-neutral-800 dark:text-white"
        >
          <div
            className="my-auto flex cursor-pointer items-center gap-2"
            onClick={() => {
              setShowClients(!showClients);
              filterNodes();
              fitView();
            }}
          >
            <Checkbox readOnly checked={showClients} />
            <p>Show Client Nodes</p>
          </div>
          <div
            className="my-auto flex cursor-pointer items-center gap-2"
            onClick={() => {
              setShowWifi(!showWifi);
              filterNodes();
              fitView();
            }}
          >
            <Checkbox readOnly checked={showWifi} />
            <p>Show Wifi nodes</p>
          </div>
          <div
            className="my-auto flex cursor-pointer items-center gap-2"
            onClick={() => {
              setShowConnectedNodesOnly(!showConnectedNodesOnly);
              filterNodes();
              fitView();
            }}
          >
            <Checkbox readOnly checked={showConnectedNodesOnly} />
            <p>Show Connected Nodes only</p>
          </div>
        </div>
      </div>
      <Tooltip
        content="Toggle Filters"
        placement="right"
        className="text-nowrap"
        theme={{
          target: "w-fit h-fit mt-0.5",
        }}
      >
        <div
          className="m-auto flex size-fit cursor-pointer rounded-full border-2 border-gray-500 bg-white p-2 hover:bg-zinc-300 dark:border-zinc-700 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-900"
          onClick={() => setShowFilters(!showFilters)}
        >
          <FaFilter className="m-auto" />
        </div>
      </Tooltip>
    </Panel>
  );
};
