// @flow
describe('Password Change', () => {
  beforeEach(() => {
    cy.lang('en')
    cy.visit('/password/change')
  })

  it('redirect to signin if not authenticated', () => cy.pathname('/signin'))

  describe('Authenticated', () => {
    const user = Cypress.env('user')

    beforeEach(() => {
      cy.login(user.username, user.password)
      cy.visit('/password/change')
    })

    it('greets with right title', () => cy.contains('h1', 'Change Password'))

    it('has link to account settings', () =>
      cy.contains('Change settings').should('have.attr', 'href', '/settings'))

    it('requires old password', () => {
      cy.get('form')
        .contains('Save password')
        .click()
      cy.get('form').should('contain', 'field is required')
    })

    it('requires new password', () => {
      cy.get('#oldPassword').type(`${user.password}{enter}`)
      cy.get('form').should('contain', 'field is required')
    })

    it('requires correct old password', () => {
      cy.get('#oldPassword').type('wrong')
      cy.get('#newPassword').type('new_password{enter}')
      cy.get('form').should('contain', 'old password was entered incorrectly')
    })

    it('navigates to / on save', () => {
      cy.get('#oldPassword').type(`${user.password}`)
      cy.get('#newPassword').type(`${user.password}{enter}`)
      cy.pathname('/')
    })
  })
})
