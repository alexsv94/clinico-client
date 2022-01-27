import React, { useContext, useEffect, useState } from 'react';
import Container from 'react-bootstrap/esm/Container';
import Spinner from 'react-bootstrap/esm/Spinner';
import { useHistory } from 'react-router';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Context } from '..';
import { fetchMedications } from '../http/medicationsAPI';
import { MEDICATIONS_ROUTE } from '../utils/consts';

const Medications = () => {
	const { medication } = useContext(Context)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		fetchMedications().then(data => medication.setMedications(data)).finally(() => setLoading(false))
	}, [medication])

	const [searhValue, setSearhValue] = useState('')
	const history = useHistory();

	if (loading) return <Spinner animation="grow"></Spinner>

	return (
		<Container className="mt-3">
			<input
				type="text"
				placeholder="Поиск..."
				className="filter-input mb-3"
				onChange={e => setSearhValue(e.target.value)}
				autoComplete="off"
			/>

			<TransitionGroup>
				{medication.medications.map((medication) => {
					let index = medication.name.toLowerCase().indexOf(searhValue.toLowerCase());

					if (index !== -1) {
						let textBefore = index > 0 ? medication.name.substring(0, index) : ""
						let searchQueryMatch = index !== -1 && searhValue ? `${medication.name.substring(index, index + searhValue.length)}` : ""
						let textAfter = index + searhValue.length !== medication.name.length ? medication.name.substring(index + searhValue.length) : ""

						return <CSSTransition
							key={medication.id}
							timeout={300}
							classNames="desease"
						>
							<div
								className="desease-card"
								onClick={() => history.push(MEDICATIONS_ROUTE + '/' + medication.id)}
							>
								{textBefore}<span className="search-selection">{searchQueryMatch}</span>{textAfter}
							</div>
						</CSSTransition>
					} else {
						return null
					}
				})}
			</TransitionGroup>
		</Container>
	);
};

export default Medications;