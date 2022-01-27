import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Context } from '../..';
import { createSymptom, deleteSymptom, fetchSymptoms, updateSymptom } from '../../http/deseaseAPI';
import { appendNotification } from '../ui/SNotification/SNotificationContainer';
import STable from '../ui/STable/STable';
import STableCell from '../ui/STable/STableCell';
import STableHeader from '../ui/STable/STableHeader';
import STableRow from '../ui/STable/STableRow';

const SymptomTable = observer(({ unsetTool }) => {
	const { desease } = useContext(Context);
	const [symptoms, setSymptoms] = useState([])
	const [editableSymptom, setEditableSymptom] = useState({ id: 0 })
	const [searchValue, setSearhValue] = useState('')
	const [newSymptomInput, setNewSymptomInput] = useState('')

	useEffect(() => {
		setSymptoms(desease.symptoms);
	}, [desease])

	const updateSymptomName = async (symptom) => {
		const response = await updateSymptom(symptom);
		refreshData();
		appendNotification(response.message);
	}

	const deleteSymptomHelper = async (symptom) => {
		const response = await deleteSymptom(symptom);
		await refreshData();
		appendNotification(response.message);
	}

	const refreshData = async () => {
		const data = await fetchSymptoms()
		desease.setSymptoms(data)
		setSymptoms(desease.symptoms);
		setEditableSymptom({ id: 0 })
	}

	const createNewSymptom = async () => {
		try {
			const newSymptom = {
				name: newSymptomInput,
			}
			const response = await createSymptom(newSymptom);
			await refreshData();
			setNewSymptomInput('');
			appendNotification(response.message);
		} catch (e) {
			appendNotification(e.response.data.message, 'warning')
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
		symptoms.sort((a, b) => compareValues(a[sortArg], b[sortArg]));
		setSymptoms(symptoms);
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
						value={newSymptomInput}
						placeholder="Добавить новый симптом..."
						className="create-input mb-3"
						style={{ width: '85%' }}
						onChange={e => setNewSymptomInput(e.target.value)}
						autoComplete="off"
					/>
					<button
						className="custom-button"
						style={{ margin: '0px 0px 0px 10px', maxHeight: '47px', width: '15%' }}
						onClick={createNewSymptom}
					>Добавить</button>
				</div>
			</div>
			<STable>
				<STableHeader>
					<STableCell
						variant="white-text"
						textAlign="center"
						width="5%"
						noselect interactive itemsCenter
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
					{symptoms.map(s => {
						let index = s.name.toLowerCase().indexOf(searchValue.toLowerCase());

						if (index !== -1) {
							let textBefore = index > 0 ? s.name.substring(0, index) : ""
							let searchQueryMatch = index !== -1 && searchValue ? `${s.name.substring(index, index + searchValue.length)}` : ""
							let textAfter = index + searchValue.length !== s.name.length ? s.name.substring(index + searchValue.length) : ""

							return <CSSTransition
								key={s.id}
								timeout={300}
								classNames="desease"
							>
								<STableRow key={s.id}>
									<STableCell textAlign="center" width="5%">{s.id}</STableCell>
									<STableCell textAlign="left" width="60%" flex>
										{editableSymptom.id === s.id
											? <div style={{ display: 'flex' }}>
												<input
													className="custom-input"
													style={{ width: '250px' }}
													value={editableSymptom.name}
													autoFocus
													onChange={(e) => setEditableSymptom({ ...editableSymptom, name: e.target.value })}>
												</input>
												<div className="apply-button" onClick={() => updateSymptomName(editableSymptom)}>Готово</div>
												<div className="apply-button" onClick={() => setEditableSymptom({ id: 0 })}>Отмена</div>
											</div>
											: <div>
												{textBefore}<span className="search-selection">{searchQueryMatch}</span>{textAfter}
											</div>
										}
										<div className="edit-button" onClick={() => setEditableSymptom(s)}></div>
									</STableCell>
									<STableCell textAlign="right" width="30%">{
										new Date(s.createdAt).toLocaleString(
											'ru-Ru',
											{ dateStyle: 'short', timeStyle: 'short' }
										)
									}</STableCell>
									<STableCell textAlign="left" width="5%" flex itemsCenter>
										<div className="delete-button" onClick={() => deleteSymptomHelper(s)}></div>
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

export default SymptomTable;