describe('Settings', () => {
  it('redirect to signin', () => {
    cy.visit('/settings')
    cy.url().should('be', '/signin')
  })

  describe('Authenticated', () => {
    const user = Cypress.env('user')

    beforeEach(() => {
      cy.lang('en')
      cy.login(user.username, user.password)
      cy.visit('/settings')
    })

    it('greets with right title', () => {
      cy.contains('h1', 'Account Settings')
    })

    it('has link to password change', () => {
      cy.contains('Change password').should('have.attr', 'href', '/password/change')
    })

    it('has username value', () => {
      cy.get('form')
        .should('contain', user.username)
        .click()
    })

    it('has email value', () => {
      cy.get('form')
        .should('contain', user.email)
        .click()
    })

    it('requires valid email', () => {
      cy.get('#email').type('wrong{enter}')
      cy.get('form').should('contain', 'is not valid email')
    })

    it('navigates to / on save', () => {
      cy.get('form').contains('Save settings').click()
      cy.url().should('be', '/')
    })
  })
})
