'use strict'

// import modules
const fs = require('fs');
const path = require('path');
const async = require('async');
const axios = require('axios');
const colors = require('colors');
const optionsPha = require('../../../options_pha');
const baseLocale = require('../../../base_locale');
const log = require('../../../logger');
const utils = require('./utils');
const parseArgs = require('minimist');
const moment = require('moment');

const args = parseArgs(process.argv.slice(2));

const EMethodeDurnal = new Enum( [ 'GET', 'DELETE', 'POST', 'PUT' ] );

let jsonFile;
let queue;
let tabDonnees = [];
let reponsesServeur = [];

let nombreDonneesEnvoyees = 0;
let nombreErreurs = 0;

Date.prototype.toJSON = function(){ return moment(this).format(moment.HTML5_FMT.DATETIME_LOCAL_MS); }

const creerErreur = (err, idDonnee) => {
    const e = { idOrigine : idDonnee, idDurnal : null }
    if (e.hasOwnProperty("response")) {
        e["codeErreur"] = err.response.status;
        e["messageErreur"] = err.response.statusText;
    } else {
        e["codeErreur"] = -1;
        e["messageErreur"] = err.message;
    }
    return e;
}

const gererErreur = (err, d) => {

    if (Array.isArray(d)) {
        // En cas de perte de connexion generer un bloc d erreur  pour le paquet
        let tabErreur = [];
        d.map(lig => {
            tabErreur.push(creerErreur(err, lig[Object.keys(lig)[0]]));
        });
        reponsesServeur = reponsesServeur.concat(tabErreur);
        nombreErreurs += tabErreur.length;
    } else {
        reponsesServeur.push(creerErreur(err, d[Object.keys(d)[0]]));
        nombreErreurs++;
    }
}

// TODO A optimiser en fonction récursive
const remplacerParametres = (d, valeursParametres) => {

    const regParametres = /{[^{]*}/;
    if (typeof d == "string") {
        // URL
        const parametres = d.match(regParametres);
        if (parametres) {
            let val;
            for (let p of parametres ) {
                const np = p.substring(1, p.length - 1);
                if (valeursParametres.hasOwnProperty(np)) {
                    val = valeursParametres[np];
                } else {
                    val = "";
                }

                d = d.replace(p, val);
            }
        }
    } else if (typeof d == "object") {
        // Tableau de données par exemple
        for (let prop of Object.keys(d)) {
            if (d[prop]) {
                if (typeof d[prop] == "string") {
                    const parametre = d[prop].match(regParametres);
                    if (parametre) {
                        const np = parametre[0].substring(1, parametre[0].length - 1);
                        if (valeursParametres.hasOwnProperty(np)) {
                            d[prop] = valeursParametres[np];
                        } else {
                            d[prop] = "";
                        }
                    }
                } else if (typeof d[prop] == "object") {
                    d[prop] = remplacerParametres(d[prop], valeursParametres);
                }
            }
        }
    }
    return d;
}

const appelerWS = async(parametres, url, methode, parametresURL, d) => {

    if (url && methode) {
        // Log des données envoyées
        if(Array.isArray(d)) {
            for (let _d of d) {
                jsonFile.write(`${fs.fstatSync(jsonFile.fd).size == 0 ? "[" : ","}${JSON.stringify(_d)}\n`);
            }
        } else {
            jsonFile.write(`,${JSON.stringify(d)},\n`);
        }

        // Ajout des parametres de requetes
        url = remplacerParametres(url, d);
        if (parametresURL) {
            for (let p of parametresURL) {
                const cle = Object.keys(p)[0];
                url += "?" + cle + "=" + p[cle];
            }
            url = remplacerParametres(url, parametres)
        }

        // On envoie la purée
        const headers = {
                'content-type': 'application/json'
            };
        let res;

        if ([EMethodeDurnal.POST.key, EMethodeDurnal.PUT.key].includes(methode)) {
            //res = await axios[methode.toLowerCase(methode)](url, JSON.stringify(d), { headers });
        } else if ([EMethodeDurnal.GET.key].includes(methode)) {
            res = await axios.get(url, { headers });
        }

        // TODO Améliorer la gestion des retours
        // TODO Standardiser les réponses retours ainsi que les codes d'erreurs
        if (res.status === 200 || res.status === 201) {
            if (methode === EMethodeDurnal.GET.key) {
                reponsesServeur = res.data;
            } else {
                if (Array.isArray(d) && Array.isArray(res.data)) {
                    if (res.data.length > 0) {
                        reponsesServeur = reponsesServeur.concat(
                            res.data.map(reponse => {
                                return {
                                    idOrigine : reponse.idOrigine,
                                    idDurnal : reponse.idDurnal,
                                    codeErreur : reponse.codeErreur,
                                    messageErreur : reponse.messageErreur
                                }
                            })
                        );
                    }
                } else {
                    reponsesServeur = reponsesServeur.concat(
                        {
                            idOrigine : d[Object.keys(d)[0]],
                            idDurnal : res.data,
                            codeErreur : "",
                            messageErreur : ""
                        })
                }
            }
        } else {
            const err = new Error(`Erreur d'appel ${url}`);
            err.response = {
                status : res.status,
                statusText : res.statusText
            };
            throw err;
        }
    } else {
        // TODO Déclenchement d'une exception ?
        console.log(new Date().toISOString(), "URL et/ou méthode non-spécifié !");
    }
}

/*
  envoyerDonnees :
    Requête POST vers Durnal avec gestion de coupure réseau
*/
const envoyerDonnees = async(p) => {

    if (p.donnees !== null) {
        tabDonnees.push(p.donnees);
    }

    if (tabDonnees.length >= p.taillePaquet || !p.donnees) {
        // On relâche le tableau <tabDonnees> pour la suite
        const pqDonnees = tabDonnees;
        tabDonnees = [];

        if (pqDonnees.length > 0) {
            try {
                nombreDonneesEnvoyees += pqDonnees.length;

                process.stdout.write(`${colors.blue(nombreDonneesEnvoyees)}/${colors.green(reponsesServeur.length)}/${colors.red(nombreErreurs)}...`);

                // L'URL contient t'elle des paramètres ??
                const regURL = /http[s]?:\/\/.*\/{.*}/g;
                const rootURL = p.url.match(regURL);
                if(rootURL || pqDonnees.length === 1) {
                    // => Transfert des données de facon unique
                    const regParametres = /{[^{]*}/;
                    const parametres = p.url.match(regParametres);

                    for (const d of pqDonnees) {
                        //let url = p.url;

                        try {
                            await appelerWS(p.parametres, p.url, p.methode, p.parametresURL, d);
                        } catch(e) {
                            gererErreur(e, d);
                        }
                    }
                } else {
                    // => Transfert des données par "paquet"
                    await appelerWS(p.parametres, p.url, p.methode, p.parametresURL, pqDonnees);
                }
            } catch (e) {
                // En cas de perte de connexion generer un bloc d erreur  pour le paquet
                gererErreur(e, pqDonnees);
            }
        }
    }
}

/*
  traiterFinQueue :
    Traitement de fin de Queue : envoi du dernier paquet de données
*/
const traiterFinQueue = (parametres, url, methode, parametresURL) => {
    return new Promise(async (resolve, reject) => {
        queue.drain = async () => {
            await envoyerDonnees({ parametres : parametres, url : url, methode : methode, parametresURL : parametresURL, taillePaquet : 0, donnees : null });
            resolve();
        };
    });
}

/*
  sauvegarderCorrespondances :
    Sauvegarde des réponses reçues de Durnal
*/
async function sauvegarderCorrespondances(pha, procedureCorrespondance, reponses) {

    const tr = await baseLocale.preparerPS(pha);
    try {
        for (const item of reponses ) {
            await baseLocale.executerPS(tr, procedureCorrespondance, item);
        }
    } catch(e) {
        console.log(new Date().toISOString(), `${colors.red(e.message)}`);
    } finally {
        await tr.commitAsync();
    }
}

/*
  transformer :
    Transformation de l'objet Firebird vers l'objet JSON qu'attend Durnal
*/
function transformer(parametres, o, template) {

    const tmpl = {...template};
    try {
    Object.keys(o).map(
        att => {
            const attCS = utils.convertirCamelCase(att);
            if (Array.isArray(tmpl[attCS]) || Buffer.isBuffer(o[att])) {
                if (o[att]) {
                    let val = o[att].toString();
                    val = val.replace(/\//g, "-").replace(/\r|\n/g, " ");
                    tmpl[attCS] = eval(`(${val})`);
                } else {
                    tmpl[attCS] = [];
                }
            } else {
                tmpl[attCS] = typeof(o[att]) == "string" ? o[att].trim().replace(/\//g, "-") : o[att];
            }
        }
    )
    } catch(e) {
        console.log(e.message);
    }
    return remplacerParametres(tmpl, parametres);
}

/*
  transferer :
    Boucle de traitement des données
*/
const transferer = async (item, options) => {

    if (item.traitements !== "" && fs.existsSync(`${path.resolve(__dirname)}/${item.traitements}`)) {
        let pha;
        try {
            pha = await baseLocale.connecter(optionsPha);

            // Suppression données correspondances
            if (!options.commit.unitaire && !options.commit.traitement && item.procedureSuppression) {
                process.stdout.write(`${new Date().toISOString()} *** Suppression des ${item.libelleGroupe} ...`);
                baseLocale.executerPS(pha, item.procedureSuppression);
                process.stdout.write(" OK ! ***\n");
            }

            // On transfère
            for (const t of require(`./${item.traitements}`)) {
                if (t.url && options.commit.projet.transfert.url &&
                    (!options.commit.traitement || options.commit.traitement == t.id)) {
                    console.log(new Date().toISOString(), `*** Transfert ${t.libelle} ***`);

                    nombreDonneesEnvoyees = 0; nombreErreurs = 0;

                    // Méthodes de transformation
                    let mod;
                    let meth;
                    if (t.methodeTransformation) {
                        [ mod, meth ] = t.methodeTransformation.split('.');
                        mod = require(`./${mod}`);
                    }

                    // Création logger/json
                    const logger = log.creerLog(`${options.commit.repertoire}\\${t.libelle}.log`);
                    jsonFile = fs.createWriteStream(`${options.commit.repertoire}\\${t.libelle}.json`);

                    // TODO Gestion http/https
                    let proto = options.commit.projet.transfert.url.match(/http[s]*:\/\//);
                    if (proto) {
                        let urlComplete = options.commit.projet.transfert.url.replace(proto[0], "");
                        urlComplete = `${urlComplete}/${t.url}`.replace(/\/+/g, "/");
                        urlComplete = `${proto[0]}${urlComplete}`;
                        if ([EMethodeDurnal.POST.key, EMethodeDurnal.PUT.key].includes(t.methode)) {
                            // Traitement POST => Envoie de données vers Durnal
                            if (t.procedureSelection) {
                                tabDonnees = [];
                                reponsesServeur = [];

                                queue = async.queue((o, cb) => {
                                    setTimeout(async() => {
                                        await envoyerDonnees(o);
                                        cb();
                                    }, 10);
                                }, t.tailleQueue);

                                let qry = false;
                                await pha.sequentiallyAsync(`select * from ${t.procedureSelection}`,
                                    async (o, index, next) => {
                                        qry = true;

                                        o =  meth ? mod[meth](options.commit.projet.transfert.parametres, o, t.template) :
                                                    transformer(options.commit.projet.transfert.parametres, o, t.template);
                                        queue.push({ parametres : options.commit.projet.transfert.parametres, url : urlComplete, methode : t.methode, parametresURL : t.parametresURL, taillePaquet : t.taillePaquet, donnees : o });

                                        next();
                                    }
                                );

                                if (qry) {
                                    await traiterFinQueue(options.commit.projet.transfert.parametres, urlComplete, t.methode, t.parametresURL);
                                }

                                process.stdout.write(`${colors.blue(nombreDonneesEnvoyees)}/${colors.green(reponsesServeur.length)}/${colors.red(nombreErreurs)}\n`);
                            }
                        } else if([EMethodeDurnal.GET.key].includes(t.methode)) {
                                // Traitement .key => On importe des données (référence) de Durnal
                                await appelerWS(options.commit.projet.transfert.parametres, urlComplete, t.methode, t.parametresURL);
                                reponsesServeur = reponsesServeur.map(reponse => {
                                    return mod[meth](reponse);
                                });
                        }

                        // Enregistrement des réponses de transfert
                        for (const item of reponsesServeur) {
                            logger.info(item);
                        }

                        if (t.procedureCorrespondance && reponsesServeur.length > 0) {
                            process.stdout.write(`${new Date().toISOString()} *** Sauvegardes  des ${t.libelle} ...`);
                            await sauvegarderCorrespondances(pha, t.procedureCorrespondance, reponsesServeur);
                            process.stdout.write(" OK ! ***\n");
                        }
                    } else {
                        console.log(new Date().toISOString(), colors.red(`Aucun protocole spécifié dans l'URL ${t.url}`));
                    }
                    jsonFile.write("]");
                    jsonFile.end();;
                } else {
                    if(options.commit.traitement) {
                        console.log(new Date().toISOString(), colors.yellow(`Pas de transfert pour ${t.libelle}.`));
                    } else {
                        console.log(new Date().toISOString(), colors.red(`URL de transfert pour ${t.libelle} introuvable ou traitement incorrecte !`));
                    }
                }
            }
        } finally {
            await baseLocale.deconnecter(pha);
        }
    } else {
        console.log(new Date().toISOString(), colors.red(`Fichier de traitements ${item.libelleGroupe}.${item.traitements} introuvable !`));
    }
}

module.exports = { transferer, transformer }
