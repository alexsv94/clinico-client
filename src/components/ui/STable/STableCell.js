import { observer } from 'mobx-react-lite';
import React from 'react';
import './STable.css'

const STableCell = observer(({
	children,
	width,
	variant,
	textAlign,
	flex,
	itemsCenter,
	noselect,
	interactive,
	onClick
}) => {
	let styles = {
		width,
		textAlign,
		display: flex ? "flex" : "block",
		justifyContent: itemsCenter ? "center" : undefined,
		alignItems: textAlign,
		userSelect: noselect ? "none" : undefined,
		cursor: interactive ? "pointer" : "auto",
	};

	switch (variant) {
		case 'white-text':
			styles.color = "white";
			break;
		default:
			styles.color = "black";
			break;
	}

	return (
		<div
			className="s-table__cell"
			style={styles}
			onClick={onClick}
		>
			{children}
		</div>
	);
});

export default STableCell;