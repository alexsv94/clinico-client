import { observer } from 'mobx-react-lite';
import React from 'react';
import './STable.css'

const STableRow = observer(({ children }) => {
	return (
		<div className="s-table__row">
			{children}
		</div>
	);
});

export default STableRow;