import React from 'react';
import './SUserMenu.css'

const SUserMenuItem = ({ children, onClick, showToggle }) => {

	function clickHandler() {
		onClick();
		if (showToggle) showToggle(false);
	}

	return (
		<div onClick={clickHandler} className="menu-item">
			{children}
		</div>
	);
};

export default SUserMenuItem;