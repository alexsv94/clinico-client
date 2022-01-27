import { observer } from 'mobx-react-lite';
import React from 'react';
import './SModal.css';

const SModal = observer(({ children, show, onClose, width, height }) => {
	let styles = {
		width,
		height
	};

	return (
		<div
			className={`s-modal__back ${show ? 's-modal-show' : ''}`}
			onClick={onClose}
		>
			<div className={`s-modal ${show ? 's-modal-appear' : ''}`}
				onClick={e => e.stopPropagation()}
				style={styles}
			>
				{children}
			</div>
		</div>
	);
});

export default SModal;