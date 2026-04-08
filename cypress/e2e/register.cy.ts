describe('Register Page', () => {
  beforeEach(() => {
    cy.visit('/register')
  })

  describe('Page Layout', () => {
    it('should display the TimeSense logo and brand', () => {
      cy.contains('TimeSense').should('be.visible')
    })

    it('should display the create account heading', () => {
      cy.contains('Create Account').should('be.visible')
    })

    it('should display the email input field', () => {
      cy.get('[data-testid="email-input"]').should('be.visible')
    })

    it('should display the password input field', () => {
      cy.get('[data-testid="password-input"]').should('be.visible')
    })

    it('should display the confirm password input field', () => {
      cy.get('[data-testid="confirm-password-input"]').should('be.visible')
    })

    it('should display the create account button', () => {
      cy.get('[data-testid="register-button"]').should('be.visible')
    })

    it('should display link to login page', () => {
      cy.contains('Sign in').should('be.visible')
      cy.contains('Sign in').should('have.attr', 'href', '/login')
    })
  })

  describe('Form Validation', () => {
    it('should show error when email is empty', () => {
      cy.get('[data-testid="register-button"]').click()
      cy.get('[data-testid="email-error"]').should('be.visible')
      cy.get('[data-testid="email-error"]').should('contain', 'Email is required')
    })

    it('should show error for invalid email format', () => {
      cy.get('[data-testid="email-input"]').type('invalid-email')
      cy.get('[data-testid="register-button"]').click()
      cy.get('[data-testid="email-error"]').should('be.visible')
    })

    it('should show error when password is empty', () => {
      cy.get('[data-testid="email-input"]').type('test@example.com')
      cy.get('[data-testid="register-button"]').click()
      cy.get('[data-testid="password-error"]').should('be.visible')
      cy.get('[data-testid="password-error"]').should('contain', 'Password is required')
    })

    it('should show error when password is less than 8 characters', () => {
      cy.get('[data-testid="email-input"]').type('test@example.com')
      cy.get('[data-testid="password-input"]').type('pass')
      cy.get('[data-testid="register-button"]').click()
      cy.get('[data-testid="password-error"]').should('be.visible')
      cy.get('[data-testid="password-error"]').should('contain', 'at least 8 characters')
    })

    it('should show error when confirm password is empty', () => {
      cy.get('[data-testid="email-input"]').type('test@example.com')
      cy.get('[data-testid="password-input"]').type('password123')
      cy.get('[data-testid="register-button"]').click()
      cy.get('[data-testid="confirmPassword-error"]').should('be.visible')
      cy.get('[data-testid="confirmPassword-error"]').should('contain', 'confirm your password')
    })

    it('should show error when passwords do not match', () => {
      cy.get('[data-testid="email-input"]').type('test@example.com')
      cy.get('[data-testid="password-input"]').type('password123')
      cy.get('[data-testid="confirm-password-input"]').type('different')
      cy.get('[data-testid="register-button"]').click()
      cy.get('[data-testid="confirmPassword-error"]').should('be.visible')
      cy.get('[data-testid="confirmPassword-error"]').should('contain', 'do not match')
    })

    it('should accept valid form inputs', () => {
      cy.get('[data-testid="email-input"]').type('test@example.com')
      cy.get('[data-testid="email-input"]').should('have.value', 'test@example.com')
      cy.get('[data-testid="password-input"]').type('password123')
      cy.get('[data-testid="password-input"]').should('have.value', 'password123')
      cy.get('[data-testid="confirm-password-input"]').type('password123')
      cy.get('[data-testid="confirm-password-input"]').should('have.value', 'password123')
    })
  })

  describe('Password Visibility Toggle', () => {
    it('should toggle password visibility', () => {
      cy.get('[data-testid="password-input"]').type('password123')
      cy.get('[data-testid="password-input"]').should('have.attr', 'type', 'password')
      cy.get('[data-testid="toggle-password-input-visibility"]').click()
      cy.get('[data-testid="password-input"]').should('have.attr', 'type', 'text')
    })

    it('should toggle confirm password visibility', () => {
      cy.get('[data-testid="confirm-password-input"]').type('password123')
      cy.get('[data-testid="confirm-password-input"]').should('have.attr', 'type', 'password')
      cy.get('[data-testid="toggle-confirm-password-input-visibility"]').click()
      cy.get('[data-testid="confirm-password-input"]').should('have.attr', 'type', 'text')
    })
  })

  describe('Responsive Design', () => {
    it('should display correctly on mobile viewport', () => {
      cy.viewport(375, 667)
      cy.get('h1').contains('Create Account').should('be.visible')
      cy.get('[data-testid="email-input"]').should('be.visible')
      cy.get('[data-testid="password-input"]').should('be.visible')
      cy.get('[data-testid="register-button"]').should('be.visible')
    })

    it('should display correctly on tablet viewport', () => {
      cy.viewport(768, 1024)
      cy.get('h1').contains('Create Account').should('be.visible')
      cy.get('[data-testid="email-input"]').should('be.visible')
      cy.get('[data-testid="password-input"]').should('be.visible')
      cy.get('[data-testid="register-button"]').should('be.visible')
    })

    it('should display correctly on desktop viewport', () => {
      cy.viewport(1280, 720)
      cy.get('h1').contains('Create Account').should('be.visible')
      cy.get('[data-testid="email-input"]').should('be.visible')
      cy.get('[data-testid="password-input"]').should('be.visible')
      cy.get('[data-testid="register-button"]').should('be.visible')
    })
  })
})