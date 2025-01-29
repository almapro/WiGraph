import { ThemeProps } from "flowbite-react";

export const theme: ThemeProps = {
    theme: {
        button: {
            color: {
                info: "border border-transparent bg-purple-700 text-white focus:ring-4 focus:ring-purple-300 enabled:hover:bg-purple-800 dark:bg-purple-600 dark:focus:ring-purple-900 dark:enabled:hover:bg-purple-700",
            },
        },
        modal: {
            root: {
                show: {
                    on: "flex bg-zinc-900 bg-opacity-50 dark:bg-opacity-80",
                },
            },
            content: {
                inner:
                    "relative flex max-h-[90dvh] flex-col rounded-lg bg-white shadow dark:bg-zinc-700",
            },
            header: {
                base: "flex items-start justify-between rounded-t border-b p-5 dark:border-zinc-600",
            },
            footer: {
                base: "flex items-center space-x-2 rounded-b border-gray-200 p-6 dark:border-zinc-600",
            },
        },
        tooltip: {
            arrow: {
                style: {
                    dark: "bg-gray-900 dark:bg-zinc-700",
                    light: "bg-white",
                    auto: "bg-white dark:bg-zinc-700",
                },
            },
            style: {
                dark: "bg-gray-900 text-white dark:bg-zinc-700",
                auto: "border border-gray-200 bg-white text-gray-900 dark:border-none dark:bg-zinc-700 dark:text-white",
            },
        },
        textInput: {
            field: {
                input: {
                    colors: {
                        gray: "border-gray-300 bg-gray-50 text-gray-900 focus:border-cyan-500 focus:ring-cyan-500 dark:border-gray-600 dark:bg-zinc-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500",
                    },
                },
            },
        },
    },
};
