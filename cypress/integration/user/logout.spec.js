describe('Logout', () => {
  const user = Cypress.env('user')

  beforeEach(() => {
    cy.lang('en')
    cy.login(user.username, user.password)
    cy.visit('/')
  })

  it('should logout', () => {
    cy.contains('logout').click()
    cy.should('contain', 'sign in')
  })
})
