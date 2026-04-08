describe('NotFound Page', () => {
  beforeEach(() => {
    cy.visit('/not-found-page')
  })

  it('should display 404 error code', () => {
    cy.contains('404').should('be.visible')
  })

  it('should display page not found message', () => {
    cy.contains('Page Not Found').should('be.visible')
    cy.contains("Sorry, the page you're looking for doesn't exist or has been moved.").should('be.visible')
  })

  it('should display Go Home button', () => {
    cy.contains('Go Home').should('be.visible')
  })

  it('should display Go Back button', () => {
    cy.contains('Go Back').should('be.visible')
  })

  it('should navigate to home page when Go Home is clicked', () => {
    cy.contains('Go Home').click()
    cy.url().should('eq', Cypress.config().baseUrl + '/')
    cy.contains('Schedule Smarter with').should('be.visible')
  })

  it('should go back when Go Back is clicked', () => {
    // Start from home, navigate to a non-existent page
    cy.visit('/')
    cy.contains('Schedule Smarter with').should('be.visible')
    // Navigate to non-existent page
    cy.visit('/some-random-page')
    cy.contains('404').should('be.visible')
    // Click go back
    cy.contains('Go Back').click()
    // Should be back at home
    cy.url().should('eq', Cypress.config().baseUrl + '/')
    cy.contains('Schedule Smarter with').should('be.visible')
  })

  describe('Responsive Design', () => {
    it('should display correctly on mobile viewport', () => {
      cy.viewport(375, 667)
      cy.contains('404').should('be.visible')
      cy.contains('Page Not Found').should('be.visible')
      cy.contains('Go Home').should('be.visible')
      cy.contains('Go Back').should('be.visible')
    })

    it('should display correctly on tablet viewport', () => {
      cy.viewport(768, 1024)
      cy.contains('404').should('be.visible')
      cy.contains('Page Not Found').should('be.visible')
    })

    it('should display correctly on desktop viewport', () => {
      cy.viewport(1280, 720)
      cy.contains('404').should('be.visible')
      cy.contains('Page Not Found').should('be.visible')
    })
  })
})