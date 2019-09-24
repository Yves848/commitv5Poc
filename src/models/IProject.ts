export interface ProjectFile {
  informations_generales: InfosGen;
  module_import: ModuleImport;
  module_transfert: ModuleTransfert;
}

export interface ModuleImport {
  nom: string;
  date: Date;
  version: string;
  mode: number;
  resultats: Resultats[];
  groupes: Groupes[];
}

export interface ModuleTransfert {
  nom: string;
  date: Date;
  version: string;
  mode: number;
  resultats: Resultats[];
  groupes: Groupes[];
}

export interface InfosGen {
  folder: string;
  pays: string;
  date_creation: Date;
  module_en_cours: number;
  page_en_cours: number;
  date_conversion: Date;
}

export interface Resultats {
  ligne: string;
}

export interface ProjectGroup {
  libelleGroupe: string;
  procedureSuppression: string;
  traitements: string;
}

export interface Groupes {
  libelleGroupe: string;
  procedureSuppression: string;
  traitements: Traitement[];
}

export interface Traitement {
  id: string;
  libelle: string;
  sqlSelect: string;
  sqlInsert: string;
  resultat: Resultat;
}

export interface Resultat {
  succes: number;
  avertissements: number;
  erreurs: number;
  debut: Date;
  fin: Date;
}
