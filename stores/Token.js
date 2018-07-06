// @flow
import { observable, action, reaction } from 'mobx';

class Token {
  @observable token = window.localStorage.getItem('jwt');

  constructor() {
    reaction(
      () => this.token,
      (token) => {
        if (token) {
          window.localStorage.setItem('jwt', token);
        } else {
          window.localStorage.removeItem('jwt');
        }
      }
    );
  }

  @action set(token: string) {
    this.token = token;
  }
}

export default new Token();
