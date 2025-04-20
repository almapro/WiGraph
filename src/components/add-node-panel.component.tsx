import { Panel } from '@xyflow/react';
import { Tooltip } from 'flowbite-react';
import { FaLaptop, FaWifi } from "react-icons/fa";
import { useDashboardContext } from '../context';

export const AddNodePanel = () => {
  const { setShowAddType } = useDashboardContext();
  return (
    <Panel
      position="top-left"
      className="flex flex-col gap-2 rounded-lg border-2 border-gray-500 bg-white p-2 dark:border-zinc-700 dark:bg-neutral-900 dark:text-white"
    >
        <Tooltip
          content="Drag to add WiFi Node"
          placement='right'
          className='text-nowrap'
        >
            <div
            className='flex size-14 cursor-grab rounded-lg border-2 border-gray-500 bg-white p-2 hover:bg-zinc-300 dark:border-zinc-700 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-900'
            draggable={true}
            onDragStart={(e) => {
              setShowAddType('WIFI');
              e.dataTransfer.effectAllowed = 'move';
            }}
            >
            <FaWifi className="m-auto" />
            </div>
        </Tooltip>
        <Tooltip
          content="Drag to add Client Node"
          placement='right'
          className='text-nowrap'
        >
          <div
            className='flex size-14 cursor-grab rounded-lg border-2 border-gray-500 bg-white p-2 hover:bg-zinc-300 dark:border-zinc-700 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-900'
            draggable={true}
            onDragStart={(e) => {
              setShowAddType('CLIENT');
              e.dataTransfer.effectAllowed = 'move';
            }}
          >
            <FaLaptop className="m-auto" />
          </div>
        </Tooltip>
    </Panel>
  );
};
