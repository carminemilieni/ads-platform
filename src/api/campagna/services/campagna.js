"use strict";

/**
 * campagna service.
 */

const { createCoreService } = require("@strapi/strapi").factories;
const moment = require("moment");
const { ApplicationError } = require("@strapi/utils").errors;

// @ts-ignore
module.exports = createCoreService("api::campagna.campagna", ({}) => ({
  controlloCoerenzaDate(event) {
    const { inizio, fine } = event.params.data;
    if (moment(inizio).isAfter(moment(fine))) {
      throw new ApplicationError(
        "La data di fine campagna non può essere antecedente alla data di inizio"
      );
    }
  },

  controlloEsistenzaRelazioneConCliente(event) {
    const { cliente } = event.params.data;

    if (!cliente) {
      throw new ApplicationError("É necessario assegnare un cliente");
    }
  },

  impostoCampagnaInattivaSeScaduta(event) {
    const { fine } = event.params.data;
    if (moment().isAfter(moment(fine))) {
      event.params.data.attiva = false;
    }

    return event;
  },
}));
