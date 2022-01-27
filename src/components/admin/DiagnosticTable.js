import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Context } from '../..';
import { createDiagnosticMethod, deleteDiagnosticMethod, fetchDiagnosticMethods, updateDiagnosticMethod } from '../../http/deseaseAPI';
import { appendNotification } from '../ui/SNotification/SNotificationContainer';
import STable from '../ui/STable/STable';
import STableCell from '../ui/STable/STableCell';
import STableHeader from '../ui/STable/STableHeader';
import STableRow from '../ui/STable/STableRow';

const DiagnosticTable = observer(({ unsetTool }) => {
	const { desease } = useContext(Context);
	const [diagnostics, setDiagnostics] = useState([])
	const [editableItem, setEditableItem] = useState({ id: 0 })
	const [searchValue, setSearhValue] = useState('')
	const [newItemInput, setNewItemInput] = useState('')

	useEffect(() => {
		setDiagnostics(desease.diagnostics);
	}, [desease])

	const updateDiagnosticMethodName = async (method) => {
		await updateDiagnosticMethod(method);
		refreshData();
	}

	const deleteDiagnosticMethodHelper = async (method) => {
		const response = await deleteDiagnosticMethod(method);
		await refreshData();
		appendNotification(response.message);
	}

	const refreshData = async () => {
		const data = await fetchDiagnosticMethods()
		desease.setDiagnostics(data)
		setDiagnostics(desease.diagnostics);
		setEditableItem({ id: 0 })
	}

	const createNewDiagnosticMethod = async () => {
		try {
			const newDiagnosticMethod = {
				name: newItemInput,
			}
			await createDiagnosticMethod(newDiagnosticMethod);
			await refreshData();
			setNewItemInput('');
			appendNotification('Метод диагностики добавлен');
		} catch (e) {
			appendNotification(e.response.message);
		}
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
		diagnostics.sort((a, b) => compareValues(a[sortArg], b[sortArg]));
		setDiagnostics(diagnostics);
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
				<div style={{ display: 'flex' }}>
					<input
						type="text"
						value={newItemInput}
						placeholder="Добавить новый симптом..."
						className="create-input mb-3"
						style={{ width: '85%' }}
						onChange={e => setNewItemInput(e.target.value)}
						autoComplete="off"
					/>
					<button
						className="custom-button"
						style={{ margin: '0px 0px 0px 10px', maxHeight: '47px', width: '15%' }}
						onClick={createNewDiagnosticMethod}
					>Добавить</button>
				</div>
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
						width="60%"
						noselect interactive
						onClick={() => sortColumnBy('name')}
					>
						Название
					</STableCell>
					<STableCell
						variant="white-text"
						textAlign="center"
						width="35%"
						noselect interactive
						onClick={() => sortColumnBy('createdAt')}
					>
						Дата создания
					</STableCell>
				</STableHeader>
				<TransitionGroup>
					{diagnostics.map(item => {
						let index = item.name.toLowerCase().indexOf(searchValue.toLowerCase());

						if (index !== -1) {
							let textBefore = index > 0 ? item.name.substring(0, index) : ""
							let searchQueryMatch = index !== -1 && searchValue ? `${item.name.substring(index, index + searchValue.length)}` : ""
							let textAfter = index + searchValue.length !== item.name.length ? item.name.substring(index + searchValue.length) : ""

							return <CSSTransition
								key={item.id}
								timeout={300}
								classNames="desease"
							>
								<STableRow key={item.id}>
									<STableCell textAlign="center" width="5%">{item.id}</STableCell>
									<STableCell textAlign="left" width="60%" flex>
										{editableItem.id === item.id
											? <div style={{ display: 'flex' }}>
												<input
													className="custom-input"
													style={{ width: '250px' }}
													value={editableItem.name}
													autoFocus
													onChange={(e) => setEditableItem({ ...editableItem, name: e.target.value })}>
												</input>
												<div className="apply-button" onClick={() => updateDiagnosticMethodName(editableItem)}>Готово</div>
												<div className="apply-button" onClick={() => setEditableItem({ id: 0 })}>Отмена</div>
											</div>
											: <div>
												{textBefore}<span className="search-selection">{searchQueryMatch}</span>{textAfter}
											</div>
										}
										<div className="edit-button" onClick={() => setEditableItem(item)}></div>
									</STableCell>
									<STableCell textAlign="right" width="30%">{
										new Date(item.createdAt).toLocaleString(
											'ru-Ru',
											{ dateStyle: 'short', timeStyle: 'short' }
										)
									}</STableCell>
									<STableCell textAlign="left" width="5%" flex itemsCenter>
										<div className="delete-button" onClick={() => deleteDiagnosticMethodHelper(item)}></div>
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

export default DiagnosticTable;