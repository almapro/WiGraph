import { Handle, Position, type NodeProps } from '@xyflow/react';

import { type WifiNode } from './types';
import { FaWifi } from 'react-icons/fa';

export function WifiNode({
    data
}: NodeProps<WifiNode>) {
    return (
    <div className="rounded-full bg-white border-1 border-black flex size-8 group dark:text-white dark:bg-neutral-800 dark:border-zinc-700" >
      <div className='m-auto'><FaWifi /></div>
        <Handle type="target" position={Position.Right} />
        <div className="hidden group-hover:block absolute p-2 bg-white shadow-xs shadow-black rounded border-1 border-black text-xs dark:text-white dark:bg-neutral-800 dark:border-zinc-700">{data.label}</div>
          </div>
  );
}
