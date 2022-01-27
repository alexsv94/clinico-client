import { makeAutoObservable } from 'mobx';

export default class DeseasesStore {
	constructor() {
		this._symptoms = []
		this._diagnostics = []
		this._deseases = []
		
		makeAutoObservable(this)
	}

	setDeseases(deseases) {
		this._deseases = deseases
	}

	get deseases() {
		return this._deseases
	}

	setSymptoms(symptoms) {
		this._symptoms = symptoms
	}

	get symptoms() {
		return this._symptoms
	}

	setDiagnostics(diagnostics) {
		this._diagnostics = diagnostics
	}

	get diagnostics() {
		return this._diagnostics
	}
}