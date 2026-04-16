/**
 * This module defines custom error classes for handling errors that occur in Source bundles. These types
 * are re-exported from `js-slang`
 * @module Errors
 * @title Errors
 */

export {
  InvalidCallbackError,
  InvalidNumberParameterError,
  type InvalidNumberParameterErrorOptions,
  InvalidParameterTypeError,
} from 'js-slang/dist/errors/rttcErrors';

export * from 'js-slang/dist/errors/base';
