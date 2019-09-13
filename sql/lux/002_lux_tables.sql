create table t_lux_client(
    t_client_id d_id_char not null,
    carte_invalide boolean default false not null,
    tiers_payant boolean default true not null,
    constraint pk_lux_client primary key (t_client_id),
    constraint fk_lux_client foreign key(t_client_id) references t_client(t_client_id) on delete cascade);

create table t_lux_fournisseur(
    t_fournisseur_id d_id_char not null,
    type_modem d_four_type_modem,
    matricule varchar(30),
    constraint pk_lux_fournisseur primary key (t_fournisseur_id),
    constraint fk_lux_fournisseur foreign key(t_fournisseur_id) references t_fournisseur(t_fournisseur_id) on delete cascade);

create table t_lux_produit(
	t_produit_id d_id_char not null,
    t_produit_a_commander_id d_id_char,
    t_produit_unitaire_id d_id_char,
    unites_stupefiant integer,
    t_produit_a_tarifer_cns_id d_id_char,
    quantite_produit_a_tarifer_cns smallint,
    prix_reference_cns numeric(10,3),
    prix_intervention_cns numeric(10,3),
    categorie_remboursement varchar(2),
    taux_remboursement numeric(6,2),
	constraint pk_lux_produit primary key (t_produit_id),
    constraint fk_lux_produit foreign key(t_produit_id) references t_produit(t_produit_id) on delete cascade,
    constraint fk_lux_produit_commande foreign key (t_produit_a_commander_id) references t_produit (t_produit_id) on delete cascade,
    constraint fk_lux_produit_tarification foreign key (t_produit_a_tarifer_cns_id) references t_produit (t_produit_id) on delete cascade,
    constraint fk_lux_produit_unitaire foreign key (t_produit_unitaire_id) references t_produit (t_produit_id) on delete cascade);

create table t_lux_chimique(
    t_lux_chimique_id d_id_char not null,
    designation varchar(100) not null,
    supprime boolean default false not null,
    prix_base numeric(10,3) not null,
    quantite_prix smallint not null,
    unite d_chimique_unite not null,
    taux_conversion numeric(10, 3) not null,
    liste varchar(100),
    constraint pk_lux_chimique primary key (t_lux_chimique_id));

create unique index unq_lux_chimique on t_lux_chimique(designation);

comment on column t_lux_chimique.unite is
'1 : Gramme (GR)
 2 : Centigramme (CG)
 3 : Milligramme (MG)
 4 : Decigramme (DG)
 5 : Pièce
 6 : Millilitre (ML)
 7 : Litre (L)
 8 : Decilitre (DL)
 9 : Centilitre (CL)';

 create table t_lux_preparation(
     t_lux_preparation_id d_id_char not null,
     prive boolean default true not null,
     designation varchar(100) not null,
     constraint pk_lux_preparation primary key (t_lux_preparation_id));

create unique index unq_lux_preparation on t_lux_preparation(designation);

create table t_lux_composant_preparation(
    t_lux_composant_preparation_id d_id_int not null,
    t_lux_preparation_id d_id_char not null,
    ordre smallint not null,
    t_lux_chimique_id d_id_char not null,
    quantite smallint not null,
    constraint pk_lux_composant_preparation primary key(t_lux_composant_preparation_id),
    constraint fk_lux_compprep_preparation foreign key(t_lux_preparation_id) references t_lux_preparation(t_lux_preparation_id),
    constraint fk_lux_compprep_chimique foreign key(t_lux_chimique_id) references t_lux_chimique(t_lux_chimique_id));

create sequence seq_lux_composant_preparation;

create unique index unq_lux_composant_preparation on t_lux_composant_preparation(t_lux_preparation_id, t_lux_chimique_id);