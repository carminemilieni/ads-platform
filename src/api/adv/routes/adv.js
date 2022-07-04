module.exports = {
  routes: [
    {
      method: "GET",
      path: "/adv/click/:id",
      handler: "adv.reindirizzamentoLinkInserzione",
      config: {
        middlewares: ['api::adv.cookie']
      }
    },
    {
      method: "GET",
      path: "/adv/:slug",
      handler: "adv.ottieniAdvDaSlugPosizione",
      config: {
        middlewares: ['api::adv.cookie']
      }
    }
  ],
};
