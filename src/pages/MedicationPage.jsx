import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/esm/Container';
import Image from 'react-bootstrap/esm/Image';
import starEmpty from '../assets/star-empty.png'
import { useParams } from 'react-router';
import { fetchMedicationById } from '../http/medicationsAPI';
import Card from 'react-bootstrap/esm/Card';
import Spinner from 'react-bootstrap/Spinner'
import parse from 'html-react-parser';

const MedicationPage = observer(() => {
	const [medication, setmedication] = useState({})
	const [loading, setLoading] = useState(true)
	const [activeDosageForm, setActiveDosageForm] = useState(-1)
	const [currentApplicationMode, setCurrentApplicationMode] = useState('')

	const { id } = useParams();

	const switchActiveDosageForm = (id) => {
		const form = medication.dosage_forms.find(f => f.id === id);
		setActiveDosageForm(form);
		setCurrentApplicationMode(form.application_mode);
	}

	useEffect(() => {
		fetchMedicationById(id).then(data => {
			setmedication(data);
			setActiveDosageForm(data.dosage_forms[0])
			setCurrentApplicationMode(data.dosage_forms[0].application_mode)
		}).finally(() => setLoading(false))
	}, [id])

	if (loading || !medication) return <Spinner animation='grow'></Spinner>

	return (
		<Container className="mt-3">
			<div className="d-flex mb-2 align-items-center justify-content-between">
				<div className="header">{medication.name}</div>
				<Image className="star" width={35} height={35} src={starEmpty} alt='#' />
			</div>

			<Card
				bg="light"
				text="dark"
				className="mb-2"
			>
				<Card.Header className="card-title">Формы выпуска</Card.Header>
				<Card.Body>
					{medication.dosage_forms?.map(dosage =>
						<button
							className={`dosage-btn ${activeDosageForm.id === dosage.id ? 'dosage-btn-active' : ''}`}
							key={dosage.name}
							onClick={() => switchActiveDosageForm(dosage.id)}
						>
							{dosage.name + ' | ' + dosage.dosage}
						</button>
					)}
				</Card.Body>
			</Card>


			<Card
				bg="light"
				text="dark"
				className="mb-2"
			>
				<Card.Header className="card-title">Показания</Card.Header>
				<Card.Body>
					{parse(medication?.indications || '')}
				</Card.Body>
			</Card>

			<Card
				bg="light"
				text="dark"
				className="mb-2"
			>
				<Card.Header className="card-title">Противопоказания</Card.Header>
				<Card.Body>
					{parse(medication?.contrindications || '')}
				</Card.Body>
			</Card>

			<Card
				bg="light"
				text="dark"
				className="mb-2"
			>
				<Card.Header className="card-title">Способ применения и дозы (<strong>{activeDosageForm.name} | {activeDosageForm.dosage}</strong>)</Card.Header>
				<Card.Body className="parsed-block">
					{parse(currentApplicationMode || '')}
				</Card.Body>
			</Card>
		</Container>
	);
});

export default MedicationPage;