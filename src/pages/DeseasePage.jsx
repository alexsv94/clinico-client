import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/esm/Container';
import Card from 'react-bootstrap/Card'
import Image from 'react-bootstrap/Image'
import NavLink from 'react-bootstrap/NavLink'
import starEmpty from '../assets/star-empty.png'
import '../styles/DeseasePage.css'
import { fetchDeseaseById } from '../http/deseaseAPI';
import { useParams } from 'react-router-dom';
import parse from 'html-react-parser';
import { MEDICATIONS_ROUTE } from '../utils/consts';
import Spinner from 'react-bootstrap/esm/Spinner';

const DeseasePage = observer(() => {
	const [desease, setDesease] = useState({ info: [] })
	const [loading, setLoading] = useState(true)

	const { id } = useParams();

	useEffect(() => {
		fetchDeseaseById(id).then(data => {
			setDesease(data);
		}).finally(() => setLoading(false))
	}, [id])

	if (loading) return <Spinner animation="grow"></Spinner>

	if (!desease) return <div style={{ textAlign: 'center', marginTop: '30vh', width: '100%' }}>Заболевание не найдено в базе</div>

	return (
		<Container className="mt-3">
			<div className="d-flex mb-2 align-items-center justify-content-between">
				<h2 className="header">{desease.name}</h2>
				<Image className="star" width={35} height={35} src={starEmpty} alt='#' />
			</div>
			<Card
				bg="light"
				text="dark"
				className="mb-2"
			>
				<Card.Header className="card-title">Симптомы</Card.Header>
				<Card.Body className="d-flex">
					{desease.symptoms?.map(symptom =>
						<Card className="symptom-node inactive" key={symptom.id}>{symptom.name}</Card>
					)}
				</Card.Body>
			</Card>

			<Card
				bg="light"
				text="dark"
				className="mb-2"
			>
				<Card.Header className="card-title">Диагностика</Card.Header>
				<Card.Body className="d-flex">
					{desease.diagnostics?.map(diagnostic =>
						<Card className="symptom-node inactive" key={diagnostic.id}>{diagnostic.name}</Card>
					)}
				</Card.Body>
			</Card>

			<Card
				bg="light"
				text="dark"
				className="mb-2"
			>
				<Card.Header className="card-title">Лечение</Card.Header>
				<Card.Body className="d-flex">
					{desease.medications?.map(medication =>
						<Card className="medication-node" key={medication.id}>
							<NavLink className="medication-ref" href={MEDICATIONS_ROUTE + '/' + medication.id}>{medication.name}</NavLink>
						</Card>
					)}
				</Card.Body>
			</Card>

			<Card
				bg="light"
				text="dark"
				className="mb-2"
			>
				<Card.Header className="card-title">Комментарии ({desease.notes?.length})</Card.Header>
				<Card.Body className="d-flex flex-column">
					{desease.notes?.map(note =>
						<Card className="note-node mb-2" key={note.id}>
							<Card.Header className="d-flex justify-content-between">
								<span className="note-node__author">{note.author}</span>
								<span className="note-node__date">{
									new Date(note.createdAt).toLocaleString(
										'ru-Ru',
										{ dateStyle: 'long', timeStyle: 'short' }
									)
								}</span>
							</Card.Header>
							<Card.Body className="note-node__content">{parse(note.content)}</Card.Body>
						</Card>
					)}
				</Card.Body>
			</Card>
		</Container>
	);
});

export default DeseasePage;