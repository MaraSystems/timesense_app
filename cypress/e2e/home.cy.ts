describe('Homepage', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  describe('Navbar', () => {
    it('should display the TimeSense logo and brand name', () => {
      cy.contains('TimeSense').should('be.visible')
    })

    it('should display navigation links on desktop', () => {
      cy.contains('Home').should('be.visible')
      cy.contains('Calendars').should('be.visible')
      cy.contains('Appointments').should('be.visible')
    })

    it('should display Login and Get Started buttons', () => {
      cy.contains('Login').should('be.visible')
      cy.contains('Get Started').should('be.visible')
    })

    it('should toggle mobile menu when hamburger is clicked', () => {
      cy.viewport(375, 667)
      // Mobile menu should not be visible initially
      cy.get('[data-testid="mobile-menu"]').should('not.exist')
      // Mobile menu button should be visible
      cy.get('[data-testid="mobile-menu-button"]').should('be.visible')
      // Click to open mobile menu
      cy.get('[data-testid="mobile-menu-button"]').click()
      // Mobile menu should now be visible
      cy.get('[data-testid="mobile-menu"]').should('be.visible')
      cy.get('[data-testid="mobile-menu"]').contains('Home').should('be.visible')
      cy.get('[data-testid="mobile-menu"]').contains('Calendars').should('be.visible')
      cy.get('[data-testid="mobile-menu"]').contains('Appointments').should('be.visible')
    })
  })

  describe('Hero Section', () => {
    it('should display the main headline', () => {
      cy.contains('Schedule Smarter with').should('be.visible')
      cy.contains('TimeSense').should('be.visible')
    })

    it('should display the description text', () => {
      cy.contains('Create calendars, book appointments, and manage your schedule').should('be.visible')
    })

    it('should display Get Started and Login buttons', () => {
      cy.get('main').contains('Get Started').should('be.visible')
      cy.get('main').contains('Login').should('be.visible')
    })

    it('should display trust indicators', () => {
      cy.contains('Conflict Prevention').should('be.visible')
      cy.contains('Recurring Appointments').should('be.visible')
      cy.contains('Real-time Updates').should('be.visible')
    })
  })

  describe('Features Section', () => {
    it('should display the section title', () => {
      cy.contains('Why Choose TimeSense?').should('be.visible')
    })

    it('should display all four feature cards', () => {
      cy.contains('Calendar Management').should('be.visible')
      cy.contains('Easy Booking').should('be.visible')
      cy.contains('Conflict Prevention').should('be.visible')
      cy.contains('Recurring Appointments').should('be.visible')
    })

    it('should display feature descriptions', () => {
      cy.contains('Create multiple calendars for different purposes').should('be.visible')
      cy.contains('Book appointments with just a few clicks').should('be.visible')
      cy.contains('Automatic conflict detection').should('be.visible')
      cy.contains('Schedule appointments that repeat').should('be.visible')
    })
  })

  describe('Footer', () => {
    it('should display the TimeSense brand in footer', () => {
      cy.get('footer').contains('TimeSense').should('be.visible')
    })

    it('should display quick links', () => {
      cy.get('footer').contains('Home').should('be.visible')
      cy.get('footer').contains('Calendars').should('be.visible')
      cy.get('footer').contains('Appointments').should('be.visible')
    })

    it('should display action links', () => {
      cy.get('footer').contains('Create Calendar').should('be.visible')
      cy.get('footer').contains('Book Appointment').should('be.visible')
    })

    it('should display contact information', () => {
      cy.get('footer').contains('support@timesense.com').should('be.visible')
    })

    it('should display copyright with current year', () => {
      const currentYear = new Date().getFullYear()
      cy.get('footer').contains(`© ${currentYear} TimeSense. All rights reserved.`).should('be.visible')
    })
  })

  describe('Responsive Design', () => {
    it('should display correctly on mobile viewport', () => {
      cy.viewport(375, 667)
      cy.contains('Schedule Smarter with').should('be.visible')
      cy.contains('Why Choose TimeSense?').should('be.visible')
    })

    it('should display correctly on tablet viewport', () => {
      cy.viewport(768, 1024)
      cy.contains('Schedule Smarter with').should('be.visible')
      cy.contains('Why Choose TimeSense?').should('be.visible')
    })

    it('should display correctly on desktop viewport', () => {
      cy.viewport(1280, 720)
      cy.contains('Schedule Smarter with').should('be.visible')
      cy.contains('Why Choose TimeSense?').should('be.visible')
    })
  })
})