'use strict'

const utils = require('./utils');
const transfertDurnal = require('./transfert_durnal');

const renvoyerTabParametres = (...params) => {
    return params
}

/*
  transformerPatient :
    Transformation de l'objet Firebird/Patient en Durnal/Patient avec génération de matricule & date de naissance valide
*/
function transformerPatient(parametres, o, clientTemplate) {

    const tmpl = transfertDurnal.transformer(parametres, o, clientTemplate);

    // Vérification longueur du matricule + clés
    if (tmpl.matricule) {
        const mat = tmpl.matricule.substr(0, 11);
        const a = tmpl.matricule.substr(0, 4);
        const m = tmpl.matricule.substr(4, 2);
        const j = tmpl.matricule.substr(6, 2);

        if ((tmpl.matricule.length != 13) ||
            isNaN(tmpl.matricule) ||
            (1 > a) || (1 > m) || (m > 12) || (1 > j) || (j > 31) ||
            (tmpl.matricule.substr(11, 1) != utils.genererCleLuhn10(mat)) ||
            (tmpl.matricule.substr(12, 1) != utils.genererCleVerhoeff(mat))) {
            tmpl.matricule = "";
        }
    }
    return tmpl;
}

/*
  transformerFournisseur :
    On ne prend que le matricule/idDurnal
*/
const transformerFournisseur = (o) => {
    return renvoyerTabParametres(o.supplierId, o.cefipId, o.name);
}

/*
  transformerPraticien :
    On ne prend que le matricule/idDurnal
*/
const transformerPraticien = (o) => {
    return o.identifiers.map( m => renvoyerTabParametres(o.id, m.value) )[0];
}

module.exports = {
    transformerPraticien,
    transformerPatient,
    transformerFournisseur }
