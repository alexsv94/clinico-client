import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import '../../../styles/CustomDropdown.css'

const SDropdown = observer(({ id, title, elements, onElementClick, activeId, onSwitchActiveId }) => {
	const [show, setShow] = useState(false)
	const [elemSearch, setElemSearch] = useState('')
	const [clearbtnShow, setClearbtnShow] = useState(false)

	useEffect(() => {
		setShow(id === activeId)
	}, [id, activeId])

	const searchQueryChangeHandler = (value) => {
		setElemSearch(value);
		value === '' ? setClearbtnShow(false) : setClearbtnShow(true)
	}

	return (
		<div className="dropdown-custom">
			<button
				onClick={id !== activeId ? () => onSwitchActiveId(id) : () => onSwitchActiveId(-1)}
				className={show ? "dropbtn custom-focus" : "dropbtn"}
			>
				{title} {show ? <span>▲</span> : <span>▼</span>}
			</button>
			<div className={`dropdown-content ${show ? "show-content" : ""}`}>
				<button
					className={clearbtnShow ? "clearbtn show-clearbtn" : "clearbtn"}
					onClick={() => searchQueryChangeHandler('')}
				/>
				<input
					type="text"
					placeholder="Поиск..."
					className="search-input"
					value={elemSearch}
					onChange={e => searchQueryChangeHandler(e.target.value)}
					autoComplete="off"
				/>
				<div className="elements">
					{elements.map(elem => {
						let index = elem.name.toLowerCase().indexOf(elemSearch.toLowerCase());

						if (index !== -1) {
							let textBefore = index > 0 ? elem.name.substring(0, index) : ""
							let searchQueryMatch = index !== -1 && elemSearch ? `${elem.name.substring(index, index + elemSearch.length)}` : ""
							let textAfter = index + elemSearch.length !== elem.name.length ? elem.name.substring(index + elemSearch.length) : ""

							return <div
								className="dropdown-element"
								key={elem.id}
								onClick={() => onElementClick(elem.id)}
							>
								{textBefore}<span className="search-selection">{searchQueryMatch}</span>{textAfter}
							</div>
						}
						else return null
					})}
				</div>

			</div>
		</div>
	);
});

export default SDropdown;