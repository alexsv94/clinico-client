import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';
import './SAccordion.css'

const SAccordion = observer(({ children, title }) => {
	const [expand, setExpand] = useState(false)

	return (
		<div className={`saccordion ${expand ? 'saccordion-active-border' : ''}`}>
			<div className={`saccordion__header ${expand ? 'saccordion__header-active' : ''}`} onClick={() => setExpand(!expand)}>
				{title}
				<div className="saccordion__expand-arrow" />
			</div>
			<div className={`saccordion__body ${expand ? 'saccordion-show' : ''}`}>{children}</div>
		</div>
	);
});

export default SAccordion;