describe('Calendars Page', () => {
  describe('Protected Route', () => {
    it('should redirect to login when not authenticated', () => {
      cy.visit('/calendars')
      cy.url().should('include', '/login')
    })
  })
})

describe('Calendar View Page', () => {
  describe('Protected Route', () => {
    it('should redirect to login when not authenticated', () => {
      cy.visit('/calendars/1')
      cy.url().should('include', '/login')
    })
  })
})

describe('Edit Calendar Page', () => {
  describe('Protected Route', () => {
    it('should redirect to login when not authenticated', () => {
      cy.visit('/calendars/1/edit')
      cy.url().should('include', '/login')
    })
  })
})