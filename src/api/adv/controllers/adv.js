"use strict";

/**
 * A set of functions called "actions" for `adv`
 */

module.exports = {
  ottieniAdvDaSlugPosizione: async (ctx, next) => {
    const { slug } = ctx.params;
    const inserzione = await strapi.service("api::adv.adv").ottieniAdvDaSlugPosizione(slug);
    if (!inserzione) return ctx.badRequest('Non ci sono inserzioni disponibili');
    strapi.service("api::traccia.traccia").aggiungiTraccia(ctx, {
      inserzione,
      visualizzazione: true
    });
    ctx.send(inserzione);
    await next();
  },


  reindirizzamentoLinkInserzione: async (ctx, next) => {
    const { id } = ctx.params;
    const link = await strapi.service("api::adv.adv").ottieniLinkDaIdInserzione(id);
    if (!link) {
      return ctx.send(`
      <html>
      <head>
        <meta http-equiv="refresh" content="0; URL='http://ecodellojonio.it'" />
      </head>
      <body>
        Reindirizzamento in corso
      </body>
    </html>
      `);
    }


    strapi.service("api::traccia.traccia").aggiungiTraccia(ctx, {
      inserzione: id,
      click: true
    });

    ctx.send(`
    <html>
      <head>
        <meta http-equiv="refresh" content="0; URL='${link}'" />
      </head>
      <body>
        Reindirizzamento in corso
      </body>
    </html>
    `);
    await next();
  }
};
