export interface Modules {
  modulesPays: ModulesPays[];
}

export interface ModulesPays {
  pays: string;
  import: ModulesImport[];
  transfert: ModulesTransfert[];
}

export interface ModulesImport {
  nom: string;
  version: string;
}

export interface ModulesTransfert {
  nom: string;
  version: string;
}

export const modulespays: Modules = {
  modulesPays: [
    {
      pays: 'fr',
      import: [
        {
          nom: 'caduciel',
          version: '1.0.0',
        },
        {
          nom: 'alliancePremium',
          version: '1.0.0',
        },
        {
          nom: 'cip',
          version: '1.0.0',
        },
        {
          nom: 'esculapeV6',
          version: '1.0.0',
        },
        {
          nom: 'infosoft',
          version: '1.0.0',
        },
        {
          nom: 'leo1',
          version: '1.0.0',
        },
        {
          nom: 'leo2',
          version: '1.0.0',
        },
        {
          nom: 'periphar',
          version: '1.0.0',
        },
        {
          nom: 'pgi',
          version: '1.0.0',
        },
        {
          nom: 'pharmalandv7',
          version: '1.0.0',
        },
        {
          nom: 'pharmaVitale',
          version: '1.0.0',
        },
        {
          nom: 'premium',
          version: '1.0.0',
        },
        {
          nom: 'presto2',
          version: '1.0.0',
        },
        {
          nom: 'servilog',
          version: '1.0.0',
        },
        {
          nom: 'vindilis',
          version: '1.0.0',
        },
        {
          nom: 'visioPharm',
          version: '1.0.0',
        },
        {
          nom: 'winPharma',
          version: '1.0.0',
        },
      ],
      transfert: [
        {
          nom: 'lgpi',
          version: '1.0.0',
        },
        {
          nom: 'durnal',
          version: '1.0.0',
        },
      ],
    },
    {
      pays: 'be',
      import: [
        {
          nom: 'farmadTwin',
          version: '1.0.0',
        },
        {
          nom: 'greenock',
          version: '1.0.0',
        },
        {
          nom: 'iPharma',
          version: '1.0.0',
        },
        {
          nom: 'multiPharma',
          version: '1.0.0',
        },
        {
          nom: 'nextPharm',
          version: '1.0.0',
        },
        {
          nom: 'officinall',
          version: '1.0.0',
        },
        {
          nom: 'offigest',
          version: '1.0.0',
        },
        {
          nom: 'pharmony',
          version: '1.0.0',
        },
        {
          nom: 'sabcoNew',
          version: '1.0.0',
        },
      ],
      transfert: [
        {
          nom: 'ultimate',
          version: '1.0.0',
        },
      ],
    },
    {
      pays: 'lu',
      import: [
        {
          nom: 'officine2',
          version: '1.0.0',
        },
      ],
      transfert: [
        {
          nom: 'durnal',
          version: '1.0.0',
        },
      ],
    },
  ],
};
