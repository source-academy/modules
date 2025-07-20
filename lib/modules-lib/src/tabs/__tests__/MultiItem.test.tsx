/* eslint-disable no-empty-pattern */
import { cleanup, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, expect, test as baseTest, vi } from "vitest";
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
const user = userEvent.setup();

const test = baseTest.extend<{
  component: ReturnType<typeof render>
}>({
  component: ({}, usefixture) => usefixture(render(<MultiItemDisplay elements={items} onStepChange={stepChangeHandler} />)),
});

test('Changing the currently selected value using the keyboard', async ({ component }) => {
  // Check that the first item is being displayed
  expect(component.queryByText('Item One')).not.toBeNull();

  await user.tab();
  await user.keyboard('2[Enter]');

  // Check that the first item is no longer being displayed
  expect(component.queryByText('Item One')).toBeNull();

  // Check that the second item is being displayed
  expect(component.queryByText('Item Two')).not.toBeNull();

  // and that the step change handler was called
  expect(stepChangeHandler).toHaveBeenCalledTimes(1);
});

test('Changing the currently selected value via the buttons', async ({ component }) => {
  // Check that the first item is being displayed
  expect(component.queryByText('Item One')).not.toBeNull();

  // Click the "Next" button
  const nextButton = component.getByText('Next');
  await user.click(nextButton);

  // Check that the second item is being displayed and not the first
  expect(component.queryByText('Item One')).toBeNull();
  expect(component.queryByText('Item Two')).not.toBeNull();

  // Click the "Previous" button
  const prevButton = component.getByText('Previous');
  await user.click(prevButton);

  // Check that the first item is being displayed and not the second
  expect(component.queryByText('Item Two')).toBeNull();
  expect(component.queryByText('Item One')).not.toBeNull();

  expect(stepChangeHandler).toHaveBeenCalledTimes(2);
});

test('The item selector won\'t accept the too many digits', async ({ component }) => {
  // Check that the first item was rendered
  expect(component.queryByText('Item One')).not.toBeNull();

  // Try to enter an invalid value
  await userEvent.tab();
  await userEvent.keyboard('1234[Enter]');

  // Check that the first item is still rendered
  expect(component.queryByText('Item One')).not.toBeNull();

  // and that the display didn't change
  expect(stepChangeHandler).not.toHaveBeenCalled();
});

test('The item selector will reset when all digits are removed', async ({ component }) => {
  // Check that the first item was rendered
  expect(component.queryByText('Item One')).not.toBeNull();

  // Clear the selector
  await userEvent.tab();
  await userEvent.keyboard('[Backspace][Enter]');

  // Check that the first item is still rendered
  expect(component.queryByText('Item One')).not.toBeNull();

  // and that the display didn't change
  expect(stepChangeHandler).not.toHaveBeenCalled();
});

test('The item selector moves to the end when set out of range', async ({ component }) => {
  // Check that the first item is rendered
  expect(component.queryByText('Item One')).not.toBeNull();

  await userEvent.tab();
  await userEvent.keyboard('5[Enter]');

  // Check that the first item is no longer rendered
  expect(component.queryByText('Item One')).toBeNull();

  // Check that the fourth item is now rendered
  expect(component.queryByText('Item Four')).not.toBeNull();

  // and check that the step change only happened once
  expect(stepChangeHandler).toHaveBeenCalledTimes(1);
  expect(stepChangeHandler).toHaveBeenCalledWith(3, 0);
});
