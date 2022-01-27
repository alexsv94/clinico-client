import { $host, $authHost } from './index';


export const createMedication = async (medication) => {
	const { data } = await $authHost.post('api/medications', medication)
	return data;
}

export const fetchMedications = async () => {
	const { data } = await $host.get('api/medications')
	return data;
}

export const fetchMedicationById = async (id) => {
	const { data } = await $host.get('api/medications/' + id)
	return data;
}

export const updateMedication = async (medication) => {
	const { data } = await $authHost.put(`api/medications/${medication.id}`, medication)
	return data;
}

export const deleteMedication = async (medication) => {
	const { data } = await $authHost.delete(`api/medications/${medication.id}`)
	return data;
}