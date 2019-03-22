/**
 * Clean emails directory
 */
beforeEach(() => cy.exec(`rm ${Cypress.env('emailsDir')}*`, { failOnNonZeroExit: false }))
