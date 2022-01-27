import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Context } from '../..';
import { deleteDesease, fetchDeseases } from '../../http/deseaseAPI';
import SModal from '../ui/SModal/SModal';
import { appendNotification } from '../ui/SNotification/SNotificationContainer';
import STable from '../ui/STable/STable';
import STableCell from '../ui/STable/STableCell';
import STableHeader from '../ui/STable/STableHeader';
import STableRow from '../ui/STable/STableRow';
import DeseaseForm from './DeseaseForm';

const DeseaseTable = observer(({ unsetTool }) => {
	const { desease } = useContext(Context);
	const [deseases, setDeseases] = useState([])
	const [searchValue, setSearhValue] = useState('')
	const [editableDesease, setEditableDesease] = useState(undefined)

	const [modalShow, setModalShow] = useState(false);

	useEffect(() => {
		setDeseases(desease.deseases);
	}, [desease])

	const deleteDeseaseHelper = async (desease) => {
		const response = await deleteDesease(desease);
		await refreshData();
		appendNotification(response.message);
	}

	const refreshData = async () => {
		const data = await fetchDeseases()
		desease.setDeseases(data)
		setDeseases(desease.deseases);
	}

	const openEditForm = (item) => {
		setEditableDesease(item);
		setModalShow(true);
	}

	const closeEditForm = async (needToConfirm) => {
		if (needToConfirm) {
			const result = window.confirm('Отменить изменения?');
			if (result)
				setModalShow(false);
		} else {
			setModalShow(false);
		}
		setEditableDesease(undefined);
		await refreshData();
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
		deseases.sort((a, b) => compareValues(a[sortArg], b[sortArg]));
		setDeseases(deseases);
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
					{deseases.map(item => {
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
										<div>
											{textBefore}<span className="search-selection">{searchQueryMatch}</span>{textAfter}
										</div>
										<div className="edit-button" onClick={() => openEditForm(item)}></div>
									</STableCell>
									<STableCell textAlign="right" width="30%">
										{new Date(item.createdAt).toLocaleString(
											'ru-Ru',
											{ dateStyle: 'short', timeStyle: 'short' }
										)}
									</STableCell>
									<STableCell textAlign="left" width="5%" flex itemsCenter>
										<div className="delete-button" onClick={() => deleteDeseaseHelper(item)}></div>
									</STableCell>
								</STableRow>
							</CSSTransition>
						} else {
							return null
						}
					})}
				</TransitionGroup>
			</STable>
			<SModal show={modalShow} onClose={closeEditForm} width="60%">
				{editableDesease
					? <DeseaseForm deseaseToEdit={editableDesease} unsetTool={closeEditForm} mode="update" />
					: null
				}
			</SModal>
		</div>
	);
});

export default DeseaseTable;