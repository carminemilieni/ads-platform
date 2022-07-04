const path = require('path');

module.exports = ({ env }) => {
  if (env("DATABASE_CONNECTION_NAME") === "sqlite") {
    return {
      connection: {
        client: "sqlite",
        connection: {
          filename: path.join(
            __dirname,
            "..",
            env("DATABASE_FILENAME", ".tmp/data.db")
          ),
        },
        useNullAsDefault: true,
      },
    };
  } else {
    return {
      connection: {
        client: "mysql",
        connection: {
          host: env("DATABASE_HOST"),
          port: env.int("DATABASE_PORT"),
          database: env("DATABASE_NAME"),
          user: env("DATABASE_USERNAME"),
          password: env("DATABASE_PASSWORD"),
          ssl: env.bool("DATABASE_SSL", false),
        },
      },
    };
  }
};
