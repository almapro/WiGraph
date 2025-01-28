import { useEffect, useState } from 'react';
import { ColorMode } from '@xyflow/react';
import { useLocalStorage } from 'react-use';

import '@xyflow/react/dist/style.css';

import { RestrictedRoute } from './components';
import { Flowbite, useThemeMode } from 'flowbite-react';
import { Route, Routes } from 'react-router';
import { ConnectView } from './views';
import { Driver } from 'neo4j-driver';
import { SnackbarProvider } from 'notistack';

export default function App() {
    const [storedColorMode, setStoredColorMode] = useLocalStorage('colorMode', 'system');
    const { setMode } = useThemeMode();
    useEffect(() => {
        setMode(storedColorMode === 'dark' ? 'light' : 'dark');
    }, [setMode, storedColorMode]);
    const [colorMode, setColorMode] = useState<ColorMode>(storedColorMode as ColorMode);
    useEffect(() => {
        setStoredColorMode(colorMode);
        setMode(colorMode === 'dark' ? 'dark' : 'light');
    }, [colorMode, setStoredColorMode, setMode]);
    const [driver, setDriver] = useState<Driver | null>(null);
    return (
        <Flowbite theme={{
            theme: {
                textInput: {
                    field: {
                        input: {
                            colors: {
                                gray: 'border-gray-300 bg-gray-50 text-gray-900 focus:border-cyan-500 focus:ring-cyan-500 dark:border-gray-600 dark:bg-zinc-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500'
                            }
                        }
                    }
                }
            }
        }}>
            <SnackbarProvider maxSnack={3} anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
                <Routes>
                    <Route path='/' element={<RestrictedRoute driver={driver} colorMode={colorMode} setColorMode={setColorMode} />} />
                    <Route path='/connect' element={<ConnectView driver={driver} setDriver={setDriver} setColorMode={setColorMode} colorMode={colorMode} />} />
                </Routes>
            </SnackbarProvider>
        </Flowbite>
    );
}
