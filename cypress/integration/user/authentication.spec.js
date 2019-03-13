// @flow
describe('Authentication', () => {
  const user = Cypress.env('user')

  beforeEach(() => {
    cy.lang('en')
    cy.visit('/signin')
  })

  it('greets with right title', () => cy.contains('h1', 'Sign In'))

  it('has link to registration', () => cy.contains('Need an account?').should('have.attr', 'href', '/signup'))

  it('requires username', () => {
    cy.get('form')
      .contains('Sign in')
      .click()
    cy.get('form').should('contain', 'field is required')
  })

  it('requires password', () => {
    cy.get('#username').type(`${user.username}{enter}`)
    cy.get('form').should('contain', 'field is required')
  })

  it('requires valid username and password', () => {
    cy.get('#username').type(user.username)
    cy.get('#password').type('wrong{enter}')
    cy.get('form').should('contain', 'Please, enter valid credentials')
  })

  it('navigates to / on successful login', () => {
    cy.get('#username').type(user.username)
    cy.get('#password').type(`${user.password}{enter}`)
    cy.contains(user.username)
    cy.url().should('be', '/')
  })
})
