import { EdgeProps } from '@xyflow/react';
import { memo } from 'react';
import { ButtonEdge } from './button.edge';

export const CustomEdge = memo((props: EdgeProps) => {
  return (
    <ButtonEdge {...props}>
      <div className="hover:opacity-100 opacity-0 duration-200 flex flex-col w-full h-full items-center justify-center p-1 gap-1">
        <div className={`text-gray-600 dark:text-gray-400 text-[8px] rounded-md bg-white border-1 border-black dark:bg-neutral-800 dark:border-zinc-700 p-1`}>
          {typeof props.data?.label === 'string' ? props.data.label : 'CONNECTED_TO'}
        </div>
      </div>
    </ButtonEdge>
  );
});
