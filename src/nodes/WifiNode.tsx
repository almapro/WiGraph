import { Handle, Position, type NodeProps } from '@xyflow/react';

import { type WifiNode } from './types';
import { FaWifi } from 'react-icons/fa';

export function WifiNode({
    data
}: NodeProps<WifiNode>) {
    return (
        <div className= "rounded-full bg-white border-1 border-black flex size-8 hover:shadow-[0_1px_4px_1px_rgba(0,0,0,0.08)] dark:text-white dark:bg-neutral-800 dark:border-zinc-700 dark:hover:shadow-[0_1px_4px_1px_rgba(255,255,255,0.08)]" >
        <div className='m-auto' > <FaWifi /></div >
            <Handle type="target" position = { Position.Right } />
                </div>
  );
}
