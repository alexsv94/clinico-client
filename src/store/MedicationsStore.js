import { makeAutoObservable } from 'mobx';

export default class MedicationsStore {
	constructor() {
		this._medications = []
		
		makeAutoObservable(this)
	}

	setMedications(medications) {
		this._medications = medications
	}

	get medications() {
		return this._medications
	}
}