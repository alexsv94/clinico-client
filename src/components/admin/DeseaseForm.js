import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card'
import '../../styles/AdminPanel.css'
import SDropdown from '../ui/SDropdown/SDropdown';
import { Context } from '../..';
import { createDesease, createDiagnosticMethod, createSymptom, fetchDeseases, fetchDiagnosticMethods, fetchSymptoms, updateDesease } from '../../http/deseaseAPI';
import { appendNotification } from '../ui/SNotification/SNotificationContainer';

const uuid = require('uuid');

const DeseaseForm = observer(({ unsetTool, deseaseToEdit, mode = "create" }) => {
	const [name, setName] = useState('')
	const [chosenSymptoms, setChosenSymptoms] = useState([])
	const [chosenDiagnostics, setChosenDiagnostics] = useState([])
	const [chosenMedications, setChosenMedications] = useState([])

	const [symptomInput, setSymptomInput] = useState('')
	const [diagnosticInput, setDiagnosticInput] = useState('')

	const [activeSDropdownId, setActiveSDropdownId] = useState(-1)

	const { desease, medication } = useContext(Context)

	useEffect(() => {
		if (deseaseToEdit) {
			setName(deseaseToEdit.name);

			setChosenSymptoms(() => {
				let state = [];
				deseaseToEdit.symptoms.forEach(i => state.push(i.id));
				return state;
			});

			setChosenDiagnostics(() => {
				let state = [];
				deseaseToEdit.diagnostics.forEach(i => state.push(i.id));
				return state;
			});

			setChosenMedications(() => {
				let state = [];
				deseaseToEdit.medications.forEach(i => state.push(i.id));
				return state;
			});
		}
	}, [deseaseToEdit])

	const clickSymptomHandler = (id) => {
		if (chosenSymptoms.includes(id)) {
			const index = chosenSymptoms.indexOf(id);
			chosenSymptoms.splice(index, 1);
			setChosenSymptoms([...chosenSymptoms]);
		} else {
			setChosenSymptoms([...chosenSymptoms, id]);
		}
	}

	const clickDiagnosticHandler = (id) => {
		if (chosenDiagnostics.includes(id)) {
			const index = chosenDiagnostics.indexOf(id);
			chosenDiagnostics.splice(index, 1);
			setChosenDiagnostics([...chosenDiagnostics]);
		} else {
			setChosenDiagnostics([...chosenDiagnostics, id]);
		}
	}

	const clickMedicationHandler = (id) => {
		if (chosenMedications.includes(id)) {
			const index = chosenMedications.indexOf(id);
			chosenMedications.splice(index, 1);
			setChosenMedications([...chosenMedications]);
		} else {
			setChosenMedications([...chosenMedications, id]);
		}
	}

	const createOrUpdateDesease = async () => {
		try {
			if (!window.confirm("?????????????????? ???????????????????")) return
			const data = {
				name: name,
				symptoms: JSON.stringify(chosenSymptoms),
				diagnostics: JSON.stringify(chosenDiagnostics),
				medications: JSON.stringify(chosenMedications),
			}

			if (mode === "create") {
				await createDesease(data);
				appendNotification('?????????????????????? ??????????????????');
			} else {
				data.id = deseaseToEdit.id;
				await updateDesease(data);
				appendNotification('?????????????????????? ????????????????');
			}

			const response = await fetchDeseases();
			desease.setDeseases(response);

			unsetTool();
		} catch (e) {
			appendNotification(e.response.message, 'warning');
		}
	}

	const createNewSymptom = async () => {
		try {
			const newSymptom = {
				name: symptomInput,
			}
			await createSymptom(newSymptom);
			fetchSymptoms().then(data => desease.setSymptoms(data));
			setSymptomInput('');
			appendNotification('?????????????? ????????????????');
		} catch (e) {
			appendNotification(e.response.data.message, 'warning');
		}
	}

	const createNewDiagnostic = async () => {
		try {
			const newDiagnostic = {
				name: diagnosticInput,
			}
			await createDiagnosticMethod(newDiagnostic);
			fetchDiagnosticMethods().then(data => desease.setDiagnostics(data));
			setDiagnosticInput('');
			appendNotification('?????????? ?????????????????????? ????????????????');
		} catch (e) {
			appendNotification(e.response.message);
		}
	}

	const closeForm = () => {
		if (!window.confirm("???????????????? ???????????????????")) return
		unsetTool();
	}

	return (
		<div className="forms d-flex flex-column" style={{ flexGrow: 1 }}>
			<h3>{name || "?????????? ??????????????????????"}</h3>
			<input
				type="text"
				placeholder="???????????????? ????????????????????????..."
				className="custom-input mb-3 w-100"
				value={name}
				onChange={e => setName(e.target.value)}
				autoComplete="off"
			/>

			{/* Symptoms card */}
			<Card
				bg="light"
				text="dark"
				className="mb-2"
			>
				<Card.Header className="d-flex justify-content-between">
					<SDropdown
						id={0}
						activeId={activeSDropdownId}
						elements={desease.symptoms}
						title="????????????????"
						onElementClick={clickSymptomHandler}
						onSwitchActiveId={setActiveSDropdownId}
					/>
					<div className="create-input-container">
						<input
							type="text"
							placeholder="???????????????? ????????????????..."
							className="custom-input"
							style={{ flexGrow: 1, maxWidth: '250px' }}
							value={symptomInput}
							onChange={e => setSymptomInput(e.target.value)}
							autoComplete="off"
						/>
						<button className="custom-button" onClick={createNewSymptom}>????????????????</button>
					</div>
				</Card.Header>
				<Card.Body className="d-flex flex-wrap" style={{ paddingBottom: 0 }}>
					{chosenSymptoms.map(s => {
						let node;
						for (let symptom of desease.symptoms) {
							if (symptom.id === s) {
								node = symptom;
								break
							}
						}
						if (node)
							return <div
								className="splitbutton"
								key={uuid.v4()}
							>
								<button
									className="splitbutton-left mb-2"
								>
									{node.name}
								</button>
								<button className="splitbutton-right mb-2" onClick={() => clickSymptomHandler(node.id)}></button>
							</div>
						else return null
					})}
				</Card.Body>
			</Card>

			{/* Diagnostics card */}
			<Card
				bg="light"
				text="dark"
				className="mb-2"
			>
				<Card.Header className="d-flex justify-content-between">
					<SDropdown
						id={1}
						activeId={activeSDropdownId}
						elements={desease.diagnostics}
						title="??????????????????????"
						onElementClick={clickDiagnosticHandler}
						onSwitchActiveId={setActiveSDropdownId} />
					<div className="create-input-container">
						<input
							type="text"
							placeholder="???????????????? ???????????? ??????????????????????..."
							className="custom-input"
							style={{ flexGrow: 1, maxWidth: '250px' }}
							value={diagnosticInput}
							onChange={e => setDiagnosticInput(e.target.value)}
							autoComplete="off"
						/>
						<button className="custom-button" onClick={createNewDiagnostic}>????????????????</button>
					</div>
				</Card.Header>
				<Card.Body className="d-flex flex-wrap" style={{ paddingBottom: 0 }}>
					{chosenDiagnostics.map(d => {
						let node;
						for (let diagnostic of desease.diagnostics) {
							if (diagnostic.id === d) {
								node = diagnostic;
								break
							}
						}
						if (node)
							return <div
								className="splitbutton"
								key={uuid.v4()}
							>
								<button
									className="splitbutton-left mb-2"
								>
									{node.name}
								</button>
								<button className="splitbutton-right mb-2" onClick={() => clickDiagnosticHandler(node.id)}></button>
							</div>
						else return null
					})}
				</Card.Body>
			</Card>

			{/* Medications card */}
			<Card
				bg="light"
				text="dark"
				className="mb-2"
			>
				<Card.Header className="d-flex">
					<SDropdown
						id={2}
						activeId={activeSDropdownId}
						elements={medication.medications}
						title="??????????????"
						onElementClick={clickMedicationHandler}
						onSwitchActiveId={setActiveSDropdownId} />
				</Card.Header>
				<Card.Body className="d-flex flex-wrap" style={{ paddingBottom: 0 }}>
					{chosenMedications.map(m => {
						let node;
						for (let med of medication.medications) {
							if (med.id === m) {
								node = med;
								break
							}
						}
						if (node)
							return <div
								className="splitbutton"
								key={uuid.v4()}
							>
								<button
									className="splitbutton-left mb-2"
								>
									{node.name}
								</button>
								<button className="splitbutton-right mb-2" onClick={() => clickMedicationHandler(node.id)}></button>
							</div>
						else return null
					})}
				</Card.Body>
			</Card>
			<div>
				<button className="custom-button" onClick={createOrUpdateDesease}>??????????????????</button>
				<button className="custom-button" onClick={closeForm}>????????????</button>
			</div>
		</div>
	);
});

export default DeseaseForm;

