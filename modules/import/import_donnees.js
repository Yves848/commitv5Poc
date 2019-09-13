'use strict'

const colors = require('colors');

const baseLocale = require('../../base_locale');
const srvSocket = require('minimist')(process.argv.slice(2))["server"] ? require('../../srv/server') : undefined;

const importerDonnees = async (donnees, pha, sqlInsert, logger) => {

    let donneesLues = 0;
    let donneesEnErreur = 0;

    let tr = await baseLocale.preparerPS(pha);
    for(const d of donnees)  {
        if (donneesLues % 2500 === 0 && tr) {
            await tr.commitAsync();
            process.stdout.write(`${colors.red(donneesEnErreur)}/${colors.green(donneesLues - donneesEnErreur)}/${donneesLues}...`);
            tr = await baseLocale.preparerPS(pha);

            if (srvSocket) {
                srvSocket.wss.broadcast(`${donneesEnErreur}/${donneesLues - donneesEnErreur}/${donneesLues}...`);
            }
        }

        donneesLues++;
        try {
            await baseLocale.executerPS(tr, sqlInsert, d);
        } catch (e) {
            donneesEnErreur++;
            logger.error(e.message, d);
        }
    }

    await tr.commitAsync();
    console.log(`${colors.red(donneesEnErreur)}/${colors.green(donneesLues - donneesEnErreur)}/${donneesLues}...\n${colors.red(donneesEnErreur + ' erreurs')}`);

    if (srvSocket) {
        srvSocket.wss.broadcast(`${donneesEnErreur}/${donneesLues - donneesEnErreur}/${donneesLues}...`);
    }
}

module.exports = {
    importerDonnees
};
