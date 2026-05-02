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

export {
  ErrorSeverity,
  ErrorType,
  type SourceError,
  SourceErrorWithNode,
  RuntimeSourceError,
  GeneralRuntimeError,
  InternalRuntimeError,
} from 'js-slang/dist/errors/base';
