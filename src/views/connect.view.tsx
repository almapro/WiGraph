import { auth, Driver, driver as neo4jDriver, Neo4jError } from 'neo4j-driver';
import { Navigate } from 'react-router';
import { FloatingButtonComponent } from '../components';
import { FaMoon, FaSun } from 'react-icons/fa';
import { ColorMode } from '@xyflow/react';
import { useCallback, useEffect, useState } from 'react';
import { useLocalStorage, useTitle } from 'react-use';
import { Label, TextInput, Button } from 'flowbite-react';
import { useSnackbar } from 'notistack';

export const ConnectView: React.FC<{ driver: Driver | null, setDriver: React.Dispatch<React.SetStateAction<Driver | null>>, setColorMode: React.Dispatch<React.SetStateAction<ColorMode>>, colorMode: ColorMode }> = ({ driver, setDriver, setColorMode, colorMode }) => {
	useTitle('WiGraph - Connect');
	const { enqueueSnackbar } = useSnackbar();
	const [localUrl, setLocalUrl] = useLocalStorage<string>('neo4j_url')
	const [localUsername, setLocalUsername] = useLocalStorage<string>('neo4j_username')
	const [localPassword, setLocalPassword] = useLocalStorage<string>('neo4j_password')
	const [localDatabase, setLocalDatabase] = useLocalStorage<string>('neo4j_database')
	const [url, setUrl] = useState(localUrl || 'neo4j://localhost:7687');
	const [username, setUsername] = useState(localUsername || 'neo4j');
	const [password, setPassword] = useState(localPassword || '');
	const [database, setDatabase] = useState(localDatabase || 'neo4j');
	useEffect(() => {
		setLocalUrl(url);
		setLocalUsername(username);
		setLocalPassword(password);
		setLocalDatabase(database);
	}, [url, username, password, database, setLocalUrl, setLocalUsername, setLocalPassword, setLocalDatabase]);
	const [showPassword, setShowPassword] = useState(false);
	const [autoConnect, setAutoConnect] = useState(true);
	const [loading, setLoading] = useState(false);
	const handleOnSubmit: React.FormEventHandler = async e => {
		e.preventDefault();
		setLoading(true);
		try {
			const drv = neo4jDriver(url, auth.basic(username, password));
			await drv.getServerInfo({ database });
			setDatabase(database);
			setUsername(username);
			setPassword(password);
			setUrl(url);
			setDriver(drv);
			setLoading(false);
		} catch (err: any) {
			const typedError: Neo4jError = err || new Neo4jError('Invalid credentials', '403', '', '');
			console.log({ err })
			enqueueSnackbar(typedError.message, { variant: "error" });
			setLoading(false);
		}
	}
	const handleOnSubmitCallback = useCallback(handleOnSubmit, [setLoading, setDriver, database, setDatabase, url, username, password, setPassword, setUrl, setUsername, enqueueSnackbar]);
	useEffect(() => {
		if (autoConnect) {
			setAutoConnect(false);
			const e: any = { preventDefault: () => { } };
			handleOnSubmitCallback(e);
		}
	}, [handleOnSubmitCallback, autoConnect, setAutoConnect]);
	return driver === null ? (
		<div className= 'relative flex size-full bg-white dark:bg-zinc-900 dark:text-white' >
		<div className="absolute top-0 right-0 p-4" >
			<FloatingButtonComponent tooltip='Toggle color mode' onClick = {() => setColorMode(colorMode === 'dark' ? 'light' : 'dark') } >
				{ colorMode === "dark" ? (
					<FaSun className= "m-auto" />
		) : (
	<FaMoon className= "m-auto" />
			)}
</FloatingButtonComponent >
	</div>
	< form onSubmit = { handleOnSubmit } className = "m-auto flex flex-col p-10 gap-4 size-[50%] rounded-lg shadow-[0_4px_16px_4px_rgba(255,255,255,0.08)] bg-gray-100 dark:bg-zinc-800 dark:shadow-[0_4px_16px_4px_rgba(0,0,0,0.08)]" >
		<div>
		<div className="mb-2 block" >
			<Label htmlFor="url" value = "URL" />
				</div>
				< TextInput required id = "url" value = { url } onChange = { e => setUrl(e.target.value) } />
					</div>
					< div >
					<div className="mb-2 block" >
						<Label htmlFor="username" value = "Username" />
							</div>
							< TextInput required id = "username" value = { username } onChange = { e => setUsername(e.target.value) } />
								</div>
								< div >
								<div className="mb-2 block" >
									<Label htmlFor="password" value = "Password" />
										</div>
										< TextInput required id = "password" value = { password } onChange = { e => setPassword(e.target.value) } />
											</div>
											< div >
											<div className="mb-2 block" >
												<Label htmlFor="database" value = "Database" />
													</div>
													< TextInput required id = "database" value = { database } onChange = { e => setDatabase(e.target.value) } />
														</div>
														< Button type = "submit" disabled = { loading } > Connect </Button>
															</form>
															</div>
	) : (<Navigate to= '/' />)
}
