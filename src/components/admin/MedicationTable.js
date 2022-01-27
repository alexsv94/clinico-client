import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Context } from '../..';
import { deleteMedication, fetchMedications } from '../../http/medicationsAPI';
import SModal from '../ui/SModal/SModal';
import { appendNotification } from '../ui/SNotification/SNotificationContainer';
import STable from '../ui/STable/STable';
import STableCell from '../ui/STable/STableCell';
import STableHeader from '../ui/STable/STableHeader';
import STableRow from '../ui/STable/STableRow';
import MedicationForm from './MedicationForm';

const MedicationTable = observer(({ unsetTool }) => {
	const { medication } = useContext(Context);
	const [medications, setMedications] = useState([])
	const [searchValue, setSearhValue] = useState('')
	const [editableMedication, setEditableMedication] = useState(undefined)

	const [modalShow, setModalShow] = useState(false);

	useEffect(() => {
		setMedications(medication.medications);
	}, [medication])

	const deleteMedicationHelper = async (medication) => {
		const response = await deleteMedication(medication);
		await refreshData();
		appendNotification(response.message);
	}

	const refreshData = async () => {
		const data = await fetchMedications()
		medication.setMedications(data)
		setMedications(medication.medications);
	}

	const openEditForm = (item) => {
		setEditableMedication(item);
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
		setEditableMedication(undefined);
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
		medications.sort((a, b) => compareValues(a[sortArg], b[sortArg]));
		setMedications(medications);
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
					{medications.map(item => {
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
										<div className="delete-button" onClick={() => deleteMedicationHelper(item)}></div>
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
				{editableMedication
					? <MedicationForm medicationToEdit={editableMedication} unsetTool={closeEditForm} mode="update" />
					: null
				}
			</SModal>
		</div>
	);
});

export default MedicationTable;