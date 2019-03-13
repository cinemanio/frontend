// @flow
describe('Settings', () => {
  beforeEach(() => {
    cy.lang('en')
    cy.visit('/settings')
  })

  it('redirect to signin', () => cy.url().should('be', '/signin'))

  describe('Authenticated', () => {
    const user = Cypress.env('user')

    beforeEach(() => {
      cy.lang('en')
      cy.login(user.username, user.password)
      cy.visit('/settings')
    })

    it('greets with right title', () => cy.contains('h1', 'Account Settings'))

    it('has link to password change', () =>
      cy.contains('Change password').should('have.attr', 'href', '/password/change'))

    it('has username value', () => cy.get('#username').should('have.value', user.username))

    it('has email value', () => cy.get('#email').should('have.value', user.email))

    it('requires valid email', () => {
      cy.get('#email').clear().type('wrong{enter}')
      cy.get('form').should('contain', 'is not valid email')
    })

    it('navigates to / on save', () => {
      cy.contains('Save settings').click()
      cy.url().should('be', '/')
    })
  })
})
