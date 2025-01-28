import { Tooltip } from 'flowbite-react';

export const FloatingButtonComponent: React.FC<{ onClick: React.MouseEventHandler<HTMLButtonElement>, tooltip: string, children?: React.ReactNode }> = ({ onClick, tooltip, children }) => {
	return (
		<Tooltip content= { tooltip } placement = 'left' >
			<button className='flex p-2 cursor-pointer bg-white border-1 border-gray-500 rounded-full size-10 hover:bg-zinc-300 dark:border-zinc-700 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-900' onClick = { onClick } >
				{ children }
				</button>
				</Tooltip>
	)
}
