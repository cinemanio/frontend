// @flow
describe('Logout', () => {
  const user = Cypress.env('user')

  beforeEach(() => {
    cy.lang('en')
    cy.login(user.username, user.password)
    cy.visit('/')
  })

  it('should logout successfully', () => {
    cy.contains(user.username)
    cy.contains('logout').click()
    cy.contains('sign in')
  })
})
