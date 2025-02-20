import { type Locator, type Page, type BrowserContext, expect } from '@playwright/test'

export class FormRegistrationPage {
  private readonly page: Page
  selectors: {
    alerts: {
      message: Locator
    }
    buttons: {
      register: Locator
    }
    checkboxes: {
      termsAndConditions: Locator
    }
    textfields: {
      firstName: Locator
      lastName: Locator
      phoneNumber: Locator
      country: Locator
      email: Locator
      password: Locator
      resultFirstName: Locator
      resultLastName: Locator
      resultPhoneNumber: Locator
      resultCountry: Locator
      resultEmail: Locator
      heading: Locator
    }
    textboxes: {
      firstName: Locator
      lastName: Locator
      phoneNumber: Locator
      country: Locator
      email: Locator
      password: Locator
    }
  }

  constructor(page: Page) {
    this.page = page
    this.selectors = {
      alerts: {
        message: page.locator('div#message')
      },
      buttons: {
        register: page.getByRole('button', { name: 'Register' })
      },
      checkboxes: {
        termsAndConditions: page.locator('input[type="checkbox"]')
      },
      textfields: {
        firstName: page.locator('label[for=firstName]'),
        lastName: page.getByText('Last Name*'),
        phoneNumber: page.getByText('Phone nunber*'),
        country: page.getByText('Country'),
        email: page.locator('label[for=exampleInputEmail1]'),
        password: page.locator('label[for=exampleInputPassword1]'),
        resultFirstName: page.locator('div#resultFn'),
        resultLastName: page.locator('div#resultLn'),
        resultPhoneNumber: page.locator('div#resultPhone'),
        resultCountry: page.locator('div#country'),
        resultEmail: page.locator('div#resultEmail'),
        heading: page.getByRole('heading', { name: 'CHALLENGE - Spot the BUGS!' })
      },
      textboxes: {
        firstName: page.getByRole('textbox', { name: 'First Name' }),
        lastName: page.getByRole('textbox', { name: 'Last Name* Phone nunber*' }),
        phoneNumber: page.getByRole('textbox', { name: 'Enter phone number' }),
        country: page.locator('#countries_dropdown_menu'),
        email: page.getByRole('textbox', { name: 'Enter email' }),
        password: page.getByRole('textbox', { name: 'Password' })
      }
    }
  }

  async navigate() {
    await this.page.goto('/bugs-form')
    await expect(this.selectors.textfields.heading).toBeVisible()
  }

  async enterFirstName(firstName: string, isSuccess: boolean = true) {
    await expect.soft(this.selectors.textfields.firstName).toHaveText('First Name*')
    await this.selectors.textboxes.firstName.fill(firstName)
    if (isSuccess) await expect.soft(this.selectors.textboxes.firstName).toHaveValue(firstName)
    else await expect.soft(this.selectors.textboxes.firstName).not.toHaveValue(firstName)
  }

  async enterLastName(lastName: string) {
    await expect.soft(this.selectors.textfields.lastName).toHaveText('Last Name*')
    await this.selectors.textboxes.lastName.fill(lastName)
    await expect.soft(this.selectors.textboxes.lastName).toHaveValue(lastName)
  }

  async enterPhoneNumber(phoneNumber: string, isSuccess: boolean = true) {
    await expect.soft(this.selectors.textfields.phoneNumber).toHaveText('Phone Number*')
    await this.selectors.textboxes.phoneNumber.fill(phoneNumber)
    if (isSuccess) await expect.soft(this.selectors.textboxes.phoneNumber).toHaveValue(phoneNumber)
    else await expect.soft(this.selectors.textboxes.phoneNumber).not.toHaveValue(phoneNumber)
  }

  async selectCountry(country: string) {
    await expect.soft(this.selectors.textfields.country).toHaveText('Country')
    await this.selectors.textboxes.country.selectOption({ label: country })
    await expect.soft(this.selectors.textboxes.country).toHaveValue(country)
  }

  async enterEmail(email: string) {
    await expect.soft(this.selectors.textfields.email).toHaveText('Email Address*')
    await this.selectors.textboxes.email.fill(email)
    await expect.soft(this.selectors.textboxes.email).toHaveValue(email)
  }

  async enterPassword(password: string) {
    await expect.soft(this.selectors.textfields.password).toHaveText('Password*')
    await this.selectors.textboxes.password.fill(password)
    const maskedPassword = password.replaceAll(/./g, '*')
    await expect.soft(this.selectors.textboxes.password).toHaveValue(maskedPassword)
  }

  async clickRegister() {
    await this.selectors.buttons.register.click()
  }

  async assertTermsAndConditions() {
    await expect.soft(this.selectors.checkboxes.termsAndConditions).toBeEnabled()
  }

  async assertAlertMessage(message: string, isSuccess: boolean = true) {
    if (isSuccess) await expect.soft(this.selectors.alerts.message).toHaveText(message)
    else await expect.soft(this.selectors.alerts.message).not.toHaveText(message)
  }

  async assertFirstNameResult(firstName: string) {
    await expect.soft(this.selectors.textfields.resultFirstName).toContainText(firstName)
  }

  async assertLastNameResult(lastName: string) {
    await expect.soft(this.selectors.textfields.resultLastName).toContainText(lastName)
  }

  async assertPhoneNumberResult(phoneNumber: string) {
    await expect.soft(this.selectors.textfields.resultPhoneNumber).toContainText(phoneNumber)
  }

  async assertCountryResult(country: string) {
    await expect.soft(this.selectors.textfields.resultCountry).toContainText(country)
  }

  async assertEmailResult(email: string) {
    await expect.soft(this.selectors.textfields.resultEmail).toContainText(email)
  }
}
