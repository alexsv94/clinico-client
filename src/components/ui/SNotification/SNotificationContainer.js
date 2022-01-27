import { observer } from 'mobx-react-lite';
import React from 'react';
import './SNotification.css'


let notificationTimeout = 5;
let notificationContainer = document.querySelector('#notification-container');

export const appendNotification = (children, type) => {
	const container = notificationContainer || document.querySelector('#notification-container');
	const icon = document.createElement('div');
	icon.alt = "#"
	icon.className = 's-notification__icon';

	switch (type) {
		case 'info':
			icon.classList.add('icon-info');
			break;
		case 'warning':
			icon.classList.add('icon-warning');
			break;
		default:
			icon.classList.add('icon-info');
			break;
	}

	const notification = document.createElement('div');
	notification.className = 's-notification';
	notification.style.animationDuration = `${notificationTimeout}s`
	notification.innerHTML = `${children}`
	notification.insertBefore(icon, notification.firstChild);

	container.append(notification);

	setTimeout(() => {
		container.removeChild(notification);
	}, notificationTimeout * 1000);
}

const SNotificationContainer = observer(({ timeout }) => {
	notificationTimeout = timeout || 10;

	return (
		<div className="s-notification-container" id="notification-container">

		</div>
	);
});

export default SNotificationContainer;