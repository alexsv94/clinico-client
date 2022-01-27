import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router'
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import { Context } from '..';
import { observer } from 'mobx-react-lite'
import { NavLink } from 'react-router-dom';
import { ADMIN_ROUTE, DESEASES_ROUTE, FAVORITES_ROUTE, MAIN_ROUTE, MEDICATIONS_ROUTE } from '../utils/consts';
import '../styles/Navbar.css'
import LoginModal from './LoginModal';
import { logout } from '../http/userAPI';
import SUserMenu from './ui/SUserMenu/SUserMenu';
import SUserMenuItem from './ui/SUserMenu/SUserMenuItem';

const NavBar = observer(() => {
	const { user } = useContext(Context)
	const history = useHistory();

	const [loginFormShow, setLoginFormShow] = useState(false);
	const [userMenuShow, setUserMenuShow] = useState(false)

	const loginFormShowHandler = () => setLoginFormShow(true)
	const loginFormHideHandler = () => setLoginFormShow(false)

	const signOut = () => {
		user.setIsAuth(false);
		user.setUser(null);
		logout();
	}

	return (
		<Navbar className="navbar-custom">
			<Container>
				<NavLink to={MAIN_ROUTE} className="navbar-custom__logo">Клинико</NavLink>
				<Nav className="nav-container">
					<div onClick={() => history.push(DESEASES_ROUTE)} className="navbar-custom__link">Заболевания</div>
					<div onClick={() => history.push(MEDICATIONS_ROUTE)} className="navbar-custom__link">Лекарственные препараты</div>
				</Nav>
				{user.isAuth
					? <SUserMenu
						title={`${user.user.firstname} ${user.user.lastname}`}
						show={userMenuShow}
						showToggle={setUserMenuShow}
					>
						<SUserMenuItem onClick={() => history.push(FAVORITES_ROUTE)} showToggle={setUserMenuShow}>Избранное</SUserMenuItem>
						{user.user.role === 'ADMIN'
							? <SUserMenuItem onClick={() => history.push(ADMIN_ROUTE)} showToggle={setUserMenuShow}>Панель управления</SUserMenuItem>
							: null
						}
						<hr />
						<SUserMenuItem onClick={signOut}>Выйти</SUserMenuItem>
					</SUserMenu>
					: <Button onClick={loginFormShowHandler} variant="outline-success" className="navbar-custom__login-button">Войти</Button>}
			</Container>
			<LoginModal showState={loginFormShow} closeHandler={loginFormHideHandler} />
		</Navbar>
	);
});

export default NavBar;