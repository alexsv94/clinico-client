import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Context } from '../..';
import { banUser, deleteUser, fetchUsers, unBanUser } from '../../http/userAPI';
import { appendNotification } from '../ui/SNotification/SNotificationContainer';
import STable from '../ui/STable/STable';
import STableCell from '../ui/STable/STableCell';
import STableHeader from '../ui/STable/STableHeader';
import STableRow from '../ui/STable/STableRow';

const UserTable = observer(({ unsetTool }) => {
	const { user } = useContext(Context);
	const [users, setUsers] = useState([])
	const [searchValue, setSearhValue] = useState('')

	useEffect(() => {
		setUsers(user.allUsers);
	}, [user])

	const deleteUserHelper = async (user) => {
		const response = await deleteUser(user);
		await refreshData();
		appendNotification(response.message);
	}

	const refreshData = async () => {
		const data = await fetchUsers();
		user.setAllUsers(data)
		setUsers(user.allUsers);
	}

	const banUserHelper = async (item) => {
		const response = await banUser(item);
		await refreshData();
		appendNotification(response.message);
	}

	const unBanUserHelper = async (item) => {
		const response = await unBanUser(item);
		await refreshData();
		appendNotification(response.message);
	}

	const compareValues = (value1, value2) => {
		if (!isNaN(Date.parse(value1))) {
			const date1 = Date.parse(value1);
			const date2 = Date.parse(value2);
			return date1 > date2 ? 1 : -1;
		} else if (parseInt(value1)) {
			return parseInt(value1) > parseInt(value2) ? 1 : -1
		} else {
			return value1.localeCompare(value2);
		}
	}

	const sortColumnBy = (sortArg) => {
		users.sort((a, b) => compareValues(a[sortArg], b[sortArg]));
		setUsers(users);
	}

	const searchMatches = (text, value) => {
		const index = text.toLowerCase().indexOf(value.toLowerCase());

		const textBefore = index > 0 ? text.substring(0, index) : "";
		const searchQueryMatch = index !== -1 && value ? `${text.substring(index, index + value.length)}` : "";
		const textAfter = index !== -1 && index + value.length !== text.length ? text.substring(index + value.length) : "";

		return [textBefore, searchQueryMatch, textAfter];
	}

	return (
		<div style={{ width: '75%', marginLeft: '10px', flexGrow: 1 }}>
			<div>
				<input
					type="text"
					value={searchValue}
					placeholder="Поиск..."
					className="filter-input mb-3"
					onChange={e => setSearhValue(e.target.value)}
					autoComplete="off"
				/>
			</div>
			<STable>
				<STableHeader>
					<STableCell
						variant="white-text"
						textAlign="center"
						width="5%"
						noselect interactive
						onClick={() => sortColumnBy('id')}
					>
						Id
					</STableCell>
					<STableCell
						variant="white-text"
						textAlign="center"
						width="27%"
						noselect interactive
						onClick={() => sortColumnBy('email')}
					>
						E-Mail
					</STableCell>
					<STableCell
						variant="white-text"
						textAlign="center"
						width="14%"
						noselect interactive
						onClick={() => sortColumnBy('firstname')}
					>
						Имя
					</STableCell>
					<STableCell
						variant="white-text"
						textAlign="center"
						width="15%"
						noselect interactive
						onClick={() => sortColumnBy('lastname')}
					>
						Фамилия
					</STableCell>
					<STableCell
						variant="white-text"
						textAlign="center"
						width="10%"
						noselect interactive
						onClick={() => sortColumnBy('role')}
					>
						Роль
					</STableCell>
					<STableCell
						variant="white-text"
						textAlign="center"
						width="29%"
						noselect interactive
						onClick={() => sortColumnBy('createdAt')}
					>
						Дата регистрации
					</STableCell>
				</STableHeader>
				<TransitionGroup>
					{users.map(item => {
						const [emailBefore, emailMatch, emailAfter] = searchMatches(item.email, searchValue);
						const [firstnameBefore, firstnameMatch, firstnameAfter] = searchMatches(item.firstname, searchValue);
						const [lastnameBefore, lastnameMatch, lastnameAfter] = searchMatches(item.lastname, searchValue);

						if (emailMatch || firstnameMatch || lastnameMatch || !searchValue) {
							return <CSSTransition
								key={item.id}
								timeout={300}
								classNames="desease"
							>
								<STableRow key={item.id}>
									<STableCell textAlign="center" width="5%">{item.id}</STableCell>
									<STableCell textAlign="center" width="27%" flex>
										<div style={{ wordWrap: 'break-word', maxWidth: 'calc(100% - 10px)' }}>
											{!emailMatch
												? item.email
												: <span>{emailBefore}<span className="search-selection">{emailMatch}</span>{emailAfter}</span>
											}
										</div>
									</STableCell>
									<STableCell textAlign="center" width="14%" flex>
										<div style={{ wordWrap: 'break-word', maxWidth: 'calc(100% - 10px)' }}>
											{!firstnameMatch
												? item.firstname
												: <span>{firstnameBefore}<span className="search-selection">{firstnameMatch}</span>{firstnameAfter}</span>
											}
										</div>
									</STableCell>
									<STableCell textAlign="center" width="15%" flex>
										<div style={{ wordWrap: 'break-word', maxWidth: 'calc(100% - 10px)' }}>
											{!lastnameMatch
												? item.lastname
												: <span>{lastnameBefore}<span className="search-selection">{lastnameMatch}</span>{lastnameAfter}</span>
											}
										</div>
									</STableCell>
									<STableCell textAlign="center" width="10%" flex itemsCenter>{item.role}</STableCell>
									<STableCell textAlign="center" width="19%" flex itemsCenter>
										{new Date(item.createdAt).toLocaleString(
											'ru-Ru',
											{ dateStyle: 'short', timeStyle: 'short' }
										)}
									</STableCell>
									{user.user.email === item.email
										? <STableCell width="5%" />
										: <STableCell textAlign="left" width="5%" flex itemsCenter>
											{item.banned
												? <div className="unban-button" onClick={() => unBanUserHelper(item)}>
												</div>
												: <div className="ban-button" onClick={() => banUserHelper(item)}></div>
											}
										</STableCell>
									}
									<STableCell textAlign="left" width="5%" flex itemsCenter>
										<div className="delete-button" onClick={() => deleteUserHelper(item)}></div>
									</STableCell>
								</STableRow>
							</CSSTransition>
						} else {
							return null
						}
					})}
				</TransitionGroup>
			</STable>
		</div>
	);
});

export default UserTable;