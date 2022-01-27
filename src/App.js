import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Context } from '.';
import AppRouter from './components/AppRouter';
import NavBar from './components/NavBar';
import { check } from './http/userAPI';
import '../src/styles/Main.css'
import SNotificationContainer from './components/ui/SNotification/SNotificationContainer';

const App = observer(() => {
	const { user } = useContext(Context)

	useEffect(() => {
		check().then(data => {
			user.setUser(data)
			user.setIsAuth(true)
		})
	}, [user])

	return (
		<BrowserRouter>
			<div className="substrate"></div>
			<NavBar />
			<AppRouter />
			<SNotificationContainer />
		</BrowserRouter>
	);
})

export default App;
