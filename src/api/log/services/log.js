// @ts-nocheck
'use strict';

/**
 * log service.
 */

/**
 * @param {string} nome 
 * @returns {number|undefined}
 */
const inizio = async function (nome) {
    return await salvaNelDb({ nome, stato: 'in corso' });
}

const fine = async function (id, risposta = '') {
    return await salvaNelDb({ id, stato: 'successo', risposta });
}

const fineConErrore = async function (id, risposta = '') {
    return await salvaNelDb({ id, stato: 'errore', risposta });
}

const log = async function (nome, risposta = '') {
    return await salvaNelDb({ nome, stato: 'successo', risposta });
}

const logConErrore = async function (nome, risposta = '') {
    return await salvaNelDb({ nome, stato: 'errore', risposta });
}

/**
 * 
 * @param {object} param0 
 * @returns {int|undefined}
 */
const salvaNelDb = async function ({
    nome = null,
    id = null,
    stato,
    risposta = '',
}) {
    if (!strapi.db) return undefined;

    let r;
    if (id) {
        r = await strapi.db.query('api::log.log').update({
            where: { id },
            data: {
                stato,
                risposta
            },
        });
    } else if (nome) {
        r = await strapi.db.query('api::log.log').create({
            data: {
                nome,
                stato,
                risposta
            }
        })
    }

    return r.id;
}


module.exports = {
    inizio,
    fine,
    fineConErrore,
    log,
    logConErrore
}
