import { EdgeProps } from '@xyflow/react';
import { memo, useContext } from 'react';
import { DashboardContext } from '../context';
import { FaTrash } from 'react-icons/fa';
import { ButtonEdge } from './button.edge';
import { Tooltip } from 'flowbite-react';

export const CustomEdge = memo((props: EdgeProps) => {
  const { setRelationToDelete, setShowDeleteRelation, selectedEdge } = useContext(DashboardContext);
  return (
    <ButtonEdge {...props}>
      <div data-edgeSelected={selectedEdge !== null ? 'true' : 'false'} data-selected={selectedEdge && selectedEdge?.id === props.id ? 'true' : 'false'} className="data-[selected=true]:opacity-100 opacity-0 data-[edgeSelected=false]:hover:opacity-100 duration-200 flex flex-col w-full h-full items-center justify-center p-1 gap-1">
        <div className={`text-gray-600 dark:text-gray-400 text-[8px] rounded-md bg-white border-1 border-black dark:bg-neutral-800 dark:hover:border-zinc-700 p-1`}>
          {typeof props.data?.label === 'string' ? props.data.label : 'CONNECTED_TO'}
        </div>
        {props.selected && (
          <Tooltip content="Delete Relation" placement='left' className='text-[8px] flex'>
            <div className='flex items-center justify-center group p-1'>
              <FaTrash onClick={() => {
                setRelationToDelete({ id: props.id, source: props.source, target: props.target });
                setShowDeleteRelation(true);
              }} className="h-2 w-2 group-hover:fill-red-500 dark:fill-gray-400 dark:group-hover:fill-red-500" />
            </div>
          </Tooltip>
        )}
      </div>
    </ButtonEdge>
  );
});
