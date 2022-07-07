// @ts-nocheck
"use strict";

const moment = require("moment");

const statsInserzioniBuild = async function () {
  const pid = await strapi
    .service("api::log.log")
    .inizio("statsInserzioniBuild");

  try {
    const tracce = await strapi.db?.query("api::traccia.traccia").findMany({
      select: ["visitatore", "visualizzazione", "click"],
      populate: ["inserzione"]
    });

    const inserzioni = [];

    tracce.forEach((traccia) => {
      let index = -1;
      try {
        index = inserzioni.findIndex(
          (inserzione) => inserzione.inserzione === traccia.inserzione.id
        );
      } catch (e) {
        return;
      }

      if (index > -1) {
        let esisteIlVisitatore = false;
        if (traccia.visitatore)
          esisteIlVisitatore = inserzioni[index].visitatori.find(
            (visitatore) => visitatore === traccia.visitatore
          );

        if (esisteIlVisitatore) {
          inserzioni[index].visualizzazioniTotali += traccia.visualizzazione;
          inserzioni[index].clicTotali += traccia.click;
        } else {
          inserzioni[index].visualizzazioniUniche += traccia.visualizzazione;
          inserzioni[index].visualizzazioniTotali += traccia.visualizzazione;
          inserzioni[index].clicUnici += traccia.click;
          inserzioni[index].clicTotali += traccia.click;
        }
      } else {
        inserzioni.push({
          inserzione: traccia.inserzione.id,
          visualizzazioniUniche: 0 + traccia.visualizzazione,
          visualizzazioniTotali: 0 + traccia.visualizzazione,
          clicUnici: 0 + traccia.click,
          clicTotali: 0 + traccia.click,
          visitatori: [traccia.visitatore],
        });
      }
    });

    inserzioni.forEach(async (inserzione) => {
      const inserzioneDalDb = await strapi.db
        .query("api::inserzione.inserzione")
        .findOne({
          where: { id: inserzione.inserzione },
          populate: ["posizioneAdv", "campagna"],
        });
      await strapi.db.query("api::inserzione.inserzione").update({
        where: { id: inserzione.inserzione },
        data: {
          visualizzazioniUniche:
            inserzione.visualizzazioniUniche +
            parseInt(inserzioneDalDb.visualizzazioniUniche),
          visualizzazioniTotali:
            inserzione.visualizzazioniTotali +
            parseInt(inserzioneDalDb.visualizzazioniTotali),
          clicUnici: inserzione.clicUnici + parseInt(inserzioneDalDb.clicUnici),
          clicTotali:
            inserzione.clicTotali + parseInt(inserzioneDalDb.clicTotali),
          posizioneAdv: inserzioneDalDb.posizioneAdv,
          campagna: inserzioneDalDb.campagna,
        },
      });
    });

    await strapi.service("api::log.log").fine(pid, "");
  } catch (e) {
    await strapi.service("api::log.log").fineConErrore(pid, e.toString());
    return;
  }
};

const statsCampagneBuild = async function () {
  const pid = await strapi.service("api::log.log").inizio("statCampagneBuild");

  //@todo #1 funzione non performante

  try {
    const inserzioni = await strapi.db
      ?.query("api::inserzione.inserzione")
      .findMany({
        select: [
          "visualizzazioniUniche",
          "visualizzazioniTotali",
          "clicUnici",
          "clicTotali",
        ],
        populate: ["campagna"],
      });

    const campagne = [];

    inserzioni.forEach((inserzione) => {
      
      const index = campagne.findIndex(
          (campagna) => inserzione.campagna.id === campagna.id
      );
      
      if (index > -1) {
        campagne[index].visualizzazioniUniche += parseInt(
          inserzione.visualizzazioniUniche
        );
        campagne[index].visualizzazioniTotali += parseInt(
          inserzione.visualizzazioniTotali
        );
        campagne[index].clicUnici += parseInt(inserzione.clicUnici);
        campagne[index].clicTotali += parseInt(inserzione.clicTotali);
      } else {
        campagne.push({
          id: inserzione.campagna.id,
          visualizzazioniUniche: parseInt(inserzione.visualizzazioniUniche),
          visualizzazioniTotali: parseInt(inserzione.visualizzazioniTotali),
          clicUnici: parseInt(inserzione.clicUnici),
          clicTotali: parseInt(inserzione.clicTotali),
        });
      }
    });

    campagne.forEach(async (campagna) => {
      const campagnaDalDb = await strapi.db
        .query("api::campagna.campagna")
        .findOne({
          where: { id: campagna.id },
          populate: ["cliente"],
        });

      await strapi.db.query("api::campagna.campagna").update({
        where: { id: campagna.id },
        data: {
          visualizzazioniUniche: campagna.visualizzazioniUniche,
          visualizzazioniTotali: campagna.visualizzazioniTotali,
          clicUnici: campagna.clicUnici,
          clicTotali: campagna.clicTotali,
          cliente: campagnaDalDb.cliente.id,
        },
      });
    });

    await strapi.service("api::log.log").fine(pid, "statCampagneBuild");
  } catch (e) {
    await strapi.service("api::log.log").fineConErrore(pid, e.toString());
    return;
  }
};

/**
 * Elimino le tracce piú vecchie di due giorni
 * @returns {Promise<void>}
 */
const puliziaTracceObsolete = async function () {
  const pid = await strapi
    .service("api::log.log")
    .inizio("puliziaTracceObsolete");

  try {
    const todayMenoUnGiorno = moment().subtract(1, "days");

    const result = await strapi.db?.query("api::traccia.traccia").deleteMany();

    await strapi
      .service("api::log.log")
      .fine(pid, `Eliminate ${result.count} tracce`);
  } catch (e) {
    await strapi.service("api::log.log").fineConErrore(pid, e.toString());
    return;
  }
};

module.exports = {
  "10 */1 * * *": async () => {
    statsInserzioniBuild();
  },

  "30 */1 * * *": async () => {
    statsCampagneBuild();
  },

  "20 */1 * * *": async () => {
    puliziaTracceObsolete();
  },
};
