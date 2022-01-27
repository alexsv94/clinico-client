import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card'
import '../../styles/MedicationPage.css'
import '../../styles/DeseasePage.css'
import { Editor } from '@tinymce/tinymce-react';
import SAccordion from '../ui/SAccordion/SAccordion';
import { createMedication, fetchMedications, updateMedication } from '../../http/medicationsAPI';
import { Context } from '../..';
import { appendNotification } from '../ui/SNotification/SNotificationContainer';

const uuid = require('uuid');

const MedicationForm = observer(({ unsetTool, medicationToEdit, resetData, mode = "create" }) => {
	const { medication } = useContext(Context)

	const [name, setName] = useState('')
	const [indications, setIndications] = useState('')
	const [contrindications, setContrindications] = useState('')

	const [dosageFormNameInput, setDosageFormNameInput] = useState('')
	const [dosageFormDosageInput, setDosageFormDosageInput] = useState('')

	const [dosageForms, setDosageForms] = useState([])
	const [currentDosageForm, setCurrentDosageForm] = useState({ id: '', name: '', dosage: '', application_mode: '' })

	const [currentApplicationMode, setCurrentApplicationMode] = useState('')

	useEffect(() => {
		if (medicationToEdit) {
			setName(medicationToEdit.name);

			setDosageForms(() => {
				let state = [];
				medicationToEdit.dosage_forms.forEach(i =>
					state.push({
						id: i.id,
						name: i.name,
						dosage: i.dosage,
						application_mode: i.application_mode
					}
					));
				return state;
			});

			setCurrentDosageForm(medicationToEdit.dosage_forms[0]);
			setCurrentApplicationMode(medicationToEdit.dosage_forms[0].application_mode);

			setIndications(medicationToEdit.indications);
			setContrindications(medicationToEdit.contrindications);
		}
	}, [medicationToEdit])

	if (!medicationToEdit) {
		useEffect(() => {
			if (dosageForms.length < 2) setCurrentDosageForm(dosageForms[0])
		}, [dosageForms])
	}

	const createNewDosageForm = () => {
		if (!dosageFormNameInput || !dosageFormDosageInput) return alert('Введите форму выпуска и дозировку')
		const id = uuid.v4();
		const result = [...dosageForms, { id, name: dosageFormNameInput, dosage: dosageFormDosageInput, application_mode: '' }]
		setDosageForms(result);
	}

	const switchCurrentDosageForm = async (id) => {
		const curForm = dosageForms.find(element => element.id === currentDosageForm.id)
		curForm.application_mode = currentApplicationMode
		const form = dosageForms.find(element => element.id === id);
		setCurrentDosageForm(form);
		setCurrentApplicationMode(form.application_mode || '')
	}

	const removeDosageForm = (id) => {
		const result = dosageForms.filter(form => form.id !== id);
		setDosageForms(result);
	}

	const createOrUpdateMedication = async () => {
		try {
			if (!window.confirm("Применить изменения?")) return
			const curDosage = dosageForms.find(element => element.id === currentDosageForm.id);
			curDosage.application_mode = currentDosageForm.application_mode;

			let dosage = [];

			for (let d of dosageForms) {
				dosage.push({
					name: d.name,
					dosage: d.dosage,
					application_mode: d.application_mode
				})
			}

			const data = {
				name: name,
				indications: indications,
				contrindications: contrindications,
				dosage: JSON.stringify(dosage),
			}

			if (mode === "create") {
				await createMedication(data);
				appendNotification('Препарат добавлен');
			} else {
				data.id = medicationToEdit.id;
				await updateMedication(data);
				appendNotification('Препарат изменен');
			}
			unsetTool();

			fetchMedications().then(data => medication.setMedications(data))

			unsetTool();
		} catch (e) {
			appendNotification(e.response.message);
		}
	}

	const closeForm = () => {
		if (!window.confirm("Отменить изменения?")) return
		unsetTool();
	}

	const editorAPIKey = 'gt43epssil14uxwgtzcidfcq2r09tb99mrqfwt1wbg28mbnd'

	const editorInit = {
		selector: 'textarea#curappmode',
		height: '100%',
		menubar: false,
		resize: false,
		font_formats: '8pt 10pt 12pt 14pt 16pt 18pt 24pt 36pt 48pt',
		lineheight_formats: '0.25 0.5 0.75 1 1.1 1.2 1.3 1.4 1.5',
		plugins: [
			'advlist autolink lists link image',
			'charmap print preview anchor help',
			'searchreplace visualblocks code',
			'insertdatetime media table paste wordcount'
		],
		toolbar:
			`bold italic | fontsizeselect | lineheight | alignleft aligncenter alignright | 
				bullist numlist outdent indent`
	}

	return (
		<div className="forms d-flex flex-column" style={{ flexGrow: 1 }}>
			<h3>{name || "Новый лекарственный препарат"}</h3>
			<input
				type="text"
				placeholder="Название лекарственного препарата..."
				className="custom-input mb-3 w-100"
				value={name}
				onChange={e => setName(e.target.value)}
				autoComplete="off"
			/>

			<Card
				bg="light"
				text="dark"
				className="mb-2 card-title"
			>
				<Card.Header className="d-flex justify-content-between align-items-center">
					Формы выпуска
					<div className="create-input-container" style={{ maxWidth: '600px' }}>
						<input
							type="text"
							placeholder="Форма выпуска..."
							className="custom-input"
							style={{ flexGrow: 1, marginLeft: '15px' }}
							value={dosageFormNameInput}
							onChange={e => setDosageFormNameInput(e.target.value)}
							autoComplete="off"
						/>
						<input
							type="text"
							placeholder="Дозировка..."
							className="custom-input"
							style={{ flexGrow: 1, marginLeft: '15px' }}
							value={dosageFormDosageInput}
							onChange={e => setDosageFormDosageInput(e.target.value)}
							autoComplete="off"
						/>
						<button
							className="custom-button"
							style={{ flexGrow: 1, marginLeft: '15px', width: 'auto' }}
							onClick={createNewDosageForm}
						>
							Добавить
						</button>
					</div>
				</Card.Header>
				<Card.Body className="d-flex" style={{ flexWrap: 'wrap', maxWidth: '100%' }}>
					{dosageForms.map(f => {
						return <div
							className="splitbutton"
							key={f.name}
						>
							<button
								className="splitbutton-left mb-2"
								onClick={() => switchCurrentDosageForm(f.id)}
							>
								{`${f.name} | ${f.dosage}`}
							</button>
							<button className="splitbutton-right mb-2" onClick={() => removeDosageForm(f.id)}></button>
						</div>
					})}
				</Card.Body>
			</Card>

			<SAccordion title="Показания">
				<Editor
					apiKey={editorAPIKey}
					value={indications}
					init={editorInit}
					onEditorChange={(newValue, editor) => setIndications(newValue)}
				/>
			</SAccordion>

			<SAccordion title="Противопоказания">
				<Editor
					apiKey={editorAPIKey}
					value={contrindications}
					init={editorInit}
					onEditorChange={(newValue, editor) => setContrindications(newValue)}
				/>
			</SAccordion>

			{dosageForms.length > 0
				? <SAccordion title={`Способ применения (${currentDosageForm?.name} | ${currentDosageForm?.dosage})`}>
					<Editor
						apiKey={editorAPIKey}
						value={currentApplicationMode}
						init={editorInit}
						onEditorChange={(newValue, editor) => setCurrentApplicationMode(newValue)}
					/>
				</SAccordion>
				: null
			}

			<div>
				<button className="custom-button" onClick={createOrUpdateMedication}>Сохранить</button>
				<button className="custom-button" onClick={closeForm}>Отмена</button>
			</div>
		</div>
	);
});

export default MedicationForm;

