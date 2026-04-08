describe('Login Page', () => {
  beforeEach(() => {
    cy.visit('/login')
  })

  describe('Page Layout', () => {
    it('should display the TimeSense logo and brand', () => {
      cy.contains('TimeSense').should('be.visible')
    })

    it('should display the welcome message', () => {
      cy.contains('Welcome to TimeSense').should('be.visible')
    })

    it('should display the email input field', () => {
      cy.get('[data-testid="email-input"]').should('be.visible')
    })

    it('should display the password input field', () => {
      cy.get('[data-testid="password-input"]').should('be.visible')
    })

    it('should display the sign in button', () => {
      cy.get('[data-testid="login-button"]').should('be.visible')
    })

    it('should display link to register page', () => {
      cy.contains('Create one').should('be.visible')
      cy.contains('Create one').should('have.attr', 'href', '/register')
    })
  })

  describe('Form Validation', () => {
    it('should show error when email is empty', () => {
      cy.get('[data-testid="login-button"]').click()
      cy.get('[data-testid="email-error"]').should('be.visible')
      cy.get('[data-testid="email-error"]').should('contain', 'Email is required')
    })

    it('should show error for invalid email format', () => {
      cy.get('[data-testid="email-input"]').type('invalid-email')
      cy.get('[data-testid="login-button"]').click()
      cy.get('[data-testid="email-error"]').should('be.visible')
    })

    it('should show error when password is empty', () => {
      cy.get('[data-testid="email-input"]').type('test@example.com')
      cy.get('[data-testid="login-button"]').click()
      cy.get('[data-testid="password-error"]').should('be.visible')
      cy.get('[data-testid="password-error"]').should('contain', 'Password is required')
    })

    it('should accept valid email and password', () => {
      cy.get('[data-testid="email-input"]').type('test@example.com')
      cy.get('[data-testid="email-input"]').should('have.value', 'test@example.com')
      cy.get('[data-testid="password-input"]').type('password123')
      cy.get('[data-testid="password-input"]').should('have.value', 'password123')
    })
  })

  describe('Password Visibility Toggle', () => {
    it('should toggle password visibility', () => {
      cy.get('[data-testid="password-input"]').type('password123')
      cy.get('[data-testid="password-input"]').should('have.attr', 'type', 'password')
      cy.get('[data-testid="toggle-password-input-visibility"]').click()
      cy.get('[data-testid="password-input"]').should('have.attr', 'type', 'text')
      cy.get('[data-testid="toggle-password-input-visibility"]').click()
      cy.get('[data-testid="password-input"]').should('have.attr', 'type', 'password')
    })
  })

  describe('Responsive Design', () => {
    it('should display correctly on mobile viewport', () => {
      cy.viewport(375, 667)
      cy.get('h1').contains('Welcome').should('be.visible')
      cy.get('[data-testid="email-input"]').should('be.visible')
      cy.get('[data-testid="password-input"]').should('be.visible')
      cy.get('[data-testid="login-button"]').should('be.visible')
    })

    it('should display correctly on tablet viewport', () => {
      cy.viewport(768, 1024)
      cy.get('h1').contains('Welcome').should('be.visible')
      cy.get('[data-testid="email-input"]').should('be.visible')
      cy.get('[data-testid="password-input"]').should('be.visible')
      cy.get('[data-testid="login-button"]').should('be.visible')
    })

    it('should display correctly on desktop viewport', () => {
      cy.viewport(1280, 720)
      cy.get('h1').contains('Welcome').should('be.visible')
      cy.get('[data-testid="email-input"]').should('be.visible')
      cy.get('[data-testid="password-input"]').should('be.visible')
      cy.get('[data-testid="login-button"]').should('be.visible')
    })
  })
})