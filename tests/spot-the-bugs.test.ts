import { test, expect } from '@playwright/test'
import { userDetails, invalidInputs } from '../automation/data/form-registration.json'
import { FormRegistrationPage } from '../automation/pages/form-registration.page'

test.describe('Form Registration Page', () => {
  let formRegistrationPage: FormRegistrationPage

  test.beforeEach('navigate to bugs-form page', async ({ page }) => {
    formRegistrationPage = new FormRegistrationPage(page)
    await formRegistrationPage.navigate()
  })

  /**
   * Bugs:
   * Suggestion: Add red highlitght to the required fields
   *            if required fields has no input
   * Bug Counter: 0
   */
  test('Submit form without any input', async () => {
    await test.step('Submit form', async () => {
      await formRegistrationPage.clickRegister()
    })
    await test.step('Validate alert message', async () => {
      await formRegistrationPage.assertAlertMessage('The password should contain between [6,20] characters!')
    })
  })

  /**
   * Bugs:
   *    1. Successful registration even with only phone number and password
   * Bug Counter: 1
   */
  test('Submit form with only phone number and password', async () => {
    await test.step('Enter phone number', async () => {
      await formRegistrationPage.enterPhoneNumber(userDetails.phoneNumber)
    })

    await test.step('Enter password', async () => {
      await formRegistrationPage.enterPassword(userDetails.password)
    })

    await test.step('Submit form', async () => {
      await formRegistrationPage.clickRegister()
    })

    await test.step('Validate alert message', async () => {
      await formRegistrationPage.assertAlertMessage('Successfully registered the following information')
    })
  })

  /**
   * Bugs:
   *    1. First name is not required
   *    2. Phone number is misspelled
   *    3. Text format inconsistency for phone number and email address
   *    comparing to First Name and Last Name
   *    4. Country value for Ph is misspelled
   *    5. Password value is not masked
   *    6. T&C checkbox is disabled
   *    7. First name field accepts non-alphabetical characters
   *    8. Phone number field accepts non-numeric characters
   *    9. Email field accepts invalid email format
   *    10. Upon registration, output for lastname is missing the last letter
   *    11. Upon registration, the last value of the phone number is incorrect
   * Bug Counter: 12
   */
  test('Form submission', async () => {
    test.step('Enter and validate first name', async () => {
      const firstName = formRegistrationPage.selectors.textboxes.firstName
      await formRegistrationPage.enterFirstName(invalidInputs.random, false)
      await firstName.clear()
      await formRegistrationPage.enterFirstName(userDetails.firstName)
    })

    test.step('Enter and validate last name', async () => {
      await formRegistrationPage.enterLastName(userDetails.lastName)
    })

    test.step('Enter and validate phone number', async () => {
      const phoneNumberSelector = formRegistrationPage.selectors.textboxes.phoneNumber
      await formRegistrationPage.enterPhoneNumber(invalidInputs.random, false)
      await phoneNumberSelector.clear()
      await formRegistrationPage.enterPhoneNumber(userDetails.phoneNumber)
    })

    // test.step('Enter and validate country', async () => {
    //   await formRegistrationPage.selectCountry(userDetails.country)
    // })

    test.step('Enter and validate email address', async () => {
      await formRegistrationPage.enterEmail(userDetails.email)
    })

    test.step('Enter and validate password', async () => {
      await formRegistrationPage.enterPassword(userDetails.password)
    })

    test.step('Validate T&C', async () => {
      await formRegistrationPage.assertTermsAndConditions()
    })

    await test.step('Submit form', async () => {
      await formRegistrationPage.clickRegister()
    })

    // Validate output
    await test.step('Validate ouput', async () => {
      await formRegistrationPage.assertAlertMessage('Successfully registered the following information')
      await formRegistrationPage.assertFirstNameResult(userDetails.firstName)
      await formRegistrationPage.assertLastNameResult(userDetails.lastName)
      await formRegistrationPage.assertPhoneNumberResult(userDetails.phoneNumber)
      await formRegistrationPage.assertCountryResult(userDetails.country)
      await formRegistrationPage.assertEmailResult(userDetails.email)
    })
  })
})
