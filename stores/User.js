// @flow
import { observable, action } from 'mobx'

// import agent from '../agent'

class User {
  @observable currentUser
  @observable loadingUser
  @observable updatingUser
  @observable updatingUserErrors

  @action pull() {
    this.loadingUser = true
    return agent.Auth.current()
      .then(action(({ user }) => {
        this.currentUser = user
      }))
      .finally(action(() => {
        this.loadingUser = false
      }))
  }

  @action update(newUser: Object) {
    this.updatingUser = true
    return agent.Auth.save(newUser)
      .then(action(({ user }) => {
        this.currentUser = user
      }))
      .finally(action(() => {
        this.updatingUser = false
      }))
  }

  @action forget() {
    this.currentUser = undefined
  }

}

export default new User()
