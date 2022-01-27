import { makeAutoObservable } from 'mobx';

export default class UserStore {
	constructor() {
		this._isAuth = false
		this._user = {}
		this._user.role = 'ADMIN'
		this._allUsers = []
		makeAutoObservable(this)
	}

	setAllUsers(users) {
		this._allUsers = users;
	}

	setIsAuth(bool) {
		this._isAuth = bool;
	}

	setUser(user) {
		this._user = user;
	}

	get allUsers() {
		return this._allUsers;
	}

	get isAuth() {
		return this._isAuth;
	}

	get user() {
		return this._user;
	}
}