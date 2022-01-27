import React, { useContext, useEffect, useState } from 'react';
import Container from 'react-bootstrap/esm/Container';
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import { Context } from '../index.js';
import '../styles/Deseases.css'
import '../styles/CustomDropdown.css'
import { observer } from 'mobx-react-lite';
import { useHistory } from 'react-router';
import { DESEASES_ROUTE } from '../utils/consts.js';
import { fetchDeseases } from '../http/deseaseAPI.js';
import Spinner from 'react-bootstrap/esm/Spinner';

const Deseases = observer(() => {
	const { desease } = useContext(Context)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		fetchDeseases().then(data => desease.setDeseases(data)).finally(() => setLoading(false))
	}, [desease])

	const [searchValue, setSearhValue] = useState('')
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
				{desease.deseases.map((desease) => {
					let index = desease.name.toLowerCase().indexOf(searchValue.toLowerCase());

					if (index !== -1) {
						let textBefore = index > 0 ? desease.name.substring(0, index) : ""
						let searchQueryMatch = index !== -1 && searchValue ? `${desease.name.substring(index, index + searchValue.length)}` : ""
						let textAfter = index + searchValue.length !== desease.name.length ? desease.name.substring(index + searchValue.length) : ""

						return <CSSTransition
							key={desease.id}
							timeout={300}
							classNames="desease"
						>
							<div
								className="desease-card"
								onClick={() => history.push(DESEASES_ROUTE + '/' + desease.id)}
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
});

export default Deseases;