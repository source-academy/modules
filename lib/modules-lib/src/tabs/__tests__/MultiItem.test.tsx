import { userEvent } from "@vitest/browser/context";
import { afterEach, beforeEach, expect, test as baseTest, vi } from "vitest";
import { cleanup, render } from "vitest-browser-react";
import MultiItemDisplay from "../MultiItemDisplay";

const items = [
  <p>Item One</p>,
  <p>Item Two</p>,
  <p>Item Three</p>,
  <p>Item Four</p>,
];

const stepChangeHandler = vi.fn();

beforeEach(() => {
  stepChangeHandler.mockClear();
});

afterEach(() => {
  cleanup();
});

// Reference for keyboard events: https://testing-library.com/docs/user-event/keyboard/

const test = baseTest.extend<{
  component: ReturnType<typeof render>
}>({
  component: ({}, usefixture) => usefixture(render(<MultiItemDisplay elements={items} onStepChange={stepChangeHandler} />)),
});

test('Changing the currently selected value using the keyboard', async ({ component }) => {
  // Check that the first item is being displayed
  await expect.element(component.getByText('Item One')).toBeVisible();

  await userEvent.keyboard('[Tab]2[Enter]');

  // Check that the first item is no longer being displayed
  await expect.element(component.getByText('Item One')).not.toBeInTheDocument();

  // Check that the second item is being displayed
  await expect.element(component.getByText('Item Two')).toBeVisible();

  // and that the step change handler was called
  expect(stepChangeHandler).toHaveBeenCalledTimes(1);
});

test('Changing the currently selected value via the buttons', async ({ component }) => {
  // Check that the first item is being displayed
  await expect.element(component.getByText('Item One')).toBeVisible();

  // Click the "Next" button
  const nextButton = component.getByText('Next');
  await userEvent.click(nextButton);

  // Check that the second item is being displayed and not the first
  await expect.element(component.getByText('Item One')).not.toBeInTheDocument();
  await expect.element(component.getByText('Item Two')).toBeVisible();

  // Click the "Previous" button
  const prevButton = component.getByText('Previous');
  await userEvent.click(prevButton);

  // Check that the first item is being displayed and not the second
  await expect.element(component.getByText('Item One')).toBeVisible();
  await expect.element(component.getByText('Item Two')).not.toBeInTheDocument();

  expect(stepChangeHandler).toHaveBeenCalledTimes(2);
});

test('The item selector won\'t accept the too many digits', async ({ component }) => {
  // Check that the first item was rendered
  await expect.element(component.getByText('Item One')).toBeVisible();

  // Try to enter an invalid value
  await userEvent.keyboard('[Tab]1234[Enter]');

  // Check that the first item is still rendered
  await expect.element(component.getByText('Item One')).toBeVisible();

  // and that the display didn't change
  expect(stepChangeHandler).not.toHaveBeenCalled();
});

test('The item selector will reset when all digits are removed', async ({ component }) => {
  // Check that the first item was rendered
  await expect.element(component.getByText('Item One')).toBeVisible();

  // Clear the selector
  await userEvent.keyboard('[Tab][Backspace][Enter]');

  // Check that the first item is still rendered
  await expect.element(component.getByText('Item One')).toBeVisible();

  // and that the display didn't change
  expect(stepChangeHandler).not.toHaveBeenCalled();
});

test('The item selector moves to the end when set out of range', async ({ component }) => {
  // Check that the first item is rendered
  await expect.element(component.getByText('Item One')).toBeVisible();

  await userEvent.keyboard('[Tab]5[Enter]');

  // Check that the first item is no longer rendered
  await expect.element(component.getByText('Item One')).not.toBeInTheDocument();

  // Check that the fourth item is now rendered
  await expect.element(component.getByText('Item Four')).toBeVisible();

  // and check that the step change only happened once
  expect(stepChangeHandler).toHaveBeenCalledTimes(1);
  expect(stepChangeHandler).toHaveBeenCalledWith(3, 0);
});

test('Both selector buttons are disabled when there is only one item', async () => {
  const component = render(<MultiItemDisplay elements={[<p>Item One</p>]}/>);
  const buttonLocator = component.getByRole('button');

  await expect.element(buttonLocator.first()).toBeDisabled();
  await expect.element(buttonLocator.nth(1)).toBeDisabled();
});
