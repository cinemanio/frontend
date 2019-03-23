// @flow
describe('Registration', () => {
  const user = Cypress.env('user')

  beforeEach(() => {
    cy.lang('en')
    cy.visit('/signup')
  })

  it('display error if activation key is wrong', () => {
    cy.visit('/account/activate/wrong')
    cy.contains('The activation key you provided is invalid.')
  })

  it('redirect to / if authenticated', () => {
    cy.login(user.username, user.password)
    cy.visit('/signup')
    cy.pathname('/movies')
  })

  it('greets with right title', () => cy.contains('h1', 'Sign Up'))

  it('has link to login', () => cy.contains('Have an account?').should('have.attr', 'href', '/signin'))

  it('requires username', () => {
    cy.get('form')
      .contains('Sign up')
      .click()
    cy.get('form').should('contain', 'field is required')
  })

  it('requires email', () => {
    cy.get('#username').type(`${user.username}{enter}`)
    cy.get('form').should('contain', 'field is required')
  })

  it('requires password', () => {
    cy.get('#username').type(`${user.username}{enter}`)
    cy.get('#email').type(`${user.email}{enter}`)
    cy.get('form').should('contain', 'field is required')
  })

  it('requires valid email', () => {
    cy.get('#username').type(user.username)
    cy.get('#email').type('wrong')
    cy.get('#password').type('wrong{enter}')
    cy.get('form').should('contain', 'The input is not valid email')
  })

  // TODO: it seems during registration there is such check
  xit('requires password to be different from username', () => {
    cy.get('#username').type(`${user.username}`)
    cy.get('#email').type(user.email)
    cy.get('#password').type(`${user.username}{enter}`)
    cy.get('form').should('contain', 'password is too similar to the username')
  })

  it('requires username to be unoccupied', () => {
    cy.get('#username').type(user.username)
    cy.get('#email').type(user.email)
    cy.get('#password').type(`${user.password}{enter}`)
    // TODO: fix message
    cy.get('form').should('contain', 'UNIQUE constraint failed: users_user.username')
  })

  it('display message on successful registration', () => {
    cy.recreateUser()
    const username = `${user.username}_new`
    cy.get('#username').type(username)
    cy.get('#email').type(user.email)
    cy.get('#password').type(`${user.password}{enter}`)
    cy.contains('Thanks for signing up')
    cy.emailSent('To activate your account, follow this link').then(email => {
      const [link] = email.match(/(\/account\/activate\/.+)/)
      cy.visit(link)
      cy.contains('Your account has been activated successfully')
      cy.contains(username)
    })
  })
})
