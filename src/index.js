import React, { createContext } from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import DeseasesStore from './store/DeseasesStore';
import MedicationsStore from './store/MedicationsStore';
import UserStore from './store/UserStore';

export const Context = createContext(null)

ReactDOM.render(
	<React.StrictMode>
		<Context.Provider value={{
			user: new UserStore(),
			desease: new DeseasesStore(),
			medication: new MedicationsStore(),
		}}>
			<App />
		</Context.Provider>
	</React.StrictMode>,
	document.getElementById('root')
);  