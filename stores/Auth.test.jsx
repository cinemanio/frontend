import auth from './Auth'

describe('Auth Store', () => {
  it('should populate username', () => {
    auth.setUsername('username')
    expect(auth.values.username).toBe('username')
  })

  it('should populate password', () => {
    auth.setUsername('password')
    expect(auth.values.username).toBe('password')
  })

  it('should populate errors', () => {
    const errors = ['error']
    auth.setErrors(errors)
    expect(auth.errors[0]).toBe(errors[0])
  })

})
