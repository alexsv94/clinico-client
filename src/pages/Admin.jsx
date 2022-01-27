import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useState } from 'react';
import Container from 'react-bootstrap/esm/Container';
import ListGroup from 'react-bootstrap/ListGroup'
import { Context } from '..';
import DeseaseForm from '../components/admin/DeseaseForm';
import DeseaseTable from '../components/admin/DeseaseTable';
import DiagnosticTable from '../components/admin/DiagnosticTable';
import MedicationForm from '../components/admin/MedicationForm';
import MedicationTable from '../components/admin/MedicationTable';
import SymptomTable from '../components/admin/SymptomTable';
import UserTable from '../components/admin/UserTable';
import { fetchDeseases, fetchDiagnosticMethods, fetchSymptoms } from '../http/deseaseAPI';
import { fetchMedications } from '../http/medicationsAPI';
import { fetchUsers } from '../http/userAPI';
import '../styles/AdminPanel.css'

const Admin = observer(() => {
	const initialTool = { id: 0, name: '', component: null };

	const [activeCreateTool, setActiveCreateTool] = useState(initialTool);
	const [activeDataTable, setActiveDataTable] = useState(initialTool)

	const resetTool = () => {
		setActiveCreateTool(initialTool);
		setActiveDataTable(initialTool);
	}

	const createTools = [
		{ id: 1, name: 'Заболевание', component: <DeseaseForm unsetTool={resetTool} /> },
		{ id: 2, name: 'Лекарственный препарат', component: <MedicationForm unsetTool={resetTool} /> },
	];

	const dataTables = [
		{ id: 1, name: 'Симптомы', component: <SymptomTable unsetTool={resetTool} /> },
		{ id: 2, name: 'Методы диагностики', component: <DiagnosticTable unsetTool={resetTool} /> },
		{ id: 3, name: 'Заболевания', component: <DeseaseTable unsetTool={resetTool} /> },
		{ id: 4, name: 'Лек. препараты', component: <MedicationTable unSetTool={resetTool} /> },
		{ id: 5, name: 'Список пользователей', component: <UserTable unSetTool={resetTool} /> },
	];

	const { desease, medication, user } = useContext(Context)

	useEffect(() => {
		fetchSymptoms().then(data => desease.setSymptoms(data));
		fetchDiagnosticMethods().then(data => desease.setDiagnostics(data));
		fetchDeseases().then(data => desease.setDeseases(data));
		fetchMedications().then(data => medication.setMedications(data));
		fetchUsers().then(data => user.setAllUsers(data));
	}, [desease, medication, user]);

	return (
		<Container className="d-flex mt-3 p-0 justify-content-between">
			<div style={{ width: '25%', maxWidth: '240px' }}>
				<ListGroup className="mb-3">
					<ListGroup.Item variant="primary" className="list-header">Добавить</ListGroup.Item>
					{createTools.map(t =>
						<ListGroup.Item
							key={t.id}
							active={t.id === activeCreateTool.id}
							className="list-tool"
							onClick={() => {
								resetTool();
								setActiveCreateTool(t);
							}}
						>
							{t.name}
						</ListGroup.Item>
					)}
				</ListGroup>
				<ListGroup>
					<ListGroup.Item variant="primary" className="list-header">База данных</ListGroup.Item>
					{dataTables.map(t =>
						<ListGroup.Item
							key={t.id}
							active={t.id === activeDataTable.id}
							className="list-tool"
							onClick={() => {
								resetTool();
								setActiveDataTable(t);
							}}
						>
							{t.name}
						</ListGroup.Item>
					)}
				</ListGroup>
			</div>
			{activeCreateTool.id !== 0 ? activeCreateTool.component : null}
			{activeDataTable.id !== 0 ? activeDataTable.component : null}
		</Container>
	);
});

export default Admin;