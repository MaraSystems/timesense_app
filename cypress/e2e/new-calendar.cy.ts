describe('New Calendar Page', () => {
  describe('Protected Route', () => {
    it('should redirect to login when not authenticated', () => {
      cy.visit('/calendars/new')
      cy.url().should('include', '/login')
    })
  })

  describe('Authenticated User', () => {
    beforeEach(() => {
      // Mock a logged-in user by setting localStorage
      cy.window().then((win) => {
        win.localStorage.setItem('auth_token', 'test-token')
        win.localStorage.setItem('user_data', JSON.stringify({
          id: '1',
          email: 'test@example.com',
          createdAt: new Date().toISOString()
        }))
      })
      cy.visit('/calendars/new')
    })

    afterEach(() => {
      cy.window().then((win) => {
        win.localStorage.clear()
      })
    })

    describe('Page Layout', () => {
      it('should display the page title', () => {
        cy.contains('Create New Calendar').should('be.visible')
      })

      it('should display the description', () => {
        cy.contains('Set up your availability for scheduling appointments').should('be.visible')
      })

      it('should display the title input', () => {
        cy.get('[data-testid="calendar-title-input"]').should('be.visible')
      })

      it('should display the slot duration select', () => {
        cy.get('[data-testid="slot-duration-select"]').should('be.visible')
      })

      it('should display the availability date inputs', () => {
        cy.get('[data-testid="live-at-input"]').should('be.visible')
        cy.get('[data-testid="expire-at-input"]').should('be.visible')
      })

      it('should display the time hour inputs', () => {
        cy.get('[data-testid="start-time-input"]').should('be.visible')
        cy.get('[data-testid="stop-time-input"]').should('be.visible')
      })

      it('should display the weekday checkboxes', () => {
        cy.get('[data-testid="weekdays-checkbox-group"]').should('be.visible')
      })

      it('should display cancel and create buttons', () => {
        cy.get('[data-testid="cancel-button"]').should('be.visible')
        cy.get('[data-testid="create-calendar-button"]').should('be.visible')
      })
    })

    describe('Form Validation', () => {
      it('should show error when title is empty', () => {
        cy.get('[data-testid="create-calendar-button"]').click()
        cy.get('[data-testid="title-error"]').should('be.visible')
        cy.get('[data-testid="title-error"]').should('contain', 'Title is required')
      })

      it('should show error when liveAt is empty', () => {
        cy.get('[data-testid="create-calendar-button"]').click()
        cy.get('[data-testid="liveAt-error"]').should('be.visible')
        cy.get('[data-testid="liveAt-error"]').should('contain', 'Start date is required')
      })

      it('should show error when expireAt is empty', () => {
        cy.get('[data-testid="create-calendar-button"]').click()
        cy.get('[data-testid="expireAt-error"]').should('be.visible')
        cy.get('[data-testid="expireAt-error"]').should('contain', 'End date is required')
      })

      it('should show error when expireAt is before liveAt', () => {
        cy.get('[data-testid="calendar-title-input"]').type('Test Calendar')
        cy.get('[data-testid="live-at-input"]').clear().type('2026-05-01T09:00')
        cy.get('[data-testid="expire-at-input"]').clear().type('2026-04-01T09:00')
        cy.get('[data-testid="create-calendar-button"]').click()
        cy.get('[data-testid="expireAt-error"]').should('be.visible')
      })

      it('should show error when stop time is before start time', () => {
        cy.get('[data-testid="start-time-input"]').clear().type('17')
        cy.get('[data-testid="stop-time-input"]').clear().type('9')
        cy.get('[data-testid="create-calendar-button"]').click()
        cy.get('[data-testid="stopTime-error"]').should('be.visible')
        cy.get('[data-testid="stopTime-error"]').should('contain', 'End hour must be after start hour')
      })

      it('should accept valid form inputs', () => {
        cy.get('[data-testid="calendar-title-input"]').type('Work Calendar')
        cy.get('[data-testid="calendar-title-input"]').should('have.value', 'Work Calendar')
      })
    })

    describe('Working Days Selection', () => {
      it('should have weekdays selected by default', () => {
        // Mon-Fri should be selected by default
        cy.get('[data-testid="checkbox-1"]').should('be.checked')
        cy.get('[data-testid="checkbox-2"]').should('be.checked')
        cy.get('[data-testid="checkbox-3"]').should('be.checked')
        cy.get('[data-testid="checkbox-4"]').should('be.checked')
        cy.get('[data-testid="checkbox-5"]').should('be.checked')
        cy.get('[data-testid="checkbox-6"]').should('not.be.checked')
        cy.get('[data-testid="checkbox-7"]').should('not.be.checked')
      })

      it('should allow toggling day selection', () => {
        // Click on Monday to uncheck - use force since it's sr-only
        cy.get('[data-testid="checkbox-1"]').click({ force: true })
        cy.get('[data-testid="checkbox-1"]').should('not.be.checked')
        // Click again to check
        cy.get('[data-testid="checkbox-1"]').click({ force: true })
        cy.get('[data-testid="checkbox-1"]').should('be.checked')
      })
    })

    describe('Cancel Button', () => {
      it('should navigate to calendars page when cancel is clicked', () => {
        cy.get('[data-testid="cancel-button"]').click()
        cy.url().should('include', '/calendars')
      })
    })

    describe('Responsive Design', () => {
      it('should display correctly on mobile viewport', () => {
        cy.viewport(375, 667)
        cy.contains('Create New Calendar').should('be.visible')
        cy.get('[data-testid="calendar-title-input"]').should('be.visible')
        cy.get('[data-testid="create-calendar-button"]').should('be.visible')
      })

      it('should display correctly on tablet viewport', () => {
        cy.viewport(768, 1024)
        cy.contains('Create New Calendar').should('be.visible')
        cy.get('[data-testid="calendar-title-input"]').should('be.visible')
        cy.get('[data-testid="create-calendar-button"]').should('be.visible')
      })

      it('should display correctly on desktop viewport', () => {
        cy.viewport(1280, 720)
        cy.contains('Create New Calendar').should('be.visible')
        cy.get('[data-testid="calendar-title-input"]').should('be.visible')
        cy.get('[data-testid="create-calendar-button"]').should('be.visible')
      })
    })
  })
})