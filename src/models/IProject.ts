export interface Project {
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
}

export interface ModuleTransfert {
  nom: string;
  date: Date;
  version: string;
  mode: number;
  resultats: Resultats[];
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
