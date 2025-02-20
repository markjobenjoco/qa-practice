import { test, expect } from '@playwright/test'

const userDetails = {
  firstName: 'John',
  lastName: 'Doe',
  phoneNumber: '1234567890',
  country: 'Philippines',
  email: 'email',
  password: 'password'
}

test.describe('Spot the Bugs', () => {
  test.beforeEach('navigate to bugs-form page', async ({ page }) => {
    await page.goto('/bugs-form')
    await expect(page.getByRole('heading', { name: 'CHALLENGE - Spot the BUGS!' })).toBeVisible()
  })

  /**
   * Bugs:
   *    1. First name is not required
   *    2. Phone number is misspelled
   *    3. Text format inconsistency for phone number and email address
   *    comparing to First Name and Last Name
   * Bug Counter: 3
   */
  test('Validate required and not required fields', async ({ page }) => {
    await expect.soft(page.locator('label[for=firstName]')).toHaveText('First Name*')
    await expect.soft(page.getByText('Last Name*')).toHaveText('Last Name*')
    await expect.soft(page.getByText('Phone nunber*')).toHaveText('Phone Number*')
    await expect.soft(page.getByText('Country')).toHaveText('Country')
    await expect.soft(page.locator('label[for=exampleInputEmail1]')).toHaveText('Email Address*')
    await expect.soft(page.locator('label[for=exampleInputPassword1]')).toHaveText('Password*')
  })

  /**
   * Bugs:
   * Suggestion: Add red highlitght to the required fields
   *            if required fields has no input
   * Bug Counter: 3
   */
  test('Submit form without any input', async ({ page }) => {
    const submitButton = page.getByRole('button', { name: 'Register' })
    await submitButton.click()
    const alertMessage = page.locator('div#message')
    await expect(alertMessage).toHaveText('The password should contain between [6,20] characters!')
  })

  /**
   * Bugs:
   *    1. Successful registration even with only phone number and password
   * Bug Counter: 4
   */
  test('Submit form with only phone number and password', async ({ page }) => {
    // Enter Phone Number
    const phoneNumber = page.getByRole('textbox', { name: 'Enter phone number' })
    await phoneNumber.fill(userDetails.phoneNumber)
    await expect.soft(phoneNumber).toHaveValue(userDetails.phoneNumber)

    // Enter Password
    const password = page.getByRole('textbox', { name: 'Password' })
    await password.fill(userDetails.password)

    // Form Submission
    const submitButton = page.getByRole('button', { name: 'Register' })
    await submitButton.click()

    const alertMessage = page.locator('div#message')
    await expect.soft(alertMessage).not.toHaveText('Successfully registered the following information')
    await expect.soft(page.locator('div#resultFn')).not.toBeVisible()
  })

  /**
   * Bugs:
   *    1. Country value for Ph is misspelled
   *    2. Password value is not masked
   *    3. T&C checkbox is disabled
   *    4. First name field accepts non-alphabetical characters
   *    5. Phone number field accepts non-numeric characters
   *    6. Email field accepts invalid email format
   *    7. Upon registration, output for lastname is missing the last letter
   *    8. Upon registration, the last value of the phone number is incorrect
   * Bug Counter: 12
   */
  test('Form submission', async ({ page }) => {
    // Validate First Name
    const firstName = page.getByRole('textbox', { name: 'First Name' })
    await firstName.fill(`abc123!@#`)
    await expect.soft(firstName).not.toHaveValue(`abc123!@#`)
    await firstName.clear()
    await firstName.fill(userDetails.firstName)
    await expect.soft(firstName).toHaveValue(userDetails.firstName)

    // Validate Last Name
    const lastName = page.getByRole('textbox', { name: 'Last Name* Phone nunber*' })
    await lastName.fill(userDetails.lastName)
    await expect.soft(lastName).toHaveValue(userDetails.lastName)

    // Validate Phone Number
    const phoneNumber = page.getByRole('textbox', { name: 'Enter phone number' })
    await phoneNumber.fill(`abc123!@#`)
    await expect.soft(phoneNumber).not.toHaveValue(`abc123!@#`)
    await phoneNumber.clear()
    await phoneNumber.fill(userDetails.phoneNumber)
    await expect.soft(phoneNumber).toHaveValue(userDetails.phoneNumber)

    // Validate Country
    const country = page.locator('#countries_dropdown_menu')
    await country.selectOption({ label: userDetails.country })
    await expect.soft(country).toHaveValue(userDetails.country)

    // Validate Email Address
    const email = page.getByRole('textbox', { name: 'Enter email' })
    await email.fill(userDetails.email)
    await expect.soft(email).toHaveValue(userDetails.email)

    // Validate Password
    const password = page.getByRole('textbox', { name: 'Password' })
    const maskedPassword = userDetails.password.replaceAll(/./g, '*')
    await password.fill(userDetails.password)
    await expect.soft(password).toHaveValue(maskedPassword)

    // Click T&C
    const termsAndConditions = page.locator('input[type="checkbox"]')
    await expect.soft(termsAndConditions).toBeEnabled()

    // Submit form
    const submitButton = page.getByRole('button', { name: 'Register' })
    await submitButton.click()

    const alertMessage = page.locator('div#message')
    await expect.soft(alertMessage).toHaveText('Successfully registered the following information')
    await expect.soft(page.locator('div#resultFn')).toContainText(userDetails.firstName)
    await expect.soft(page.locator('div#resultLn')).toContainText(userDetails.lastName)
    await expect.soft(page.locator('div#resultPhone')).toContainText(userDetails.phoneNumber)
    await expect.soft(page.locator('div#country')).toContainText(userDetails.country)
    await expect.soft(page.locator('div#resultEmail')).toContainText(userDetails.email)
  })
})
