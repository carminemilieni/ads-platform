// @ts-nocheck
'use strict';

/**
 * adv service.
 */

const moment = require("moment");
const oggi = moment().toDate();


const whereInserzioniPredefinita = {
    attiva: true,
    inizio: { $lte: moment().toDate() },
    fine: { $gte: moment().toDate() },
    campagna: {
        attiva: true,
        inizio: { $lte: moment().toDate() },
        fine: { $gte: moment().toDate() },

    }
};

/**
 * 
 * @param {string} slug 
 * @returns {object[]|undefined}
 */
const ottieniAdvDaSlugPosizione = async function (slug) {


    if (!strapi.db) return undefined;

    const inserzioni = await strapi.db.query('api::inserzione.inserzione').findMany({
        where: {
            posizioneAdv: {
                slug
            },
            ...whereInserzioniPredefinita
        },
        populate: ['campagna', 'posizioneAdv', 'creativity', 'creativityMobile']
    });

    if (!inserzioni.length) return undefined;

    const inserzione = ottieniSingolaInserzioneDaCollezione(inserzioni);
    return {
        id: inserzione.id,
        link: process.env.linkBaseUrl + '/' + inserzione.id,
        creativity: {
            url: process.env.fileBaseUrl + inserzione.creativity.url,
            width: inserzione.posizioneAdv.larghezza,
            height: inserzione.posizioneAdv.altezza,
        },
        creativityMobile: {
            url: process.env.fileBaseUrl + inserzione.creativityMobile.url,
            width: inserzione.posizioneAdv.larghezzaMobile,
            height: inserzione.posizioneAdv.altezzaMobile,
        }
    };
}

/**
 * Ritorna randomicamente una sola inserzione 
 * fornendo una priorità più alta al budget campagna più alto
 * @param {object[]} inserzioni 
 * @returns {object}
 */
const ottieniSingolaInserzioneDaCollezione = function (inserzioni) {



    let inserzioneSelezionata;
    let valoreCorrente = 0;

    inserzioni
        .filter(inserzione => inserzione.campagna)
        .forEach((inserzione) => {
            const valore = Math.floor(Math.random() * inserzione.campagna.valore) + 1;
            if (valore > valoreCorrente) {
                inserzioneSelezionata = inserzione;
                valoreCorrente = valore;
            }
        });

    return inserzioneSelezionata;
}

/**
 * 
 * @param {int|string} id 
 * @returns {string|undefined}
 */
const ottieniLinkDaIdInserzione = async function (id) {
    try {
        const { link } = await strapi.db
            .query('api::inserzione.inserzione')
            .findOne({
                where: {
                    id,
                    ...whereInserzioniPredefinita
                },
                populate: ['campagna']
            });
        return link
    } catch (e) {
        strapi.log.error(e);
        return undefined;
    }
}

module.exports = {
    ottieniAdvDaSlugPosizione,
    ottieniLinkDaIdInserzione
};


