describe('Movies', () => {
  beforeEach(() => {
    cy.lang('en')
    cy.visit('/movies')
  })

  it('should sort movies by year', () => {
    cy.get('.MovieInfo__box__2C79v span').should('be', '2006')
  })
})
