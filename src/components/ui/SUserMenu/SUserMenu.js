import { observer } from 'mobx-react-lite';
import React from 'react';
import './SUserMenu.css'

const SUserMenu = observer(({ title, children, show, showToggle }) => {

	return (
		<div className="nav-user-menu">
			<div
				onClick={() => showToggle(!show)}
				className="nav-user-menu__toggle"><span className="menu-title"
				>
					{title}
				</span>{show ? <span>▲</span> : <span>▼</span>}</div>
			<div className={`items-container ${show ? 'menu-show' : ''}`}>
				{children}
			</div>
		</div>
	);
});

export default SUserMenu;