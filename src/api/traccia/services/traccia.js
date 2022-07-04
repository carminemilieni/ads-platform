// @ts-nocheck
'use strict';

/**
 * traccia service.
 */

/**
 * @param {number} inserzioneId 
 */
const aggiungiTraccia = function (ctx, { inserzione, visualizzazione = false, click = false, }) {
    strapi.db.query('api::traccia.traccia').create({
        data: {
            visitatore: ctx.cookies.get('visitatore'),
            inserzione: inserzione.id,
            visualizzazione,
            click
        }
    }).then().catch(e => strapi.log.error(e));
}


module.exports = {
    aggiungiTraccia
};
