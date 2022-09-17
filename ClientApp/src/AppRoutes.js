import Search from './components/Search';
import About from './components/About';
import CSVImport from './components/CSVImport';
import Address from './components/Address';
import Permit from './components/Permit';

const AppRoutes = [
	{
		index: true,
		element: <Search />,
	},
	{
		path: '/about',
		element: <About />,
	},
	{
		path: '/csv-import',
		element: <CSVImport />,
	},
	{
		path: '/view-address/:geoid',
		element: <Address />,
	},
	{
		path: '/view-permit/:permitNumber/:permitRevision',
		element: <Permit />,
	},
];

export default AppRoutes;
