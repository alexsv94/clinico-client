import { $host, $authHost } from './index';

//-----------------------------------SYMPTOMS-----------------------------------

export const createSymptom = async (symptom) => {
	const { data } = await $authHost.post('api/deseases/nodes/symptoms', symptom)
	return data;
}

export const updateSymptom = async (symptom) => {
	const { data } = await $authHost.put(`api/deseases/nodes/symptoms/${symptom.id}`, symptom)
	return data;
}

export const deleteSymptom = async (symptom) => {
	const { data } = await $authHost.delete(`api/deseases/nodes/symptoms/${symptom.id}`)
	return data;
}

export const fetchSymptoms = async () => {
	const { data } = await $host.get('api/deseases/nodes/symptoms')
	return data;
}

//-----------------------------------DIAGNOSTICS-----------------------------------

export const createDiagnosticMethod = async (method) => {
	const { data } = await $authHost.post('api/deseases/nodes/diagnostics', method)
	return data;
}

export const updateDiagnosticMethod = async (method) => {
	const { data } = await $authHost.put(`api/deseases/nodes/diagnostics/${method.id}`, method)
	return data;
}

export const deleteDiagnosticMethod = async (method) => {
	const { data } = await $authHost.delete(`api/deseases/nodes/diagnostics/${method.id}`)
	return data;
}

export const fetchDiagnosticMethods = async () => {
	const { data } = await $host.get('api/deseases/nodes/diagnostics')
	return data;
}

//-----------------------------------DESEASES-----------------------------------

export const createDesease = async (desease) => {
	const { data } = await $authHost.post('api/deseases', desease)
	return data;
}

export const updateDesease = async (desease) => {
	const { data } = await $authHost.put(`api/deseases/${desease.id}`, desease)
	return data;
}

export const deleteDesease = async (desease) => {
	const { data } = await $authHost.delete(`api/deseases/${desease.id}`)
	return data;
}

export const fetchDeseases = async () => {
	const { data } = await $host.get('api/deseases')
	return data;
}

export const fetchDeseaseById = async (id) => {
	const { data } = await $host.get('api/deseases/' + id)
	return data;
}

//-----------------------------------NOTES-----------------------------------

export const createNote = async (note, deseaseId) => {
	const { data } = await $authHost.post(`api/deseases/${deseaseId}/notes`,
		{ content: note.content })
	return data;
}