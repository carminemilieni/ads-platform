const moment = require("moment");
const { ApplicationError } = require("@strapi/utils").errors;

module.exports = {
  beforeCreate(event) {
    event = strapi
      .service("api::inserzione.inserzione")
      .routineCreazioneModifica(event);
  },

  beforeUpdate(event) {
    event = strapi
      .service("api::inserzione.inserzione")
      .routineCreazioneModifica(event);
  },
};
