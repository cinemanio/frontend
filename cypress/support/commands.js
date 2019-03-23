// @flow
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
import User from 'stores/User'

Cypress.Commands.add('login', (username: string, password: string) => {
  cy.request({
    method: 'post',
    url: Cypress.env('backendUrl'),
    body: {
      operationName: 'TokenAuth',
      variables: { username, password },
      query:
        'mutation TokenAuth($username: String!, $password: String!) {\n  ' +
        'tokenAuth(username: $username, password: $password) {\n    token\n    __typename\n  }\n' +
        '}',
    },
  }).then((response: Object) => {
    cy.setCookie('jwt', response.body.data.tokenAuth.token, {})
    User.login(username)
  })
})

Cypress.Commands.add('lang', (language: string) => cy.setCookie('lang', language))

Cypress.Commands.add('pathname', (pathname: string) => cy.location('pathname').should('equal', pathname))

Cypress.Commands.add('emailSent', (text: string) => {
  cy.wait(1000)
  cy.exec(`ls ${Cypress.env('emailsDir')} | wc -l`)
    .its('stdout')
    .should('equal', '1')
  return cy
    .exec(`ls ${Cypress.env('emailsDir')}`)
    .then(({ stdout }) => cy.readFile(`${Cypress.env('emailsDir')}${stdout}`).should('contain', text))
})

Cypress.Commands.add('recreateUser', () =>
  cy.exec(
    // TODO: orginize better this command call
    '/Users/ramusus/.virtualenvs/cinemanio/bin/python ./manage.py seed_test_user --settings=cinemanio.settings_test'
  )
)

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
