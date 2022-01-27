import { observer } from 'mobx-react-lite';
import React from 'react';
import './STable.css'

const STable = observer(({ children }) => {
	return (
		<div className="s-table">			
			<div className="s-table__body">
				{children}
			</div>
		</div>
	);
});

export default STable;