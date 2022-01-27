import React, { useContext, useState } from 'react';
import Button from 'react-bootstrap/esm/Button';
import Modal from 'react-bootstrap/Modal'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import '../styles/LoginForm.css'
import { Context } from '..';
import { login, registration } from '../http/userAPI';
import { observer } from 'mobx-react-lite';
import { appendNotification } from './ui/SNotification/SNotificationContainer';


const LoginModal = observer(({ showState, closeHandler }) => {
	const { user } = useContext(Context)

	const [loginMode, setLoginMode] = useState(true)

	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [firstname, setFirstname] = useState('')
	const [lastname, setLastname] = useState('')

	const loginFormHandler = () => setLoginMode(true)
	const registrationFormHandler = () => setLoginMode(false)

	const signIn = async () => {
		try {
			let decodedUser;

			if (loginMode) {
				decodedUser = await login(email, password)
			} else {
				decodedUser = await registration(email, password, firstname, lastname)
			}

			user.setUser(decodedUser);
			user.setIsAuth(true);
			closeHandler();

			console.log(decodedUser)
		} catch (e) {
			appendNotification(e.response.message, 'warning');
		}
	}

	return (
		<Modal show={showState} onHide={closeHandler} animation>
			<Modal.Header>
				<Modal.Title>
					{loginMode ? 'Авторизация' : 'Регистрация'}
				</Modal.Title>
				<button className="close-button" onClick={closeHandler}></button>
			</Modal.Header>
			<Modal.Body>
				<InputGroup size="sm" className="mb-3">
					<InputGroup.Text id="inputGroup-sizing-sm">E-Mail</InputGroup.Text>
					<FormControl aria-label="login" aria-describedby="inputGroup-sizing-sm"
						value={email} onChange={e => setEmail(e.target.value)} />
				</InputGroup>
				<InputGroup size="sm" className="mb-3">
					<InputGroup.Text id="inputGroup-sizing-sm">Пароль</InputGroup.Text>
					<FormControl aria-label="password" aria-describedby="inputGroup-sizing-sm" type="password"
						value={password} onChange={e => setPassword(e.target.value)} />
				</InputGroup>
				{loginMode
					? null
					: <div>
						<InputGroup size="sm" className="mb-3">
							<InputGroup.Text id="inputGroup-sizing-sm">Имя</InputGroup.Text>
							<FormControl aria-label="password" aria-describedby="inputGroup-sizing-sm"
								value={firstname} onChange={e => setFirstname(e.target.value)} />
						</InputGroup>
						<InputGroup size="sm" className="mb-3">
							<InputGroup.Text id="inputGroup-sizing-sm">Фамилия</InputGroup.Text>
							<FormControl aria-label="password" aria-describedby="inputGroup-sizing-sm"
								value={lastname} onChange={e => setLastname(e.target.value)} />
						</InputGroup>
					</div>
				}
			</Modal.Body>
			<Modal.Footer>
				<div className="footer-content">
					{loginMode
						? <button className="switch-link" onClick={registrationFormHandler}>Регистрация</button>
						: <button className="switch-link" onClick={loginFormHandler}>Войти</button>
					}

					<Button variant="secondary" onClick={signIn}>
						{loginMode ? 'Войти' : 'Регистрация'}
					</Button>
				</div>
			</Modal.Footer>
		</Modal>
	);
});

export default LoginModal;