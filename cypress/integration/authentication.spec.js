describe('Authentication Page', () => {
  const url = value => cy.url().should('be', value)
  const authenticate = () => {
    cy.get('#username')
      .type(user.username)
      .should('have.value', user.username)
    cy.get('#password')
      .type(user.password)
      .should('have.value', user.password)
    cy.get('button[type="submit"]').click()
  }

  beforeEach(() => {
    cy.visit('http://localhost:3000/movies')
    cy.contains('English').click()
  })

  it('should authenticate user', () => {
    url('/movies')
    cy.contains('sign in').click()
    url('/signin')
    authenticate()
    url('/movies')
    cy.contains(user.username)
    cy.contains('logout')
  })
})
