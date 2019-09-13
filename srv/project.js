'use strict';

const promise = require('bluebird');

const fs = require('fs-extra');
const path = require('path');

const firebird = require('node-firebird-dev');

const childProcess = require('child_process');
const colors = require('colors');

promise.promisifyAll(firebird);

const C_CHEMIN_BASE = path.resolve(`${__dirname}\\..`);
const C_CHEMIN_BASE_SCRIPT_SQL = `${C_CHEMIN_BASE}\\sql`;

const C_OPTIONS_PHA = {
    "host": "127.0.0.1",
    "port": 3050,
    "database": '/PHA3.FDB',
    "user": "SYSDBA",
    "password": "masterkey",
    "lowercase_keys": false,
    "role": null,
    "pageSize": 4096,
    "commit": { }
};

const executeScript = (username, password, sql, db) => {
    let p = ['-u', username, '-p', password];
    if (db) {
        p.push(db);
    }
    Array.prototype.push.apply(p, ['-i', sql]);
    const stout = childProcess.execFileSync(`${C_CHEMIN_BASE}\\fb3\\isql.exe`, p);
    console.log(new Date().toISOString(), `Execution du script ${sql} : ${stout.stderr == undefined ? 'Ok :)' : stout.stderr}`);
}

const executeDirectoryScripts = (db, username, password, directory) => {
    if (directory && fs.pathExistsSync(directory)) {
        fs.readdirSync(directory).forEach(file => {
            const sql = directory + "\\" + file;
            if (!fs.statSync(sql).isDirectory()) {
                executeScript(username, password, sql, db);
            }
        })
    }
}

const executeScripts = (pha) => {

    const cheminDb = pha.database;
    executeDirectoryScripts(cheminDb, pha.user, pha.password, C_CHEMIN_BASE_SCRIPT_SQL);
    if (pha.commit.pays) executeDirectoryScripts(cheminDb, pha.user, pha.password, `${C_CHEMIN_BASE_SCRIPT_SQL}\\${pha.commit.pays}`);
    if (pha.commit.import) executeScript(pha.user, pha.password, `${C_CHEMIN_BASE}\\modules\\import\\${pha.commit.import.module}\\${pha.commit.import.module}.sql`, cheminDb);
    if (pha.commit.transfert) executeScript(pha.user, pha.password, `${C_CHEMIN_BASE}\\modules\\transfert\\${pha.commit.transfert.module}\\${pha.commit.transfert.module}.sql`, cheminDb);
}

const createDatebase = async (pha) => {

    // Création de la base locale
    process.stdout.write('Création de la base locale en cours...');
    const db = await firebird.createAsync(pha);
    process.stdout.write('OK :)\n');
    db.detach();

    // Exécution des scripts
    executeScripts(pha);
}

const create = async (directory,
    country,
    importModule, transfertModule) => {

    // Création du répertoire au besoin
    if (!fs.pathExistsSync(directory)) {
        fs.mkdirpSync(directory, { recursive : true });
    }

    // Création base locale
    if (country && importModule && transfertModule) {
        const prj =
            {
                "pays" : country,
                "import" : { "module" : importModule },
                "transfert" : { "module" : transfertModule }
            };

        fs.writeFileSync(`${directory}\\commit.prj`, JSON.stringify(prj));

        const pha = { ...C_OPTIONS_PHA };
        pha.database = `${directory}/${pha.database}`;
        pha.commit = `${prj}`;
        await createDatebase(pha);

        return true;
    } else {
        return false;
    }
}

const getTreatments = (type, module) => {

    const m  = JSON.parse(fs.readFileSync(`${C_CHEMIN_BASE}/modules/${type}/${module}/${module}.json`));
    for(const i of m) {
        i.traitements = JSON.parse(fs.readFileSync(`${C_CHEMIN_BASE}/modules/${type}/${module}/${i.traitements}`))
        for(const t of i.traitements) {
            t.succes = 0;
            t.erreurs = 0;
        }
    }
    return m;
}

const open = async(directory) => {

    const pha = { ...C_OPTIONS_PHA };
    pha.database = `${directory}/${pha.database}`;

    pha.commit = JSON.parse(fs.readFileSync(`${directory}\\commit.prj`));
    pha.commit.import.groupes = getTreatments('import', pha.commit.import.module);
    pha.commit.transfert.groupes = getTreatments('transfert', pha.commit.transfert.module);
    pha.commit.directory = directory;

    return pha;
}

const loadModule = async (type, module) => {
    if (module && module.length !== 0) {
        try {
            return require(`../modules/${type}/${module}/${module}`);
        } catch (e) {
            console.log(new Date().toISOString(), `Erreur lors du chargement du module: ${e.message}`);
            console.log(new Date().toISOString(), e.stack);
        }
    } else {
        console.log(new Date().toISOString(), colors.red("Module non-spécifié !"));
    }
}

const execute = async(directory, type, id) => {

    const prj = await open(directory);
    if (prj) {
        const m = await loadModule(type, prj.commit[type].module);
        if (m) {
            if (id) {
                prj.commit.traitement = id;
            }
            m.execute(prj);
        }
    }
}

module.exports = { create, open, execute };
