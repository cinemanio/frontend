// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
import Cookies from 'universal-cookie'

import i18nClient from '../../libs/i18nClient'

Cypress.Commands.add('login', (username, password) => {
  cy.request({
    method: 'post',
    url: 'https://cinemanio-backend.herokuapp.com/graphql/',
    body: {
      operationName: 'TokenAuth',
      variables: { username, password },
      query:
        'mutation TokenAuth($username: String!, $password: String!) {\n  ' +
        'tokenAuth(username: $username, password: $password) {\n    token\n    __typename\n  }\n' +
        '}',
    },
  }).then(response => new Cookies().set('jwt', response.body.data.tokenAuth.token, {}))
})

Cypress.Commands.add('lang', (language) => {
  new Cookies().set('lang', language, {})
  i18nClient.changeLanguage(language)
  cy.contains('English').click()
})

// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
