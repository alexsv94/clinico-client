import { $host, $authHost } from './index';
import jwt_decode from 'jwt-decode'


export const registration = async (email, password, firstname, lastname) => {
	const { data } = await $host.post('api/user/registration',
		{ email, password, firstname, lastname, role: 'ADMIN' })
	localStorage.setItem('auth_token', data.token)
	return jwt_decode(data.token);
}

export const login = async (email, password) => {
	const { data } = await $host.post('api/user/login',
		{ email, password })
	localStorage.setItem('auth_token', data.token)
	return jwt_decode(data.token);
}

export const check = async () => {
	const { data } = await $authHost.get('api/user/auth')
	localStorage.setItem('auth_token', data.token)
	return jwt_decode(data.token);
}

export const logout = () => {
	localStorage.removeItem('auth_token')
}

export const fetchUsers = async () => {
	const { data } = await $authHost.get('api/user');
	return data;
}

export const updateUser = async (user) => {
	const { data } = await $authHost.put(`api/user/${user.id}`, user)
	return data;
}

export const banUser = async (user) => {
	const { data } = await $authHost.put(`api/user/${user.id}/ban`)
	return data;
}

export const unBanUser = async (user) => {
	const { data } = await $authHost.put(`api/user/${user.id}/unban`)
	return data;
}

export const deleteUser = async (user) => {
	const { data } = await $authHost.delete(`api/user/${user.id}`)
	return data;
}