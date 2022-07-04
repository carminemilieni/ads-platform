'use strict';

/**
 * `cookie` middleware.
 */

const uuid = require('uuid');

module.exports = (config, { strapi }) => {
  // Add your own logic here.
  return async (ctx, next) => {
    if (!ctx.cookies.get('visitatore'))
      ctx.cookies.set('visitatore', uuid.v4());
    await next();
  };
};
