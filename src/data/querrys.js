const dbClient = require("../config/postgres");

const search = async (query) => {
    return dbClient
        .query(
            `
            select * from message
            where to_tsvector(message.title) @@ to_tsquery('${query}')
            limit 6
          `
        )
        .then((res) => {
            console.log(`(search) ${query}`);
            return res.rows;
        })
        .catch((e) => {
            console.log(`(search) error ${query}`);
            return false;
        });
};


module.exports = { search }