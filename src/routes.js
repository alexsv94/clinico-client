import Admin from './pages/Admin';
import DeseasePage from './pages/DeseasePage';
import Deseases from './pages/Deseases';
import Favorites from './pages/Favorites';
import Main from './pages/Main';
import MedicationPage from './pages/MedicationPage';
import Medications from './pages/Medications';
import { ADMIN_ROUTE, DESEASES_ROUTE, FAVORITES_ROUTE, MAIN_ROUTE, MEDICATIONS_ROUTE } from './utils/consts';

export const authRoutes = [
	{
		path: ADMIN_ROUTE,
		Component: Admin
	},
	{
		path: FAVORITES_ROUTE,
		Component: Favorites
	},
]

export const publicRoutes = [
	{
		path: DESEASES_ROUTE,
		Component: Deseases
	},
	{
		path: MEDICATIONS_ROUTE,
		Component: Medications
	},
	{
		path: MAIN_ROUTE,
		Component: Main
	},
	{
		path: MEDICATIONS_ROUTE + '/:id',
		Component: MedicationPage
	},
	{
		path: DESEASES_ROUTE + '/:id',
		Component: DeseasePage
	},
]