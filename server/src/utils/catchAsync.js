/**
 * catchAsync
 * -----------
 * Utility to handle errors in async Express route handlers.
 * Wraps an async function and automatically forwards any
 * rejected promise or thrown error to Express `next()`,
 * so it can be handled by the global error middleware.
 *
 * This avoids writing try/catch blocks in every controller.
 */

const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((err) => next(err));
};

export default catchAsync;