describe('Movies Page', () => {
  const url = value => cy.url().should('be', value)
  beforeEach(() => {
    cy.visit('http://localhost:3000/movies')
    cy.contains('English').click()
  })

  it('should be on movies page', () => url('/movies'))
  it('should sort movies by year', () => {
    cy.get('.MovieInfo__box__2C79v span').should('be', '2006')
  })
})
