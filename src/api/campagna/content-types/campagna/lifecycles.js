const moment = require("moment");
const { ApplicationError } = require("@strapi/utils").errors;

module.exports = {
  beforeCreate(event) {
    strapi
      .service("api::campagna.campagna")
      .controlloEsistenzaRelazioneConCliente(event);

    strapi.service("api::campagna.campagna").controlloCoerenzaDate(event);

    event = strapi
      .service("api::campagna.campagna")
      .impostoCampagnaInattivaSeScaduta(event);
  },

  beforeUpdate(event) {
    strapi.service("api::campagna.campagna").controlloCoerenzaDate(event);
    strapi
      .service("api::campagna.campagna")
      .controlloEsistenzaRelazioneConCliente(event);

    event = strapi
      .service("api::campagna.campagna")
      .impostoCampagnaInattivaSeScaduta(event);
  },
};
