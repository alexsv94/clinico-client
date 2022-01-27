import { observer } from 'mobx-react-lite';
import React from 'react';
import './STable.css'

const STableHeader = observer(({ children }) => {
	return (
		<div className="s-table__header">
			{children}
		</div>
	);
});

export default STableHeader;