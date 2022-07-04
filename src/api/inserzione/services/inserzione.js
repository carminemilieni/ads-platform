"use strict";

/**
 * inserzione service.
 */

const { createCoreService } = require("@strapi/strapi").factories;
const moment = require("moment");
const { ApplicationError } = require("@strapi/utils").errors;

// @ts-ignore
module.exports = createCoreService("api::inserzione.inserzione", ({}) => ({
  controlloCoerenzaDate(event) {
    const { inizio, fine } = event.params.data;
    if (moment(inizio).isAfter(moment(fine))) {
      throw new ApplicationError(
        "La data di fine inserzione non può essere antecedente alla data di inizio"
      );
    }
  },

  controlloEsistenzaRelazioneConPosizioneAdv(event) {
    const { posizioneAdv } = event.params.data;
    if (!posizioneAdv) {
      throw new ApplicationError("É necessario assegnare una posizione ADV");
    }
  },

  controlloEsistenzaRelazioneConCampagna(event) {
    const { campagna } = event.params.data;
    if (!campagna) {
      throw new ApplicationError(
        "É necessario assegnare l' inserzione ad una campagna"
      );
    }
  },

  impostoInserzioneInattivaSeScaduta(event) {
    const { fine } = event.params.data;
    if (moment().isAfter(moment(fine))) {
      event.params.data.attiva = false;
    }
    return event;
  },

  routineCreazioneModifica(event) {
    this.controlloEsistenzaRelazioneConPosizioneAdv(event);
    this.controlloEsistenzaRelazioneConCampagna(event);
    this.controlloCoerenzaDate(event);
    event = this.impostoInserzioneInattivaSeScaduta(event);

    return event;
  },
}));
