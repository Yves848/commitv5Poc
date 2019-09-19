set sql dialect 3;

/********************************************************************/
/* table de correspondance                                          */
/********************************************************************/

create table t_durnal_praticien (
    t_durnal_praticien_id       d_id_char not null,
    matricule                   d_id_char not null,
    constraint pk_durnal_praticien primary key (t_durnal_praticien_id));

create unique index unq_durnal_praticien on t_durnal_praticien(matricule);

create table t_durnal_fournisseur (
    t_durnal_fournisseur_id       d_id_char not null,
    matricule                     d_id_char,
    constraint pk_durnal_fournisseur primary key (t_durnal_fournisseur_id));

create unique index unq_durnal_fournisseur on t_durnal_fournisseur(matricule);

set term ^;

create or alter package pk_durnal
as
begin
    procedure supprimer_praticiens_importes;

    procedure creer_correspondance_praticien(
        id_praticien type of d_id_char,
        matricule type of d_id_char);

    procedure supprimer_patients_transferes;

    procedure patient
    returns (
        id_client d_id_char,
        matricule varchar(50),
        nom varchar(50),
        prenom varchar(50),
        date_naissance varchar(8),
        rang_gemellaire numeric(1,0),
        langue varchar(3),
        sexe varchar(10),
        maison varchar(50),
        etage varchar(20),
        chambre varchar(20),
        lit varchar(10),
        id_compte d_id_int,
        id_profil_remise d_id_int,
        facturation char(1),
        date_derniere_visite date,
        adresses blob sub_type 1,
        medecins blob sub_type 1,
        tiers_payant boolean);

    procedure creer_correspondance_patient(
        id_patient type of d_id_char,
        id_durnal type of d_id_char,
        code_erreur varchar(200),
        message_erreur varchar(1000));

    procedure entourage
    returns(
        id_patient_a_lie type of d_id_char,
        code_entourage varchar(20),
        family varchar(50),
        given varchar(50),
        patient_id type of d_id_char,
        uuid varchar(50));

    procedure creer_correspondance_frn_durnal(
        id_fournisseur type of d_id_char,
        matricule type of d_id_char,
        raison_sociale varchar(100));

    procedure creer_correspondance_frn(
        id_fournisseur type of d_id_char,
        id_durnal type of d_id_char,
        code_erreur varchar(200),
        message_erreur varchar(1000));

    procedure supprimer_produits_transferes;

    procedure fournisseur
    returns(
        o2_id type of d_id_char,
        id_fournisseur type of d_id_char,
        agency blob sub_type 1,
        is_default_distributor boolean,
        logo varchar(200),
        name varchar(100),
        pharmalink boolean,
        prefered boolean,
        remarques blob sub_type 1,
        representatives blob sub_type 1,
        supplier_id type of d_id_char,
        supplier_type varchar(20),
        website varchar(200));

    procedure produit
    returns (
        id_produit d_id_char,
        numero_base_reference d_id_int,
        codes_produits blob sub_type 1,
        deleted boolean,
        designations blob sub_type 1,
        base_remboursement numeric(10,3),
        prix_vente numeric(10,3),
        prix_achat_catalogue numeric(10,3),
        pamp numeric(10,3),
        taux_tva numeric(5,2),
        code_categorie_remboursement varchar(50),
        taux_remboursement float,
        type_produit d_id_int);

    procedure creer_correspondance_produit(
        id_produit type of d_id_char,
        id_durnal type of d_id_char,
        code_erreur varchar(200),
        message_erreur varchar(1000));

    procedure rotation
    returns(
        id_produit type of d_id_char,
        mois smallint,
        annee smallint,
        quantite_vendue numeric(5),
        nombre_ventes date);

    procedure depot
    returns(
        id_depot type of d_id_char,
        nom varchar(50),
        robot varchar(5));

    procedure creer_correspondance_depot(
        id_depot type of d_id_char,
        id_durnal type of d_id_char,
        code_erreur varchar(200),
        message_erreur varchar(1000));

    procedure stock
    returns(
        id_produit type of d_id_char,
        code_produit varchar(20),
        designation varchar(100),
        stupefiant boolean,
        unites_stupefiant integer,
        id_produit_a_commander type of d_id_char,
        stocks blob sub_type 1,
        borne_mini numeric(5),
        borne_maxi numeric(5),
        derniere_vente date);

    procedure stupefiant
    returns(
        id_produit type of d_id_char,
        unites_stupefiant integer,
        id_produit_a_commander type of d_id_char,
        id_produit_unitaire type of d_id_char);

    procedure  produit_cns
    returns(
        id_produit type of d_id_char,
        quantite smallint,
        id_produit_associe type of d_id_char);

    procedure grossiste_exclusif
    returns(
        o2_id type of d_id_char,
        pharmacy_id varchar(20),
        product_code integer,
        product_id type of d_id_char,
        product_name varchar(100),
        product_price float,
        supplier_id type of d_id_char,
        type_code smallint);

    procedure achat
    returns(
        comment blob sub_type 1,
        create_date date,
        order_line_recovery_dto_list blob sub_type 1,
        pharmacy_id varchar(20),
        receipt_date date,
        status varchar(20),
        supplier_id type of d_id_char);

    procedure histo_delivrance
    returns(
        id_origine type of d_id_char,
        id_client type of d_id_char,
        numero_facture varchar(20),
        date_ordonnance date,
        date_acte date,
        type_code_praticien smallint,
        praticien type of d_id_char,
        nom_praticien varchar(50),
        prenom_praticien varchar(50),
        id_operateur varchar(20),
        lignes blob sub_type 1);

    procedure catalogue
    returns(
        o2_id type of d_id_char,
        pharmacy_id varchar(20),
        product_code integer,
        product_id type of d_id_char,
        product_name varchar(100),
        product_price float,
        supplier_id type of d_id_char);

    procedure commentaire
    returns(
        category varchar(20),
        entity_id varchar(50),
        tags varchar(100),
        text blob sub_type 1);
end
^

recreate package body pk_durnal
as
begin
    procedure supprimer_praticiens_importes
    as
    begin
        delete from t_durnal_praticien;
    end

    procedure creer_correspondance_praticien(
        id_praticien type of d_id_char,
        matricule type of d_id_char)
    as
    begin
        update or insert into t_durnal_praticien(t_durnal_praticien_id, matricule)
        values(:id_praticien, :matricule)
        matching(t_durnal_praticien_id);
    end

    procedure supprimer_patients_transferes
    as
    begin
        delete from t_transfert_client;
    end

    procedure patient
    returns (
        id_client d_id_char,
        matricule varchar(50),
        nom varchar(50),
        prenom varchar(50),
        date_naissance varchar(8),
        rang_gemellaire numeric(1,0),
        langue varchar(3),
        sexe varchar(10),
        maison varchar(50),
        etage varchar(20),
        chambre varchar(20),
        lit varchar(10),
        id_compte d_id_int,
        id_profil_remise d_id_int,
        facturation char(1),
        date_derniere_visite date,
        adresses blob sub_type 1,
        medecins blob sub_type 1,
        tiers_payant boolean)
    as
        declare function adresses (
            id_client type of d_id_char)
        returns blob sub_type 1
        as
            declare variable adresse blob sub_type 1;
            declare variable adresses blob sub_type 1;
        begin
            adresses = '[';
            for select
                    '{
                      "codePostal": "' || replace(coalesce(a.CODE_POSTAL, 'null'), '"', '') || '",
                      "email": "' || replace(coalesce(a.EMAIL, 'null'), '"', '') || '",
                      "fax": "' || replace(coalesce(a.FAX, 'null'), '"', '') || '",
                      "pays": "' || replace(coalesce(a.PAYS, 'null'), '"', '')||'",
                      "portable": "' || replace(coalesce(a.PORTABLE, 'null'), '"', '') || '",
                      "rue1": "' || replace(coalesce(a.RUE_1, 'null'), '"', '') || '",
                      "rue2": "' || replace(coalesce(a.RUE_2, 'null'), '"', '') || '",
                      "telephone": "' || replace(coalesce(a.TELEPHONE, 'null'), '"', '') || '",
                      "typeAdresse": "' || replace(coalesce(ca.TYPE_ADRESSE, 'null'), '"', '') || '",
                      "ville": "' || replace(coalesce(a.VILLE, 'null'), '"', '') || '"
                     }'
                from t_adresse a
                    inner join t_client_adresse ca on ca.t_adresse_id = a.t_adresse_id
                where ca.t_client_id = :id_client
                into :adresse do
                    adresses = adresses || :adresse || ',';

            adresses = adresses || ']';
            adresses = replace(:adresses, ',]',  ']' );
            return adresses;
        end

        declare function medecins(
            id_client type of d_id_char)
        returns blob sub_type 1
        as
            declare variable id_praticien type of d_id_char;
            declare variable ids_praticien blob sub_type 1;
        begin
            ids_praticien = '[';
            for select imp.t_durnal_praticien_id
                from t_client_praticien cp
                    left join t_praticien prat on prat.t_praticien_id = cp.t_praticien_id
                    left join t_durnal_praticien imp on imp.matricule = prat.matricule
                where imp.t_durnal_praticien_id is not null
                  and cp.t_client_id = :id_client

                into :id_praticien do
                    ids_praticien = ids_praticien ||''''|| :id_praticien || ''',';

            ids_praticien = ids_praticien || ']';
            ids_praticien = replace(:ids_praticien, ',]',  ']' );
            return ids_praticien;
        end

    begin
        for select
                cli.t_client_id,
                cli.matricule,
                replace(cli.nom, '"', ''),
                replace(cli.prenom, '"', ''),
                cli.date_naissance,
                cli.rang_gemellaire,
                cli.langue,
                case cli.sexe
                    when 1 then 'male'
                    when 2 then 'female'
                    else 'unknown'
                end,
                replace(cli.maison, '"', ''),
                replace(cli.etage, '"', ''),
                replace(cli.chambre, '"', ''),
                replace(cli.lit, '"', ''),
                cli.t_profil_remise_id,
                cli.facturation,
                cli.date_derniere_visite,
                lc.tiers_payant
            from t_client cli
                inner join t_lux_client lc on lc.t_client_id = cli.t_client_id
            /*where
                exists(select null
                    from t_histo_delivrance h
                    where h.t_client_id = cli.t_client_id
                        and h.delivrance >= dateadd(-2 year to current_date))*/
            into
                :id_client,
                :matricule,
                :nom,
                :prenom,
                :date_naissance,
                :rang_gemellaire,
                :langue,
                :sexe,
                :maison,
                :etage,
                :chambre,
                :lit,
                :id_profil_remise,
                :facturation,
                :date_derniere_visite,
                :tiers_payant
            do
        begin
            medecins = medecins(:id_client);
            adresses = adresses(:id_client);
            suspend;
        end
    end

    procedure creer_correspondance_patient(
        id_patient type of d_id_char,
        id_durnal type of d_id_char,
        code_erreur varchar(200),
        message_erreur varchar(1000))
    as
    begin
        insert into t_transfert_client(
            t_client_id,
            nouvel_identifiant,
            code_erreur,
            message_erreur)
        values(
            :id_patient,
            :id_durnal,
            :code_erreur,
            :message_erreur);
    end

    procedure entourage
    returns(
        id_patient_a_lie type of d_id_char,
        code_entourage varchar(20),
        family varchar(50),
        given varchar(50),
        patient_id type of d_id_char,
        uuid varchar(50))
    as
    begin
        for select tc.nouvel_identifiant, 'OTHER', '', '', tcr.nouvel_identifiant, ''
            from t_client c
              inner join t_transfert_client  tc on tc.t_client_id = c.t_client_id
              inner join t_client cr on cr.t_client_id = c.t_personne_referente_id
              inner join t_transfert_client tcr on tcr.t_client_id = cr.t_client_id
            into
              :id_patient_a_lie, :code_entourage, :family, :given, :patient_id, :uuid do
            suspend;
    end

    procedure creer_correspondance_frn_durnal(
        id_fournisseur type of d_id_char,
        matricule type of d_id_char,
        raison_sociale varchar(100))
    as
    begin
        update or insert into t_durnal_fournisseur(t_durnal_fournisseur_id, matricule)
        values(:id_fournisseur, :matricule)
        matching(t_durnal_fournisseur_id);
    end

    procedure creer_correspondance_frn(
        id_fournisseur type of d_id_char,
        id_durnal type of d_id_char,
        code_erreur varchar(200),
        message_erreur varchar(1000))
    as
    begin
        insert into t_transfert_fournisseur(
            t_fournisseur_id,
            nouvel_identifiant,
            code_erreur,
            message_erreur)
        values(
            :id_fournisseur,
            :id_durnal,
            :code_erreur,
            :message_erreur);
    end

    procedure supprimer_produits_transferes
    as
    begin
        delete from t_durnal_fournisseur;
        delete from t_transfert_produit;
        delete from t_transfert_depot;
        delete from t_transfert_fournisseur;
    end

    procedure fournisseur
    returns(
        o2_id type of d_id_char,
        id_fournisseur type of d_id_char,
        agency blob sub_type 1,
        is_default_distributor boolean,
        logo varchar(200),
        name varchar(100),
        pharmalink boolean,
        prefered boolean,
        remarques blob sub_type 1,
        representatives blob sub_type 1,
        supplier_id type of d_id_char,
        supplier_type varchar(20),
        website varchar(200))
    as
    begin
        -- MAJ des matricules CEFIP pour les grossistes de références
        update t_lux_fournisseur
        set matricule = '85040607'
        where t_fournisseur_id in (select t_fournisseur_id
                                   from t_fournisseur
                                   where type_fournisseur = 1
                                     and raison_sociale similar to '%C[.]?P[.]?L[.]?%'
                                     and raison_sociale not like '%CPL ETRANGER%');

        update t_lux_fournisseur
        set matricule = '85067481'
        where t_fournisseur_id in (select t_fournisseur_id
                                   from t_fournisseur
                                   where type_fournisseur = 1
                                     and raison_sociale like '%HANFF%'
                                     and raison_sociale not like '%HANFF ETRANGER%');

        update t_lux_fournisseur
        set matricule = '85039189'
        where t_fournisseur_id in (select t_fournisseur_id from t_fournisseur where type_fournisseur = 1 and raison_sociale like '%PHARMA GOEDERT%');

        for select
                f.t_fournisseur_id,
                case f.type_fournisseur
                    when 1 then 'GROSSISTE'
                    when 2 then 'LABORATOIRE'
                end,
                f.raison_sociale,
                '{
                    "address" : "' || replace(coalesce(a.rue_1, ''), '"', '') || '",
                    "address2" : "' || replace(coalesce(a.rue_2, ''), '"', '') || '",
                    "agencyName" : "",
                    "city" : "' || replace(coalesce(a.ville, ''), '"', '') || '",
                    "cityId" : "",
                    "id" : "",
                    "phoneNumber" : "' || replace(coalesce(a.telephone, ''), '"', '') || '",
                    "postalBox" : "' || replace(coalesce(a.code_postal, ''), '"', '') || '"
                }',
                f.commentaire
            from
                t_fournisseur f
                left join t_adresse a on a.t_adresse_id = f.t_adresse_id
            where
                f.type_fournisseur = 2
            into
                :o2_id,
                :supplier_type,
                :name,
                :agency,
                :remarques
        do
        begin
            is_default_distributor = false;
            pharmalink = false;
            prefered = false;

            suspend;
        end
    end

    procedure produit
    returns (
        id_produit d_id_char,
        numero_base_reference d_id_int,
        codes_produits blob sub_type 1,
        deleted boolean,
        designations blob sub_type 1,
        base_remboursement numeric(10,3),
        prix_vente numeric(10,3),
        prix_achat_catalogue numeric(10,3),
        pamp numeric(10,3),
        taux_tva numeric(5,2),
        code_categorie_remboursement varchar(50),
        taux_remboursement float,
        type_produit d_id_int)
    as
        declare function codes_produit (
            id_produit type of d_id_char)
        returns blob sub_type 1
        as
            declare variable code varchar(200);
            declare variable codes blob sub_type 1;
        begin
            codes = '[';
            for select
                    '{
                      "typeCode": "' || replace(coalesce(pc.TYPE_CODE, 'null'), '"', '') || '",
                      "codeProduit": "'||replace(coalesce(pc.CODE, 'null'), '"', '') || '"
                     }'
                from t_produit p
                inner join t_produit_code pc on p.t_produit_id = pc.t_produit_id
                where p.t_produit_id = :id_produit
                into :code do
                codes = codes || code || ',';

            codes = codes || ']';
            codes = replace(:codes, ',]',  ']' );
            return codes;
        end

        declare function designations_produit (
            id_produit type of d_id_char)
        returns blob sub_type 1
        as
            declare variable designation varchar(200);
            declare variable designations blob sub_type 1;
        begin
            designations = '[';
            for select
                    '{
                      "designation": "' || replace(coalesce(pd.designation, 'null'), '"', '') || '",
                      "langue": "' || coalesce(pd.langue, 'null') || '"
                     }'
                from t_produit p
                    inner join t_produit_designation pd on p.t_produit_id = pd.t_produit_id
                where p.t_produit_id = :id_produit
                into :designation do
                designations = designations || :designation || ',';

            designations = designations || ']';
            designations = replace(:designations, ',]',  ']' );
            return designations;
        end
    begin
        for select
                p.t_produit_id,
                p.base_remboursement,
                p.prix_vente,
                p.prix_achat_catalogue,
                p.pamp,
                p.taux_tva,
                lp.categorie_remboursement,
                lp.taux_remboursement,
                p.supprime
            from t_produit p
                left join t_lux_produit lp on lp.t_produit_id = p.t_produit_id
            where
                exists(select null from t_stock s where s.t_produit_id = p.t_produit_id and stock <> 0) or
                exists(select null
                       from t_histo_delivrance_ligne hl
                         inner join t_histo_delivrance h on h.t_histo_delivrance_id = hl.t_histo_delivrance_id
                       where hl.t_produit_id = p.t_produit_id
                         and h.delivrance >= dateadd(-2 year to current_date)) or
                exists(select null from t_lux_produit lp where lp.t_produit_a_tarifer_cns_id = p.t_produit_id and lp.t_produit_a_tarifer_cns_id is not null) or
                p.liste = 3
            into
                :id_produit,
                :base_remboursement,
                :prix_vente,
                :prix_achat_catalogue,
                :pamp,
                :taux_tva,
                :code_categorie_remboursement,
                :taux_remboursement,
                :deleted
        do
        begin
            codes_produits = codes_produit(:id_produit);
            designations = designations_produit(:id_produit);
            suspend;
        end
    end

    procedure creer_correspondance_produit(
        id_produit type of d_id_char,
        id_durnal type of d_id_char,
        code_erreur varchar(200),
        message_erreur varchar(1000))
    as
    begin
        insert into t_transfert_produit(
            t_produit_id,
            nouvel_identifiant,
            code_erreur,
            message_erreur)
        values(
            :id_produit,
            :id_durnal,
            :code_erreur,
            :message_erreur);
    end

    procedure rotation
    returns(
        id_produit type of d_id_char,
        mois smallint,
        annee smallint,
        quantite_vendue numeric(5),
        nombre_ventes date)
    as
    begin
        for select
                tp.nouvel_identifiant,
                h.mois,
                h.annee,
                h.quantite_vendue,
                h.nombre_ventes
            from
                t_historique_vente h
                inner join t_transfert_produit tp on tp.t_produit_id = h.t_produit_id
            where
                h.annee >= extract(year from current_date) - 2
            into
                :id_produit,
                :mois,
                :annee,
                :quantite_vendue,
                :nombre_ventes do
            suspend;
    end

    procedure depot
    returns(
        id_depot type of d_id_char,
        nom varchar(50),
        robot varchar(5))
    as
    begin
        for select
                t_depot_id, libelle, iif(t_depot_id = 'RBT', 'true', 'false')
            from
                t_depot
            into
                :id_depot, :nom, :robot
            do
            suspend;
    end

    procedure creer_correspondance_depot(
        id_depot type of d_id_char,
        id_durnal type of d_id_char,
        code_erreur varchar(200),
        message_erreur varchar(1000))
    as
    begin
        insert into t_transfert_depot(
            t_depot_id,
            nouvel_identifiant,
            code_erreur,
            message_erreur)
        values(
            :id_depot,
            :id_durnal,
            :code_erreur,
            :message_erreur);
    end

    procedure stock
    returns(
        id_produit type of d_id_char,
        code_produit varchar(20),
        designation varchar(100),
        stupefiant boolean,
        unites_stupefiant integer,
        id_produit_a_commander type of d_id_char,
        stocks blob sub_type 1,
        borne_mini numeric(5),
        borne_maxi numeric(5),
        derniere_vente date)
    as
        declare function stocks_depot(
            id_produit type of d_id_char)
        returns blob sub_type 1
        as
            declare variable stocks blob sub_type 1;
        begin
            stocks = '[';
            for select
                    '{
                      "idDepot" : "' || td.nouvel_identifiant || '",
                      "stockMini" : "' || s.stock_mini || '",
                      "stockMaxi" : "' || coalesce(s.stock_maxi, 'null') || '",
                      "quantite" : "' || iif(s.stock < 0, 0, s.stock) || '",
                      "zoneGeographique" : {
                                             "code" : "' || coalesce(z.t_zone_geographique_id, 'null') || '",
                                             "libelle" : "' || replace(coalesce(z.libelle, 'null'), '"', '') || '"
                                           }
                     }' stock
                from
                    t_stock s
                    inner join t_transfert_depot td on td.t_depot_id = s.t_depot_id
                    left join t_zone_geographique z on z.t_zone_geographique_id = s.t_zone_geographique_id
                where
                    s.t_produit_id = :id_produit
                as cursor s do
                    stocks = stocks || :s.stock || ',';

            stocks = stocks || ']';
            stocks = replace(:stocks, ',]',  ']' );
            return stocks;
        end
    begin
        for select
                tp.nouvel_identifiant,
                pc.code,
                pd.designation,
                p.liste = 3,
                lp.unites_stupefiant,
                tpc.nouvel_identifiant,
                stocks_depot(p.t_produit_id),
                p.borne_mini,
                p.borne_maxi,
                p.derniere_vente
            from
                t_transfert_produit tp
                inner join t_produit p on p.t_produit_id = tp.t_produit_id
                left join t_lux_produit lp on lp.t_produit_id = p.t_produit_id
                left join t_transfert_produit tpc on tpc.t_produit_id = lp.t_produit_a_commander_id
                left join t_produit_designation pd on pd.t_produit_id = p.t_produit_id and pd.langue = 'FR'
                left join t_produit_code pc on pc.t_produit_id = p.t_produit_id and pc.type_code = 1
            where
              tp.nouvel_identifiant is not null
            into
                :id_produit,
                :code_produit,
                :designation,
                :stupefiant,
                :unites_stupefiant,
                :id_produit_a_commander,
                :stocks,
                :borne_mini,
                :borne_maxi,
                :derniere_vente do
            suspend;
    end

    procedure stupefiant
    returns(
        id_produit type of d_id_char,
        unites_stupefiant integer,
        id_produit_a_commander type of d_id_char,
        id_produit_unitaire type of d_id_char)
    as
    begin
        for select
                tp.nouvel_identifiant, lp.unites_stupefiant, tpc.nouvel_identifiant, tpu.nouvel_identifiant
            from
                t_lux_produit lp
                inner join t_produit p on p.t_produit_id = lp.t_produit_id
                inner join t_transfert_produit tp on tp.t_produit_id = lp.t_produit_id
                left join t_transfert_produit tpc on tpc.t_produit_id = lp.t_produit_a_commander_id
                left join t_transfert_produit tpu on tpu.t_produit_id = lp.t_produit_unitaire_id
            where
                p.liste = '3'
                and tp.nouvel_identifiant is not null
            into
                :id_produit, :unites_stupefiant, :id_produit_a_commander, :id_produit_unitaire do
            suspend;
    end

    procedure produit_cns
    returns(
        id_produit type of d_id_char,
        quantite smallint,
        id_produit_associe type of d_id_char)
    as
    begin
        for select
                tp.nouvel_identifiant, lp.quantite_produit_a_tarifer_cns, tpc.nouvel_identifiant
            from
                t_lux_produit lp
                inner join t_transfert_produit tp on tp.t_produit_id = lp.t_produit_id
                inner join t_transfert_produit tpc on tpc.t_produit_id = lp.t_produit_a_tarifer_cns_id
            where
                lp.quantite_produit_a_tarifer_cns is not null
            into
                :id_produit, :quantite, :id_produit_associe do
            suspend;
    end

    procedure grossiste_exclusif
    returns(
        o2_id type of d_id_char,
        pharmacy_id varchar(20),
        product_code integer,
        product_id type of d_id_char,
        product_name varchar(100),
        product_price float,
        supplier_id type of d_id_char,
        type_code smallint)
    as
    begin
        for select
                '{tenantId}',
                pc.code,
                tp.nouvel_identifiant,
                pd.designation,
                p.prix_achat_catalogue,
                df.t_durnal_fournisseur_id,
                0
            from t_produit p
                inner join t_transfert_produit tp on tp.t_produit_id = p.t_produit_id
                inner join t_fournisseur f on f.t_fournisseur_id = p.t_repartiteur_id
                inner join t_lux_fournisseur lf on lf.t_fournisseur_id = f.t_fournisseur_id
                inner join t_durnal_fournisseur df on df.matricule = lf.matricule
                left join (select t_produit_id, designation
                            from t_produit_designation
                            where langue = 'FR') pd on pd.t_produit_id = p.t_produit_id
                left join (select t_produit_id, code
                            from t_produit_code
                            where type_code = 0) pc on pc.t_produit_id = p.t_produit_id
            where
                tp.nouvel_identifiant is not null
            into
                :pharmacy_id,
                :product_code,
                :product_id,
                :product_name,
                :product_price,
                :supplier_id,
                :type_code
            do
                suspend;
    end

    procedure histo_delivrance
    returns(
        id_origine type of d_id_char,
        id_client type of d_id_char,
        numero_facture varchar(20),
        date_ordonnance date,
        date_acte date,
        type_code_praticien smallint,
        praticien type of d_id_char,
        nom_praticien varchar(50),
        prenom_praticien varchar(50),
        id_operateur varchar(20),
        lignes blob sub_type 1)
    as
        declare function lignes_histo_deliv(
            id_histo_deliv type of d_id_char)
        returns blob sub_type 1
        as
            declare variable lignes blob sub_type 1;
        begin
            lignes = '[';
            for select
                    '{
                      "typeCodeProduit" : "0",
                      "produit" : "' || tp.nouvel_identifiant || '",
                      "designation" : "' || replace(coalesce(pd.designation, 'null'), '"', '') || '",
                      "quantite" : "' || l.quantite || '",
                      "prixAchat" : "' || l.prix_achat || '",
                      "prixAchatRemise" : "",
                      "prixVente" : "' || l.prix_vente || '"
                     }' lignes
                from
                    t_histo_delivrance_ligne l
                    inner join t_transfert_produit tp on tp.t_produit_id = l.t_produit_id
                    inner join t_produit_designation pd on pd.t_produit_id = tp.t_produit_id
                where
                    tp.nouvel_identifiant is not null and
                    l.t_histo_delivrance_id = :id_histo_deliv
                as cursor l do
                lignes = lignes || :l.lignes || ',';

            lignes = lignes || ']';
            lignes = replace(:lignes, ',]',  ']' );
            return lignes;
        end
    begin
        for select
                e.t_histo_delivrance_id,
                tc.nouvel_identifiant,
                e.numero_facture,
                e.prescription,
                e.delivrance,
                iif(dp.t_durnal_praticien_id is not null, 0, 1),
                dp.t_durnal_praticien_id,
                p.nom,
                p.prenom,
                null,
                lignes_histo_deliv(t_histo_delivrance_id)
            from
                t_histo_delivrance e
                left join t_transfert_client tc on tc.t_client_id = e.t_client_id
                left join t_praticien p on p.t_praticien_id = e.t_praticien_id
                left join t_durnal_praticien dp on dp.matricule = p.matricule
            where
                e.delivrance >= dateadd(-2 year to current_date)
            into
                :id_origine,
                :id_client,
                :numero_facture,
                :date_ordonnance,
                :date_acte,
                :type_code_praticien,
                :praticien,
                :nom_praticien,
                :prenom_praticien,
                :id_operateur,
                :lignes do
            suspend;
    end

    procedure achat
    returns(
        comment blob sub_type 1,
        create_date date,
        order_line_recovery_dto_list blob sub_type 1,
        pharmacy_id varchar(20),
        receipt_date date,
        status varchar(20),
        supplier_id type of d_id_char)
    as
        declare variable idCommande integer;
        declare variable lignes blob sub_type 1;
    begin
        idCommande = null;
        lignes = null;
        for select
                c.t_commande_id, c.date_commande, df.t_durnal_fournisseur_id,
                tp.nouvel_identifiant, pc_nat.code, pd.designation,
                l.prix_achat_catalogue, l.prix_achat_remise, p.taux_tva,
                l.quantite_commandee, l.unites_gratuites, l.quantite_recue
            from
                t_commande c
                inner join t_lux_fournisseur f on f.t_fournisseur_id = c.t_fournisseur_id
                inner join t_durnal_fournisseur df on df.matricule = f.matricule
                inner join t_ligne_commande l on l.t_commande_id = c.t_commande_id
                inner join t_transfert_produit tp on tp.t_produit_id = l.t_produit_id
                inner join t_produit p on p.t_produit_id = l.t_produit_id
                inner join t_produit_code pc_nat on pc_nat.t_produit_id = l.t_produit_id and pc_nat.type_code = 1
                inner join t_produit_designation pd on pd.t_produit_id = l.t_produit_id and pd.langue = 'FR'
            where
                tp.nouvel_identifiant is not null
            order by
                c.t_commande_id, l.t_ligne_commande_id
            as cursor c do
        begin
            if (idCommande is null or idCommande <> c.t_commande_id) then
            begin
                if (idCommande is not null) then
                begin
                    lignes = lignes || ']';
                    lignes = replace(lignes, ',]',  ']' );

                    order_line_recovery_dto_list = lignes;
                    suspend;
                end
                idCommande = c.t_commande_id;
                lignes = '[';
            end
            else
            begin
                lignes = lignes ||
                    '{
                        "discount" : "0",
                        "discountedProductPrice" : "' || c.prix_achat_remise || '",
                        "freeUnits" : "' || c.unites_gratuites || '",
                        "pharmacyId" : "{tenantId}",
                        "productCode" : "' || c.code || '",
                        "productId" : "' || c.nouvel_identifiant || '",
                        "productName" : "' || replace(coalesce(c.designation, 'null'), '"', '') || '",
                        "productPrice" : "' || c.prix_achat_catalogue || '",
                        "quantity" : "' || c.quantite_commandee || '",
                        "receivedQuantity" : "' || c.quantite_recue || '",
                        "typeCode" : "NUM_NATIONAL",
                        "vatRate" : "' || c.taux_tva || '"
                    },';
            end

            comment = c.t_commande_id;
            create_date = c.date_commande;
            pharmacy_id = '{tenantId}';
            receipt_date = null;
            status = 'FULLY_RECEIVED';
            supplier_id = c.t_durnal_fournisseur_id;
        end
    end

    procedure catalogue
    returns(
        o2_id type of d_id_char,
        pharmacy_id varchar(20),
        product_code integer,
        product_id type of d_id_char,
        product_name varchar(100),
        product_price float,
        supplier_id type of d_id_char)
    as
    begin
        for select
                '{tenantId}',
                pc.code,
                tp.nouvel_identifiant,
                pd.designation,
                p.prix_achat_catalogue,
                tf.nouvel_identifiant
            from
                t_catalogue c
                inner join t_fournisseur f on f.t_fournisseur_id = c.t_fournisseur_id
                left join t_transfert_fournisseur tf on tf.t_fournisseur_id = f.t_fournisseur_id
                inner join t_catalogue_ligne l on l.t_catalogue_id = c.t_catalogue_id
                inner join t_produit p on p.t_produit_id = l.t_produit_id
                inner join (select nouvel_identifiant, t_produit_id
                            from (select row_number() over(partition by nouvel_identifiant order by t_produit_id) rn, nouvel_identifiant, t_produit_id
                                  from t_transfert_produit)
                            where rn = 1) tp on tp.t_produit_id = p.t_produit_id
                left join (select t_produit_id, designation
                           from t_produit_designation
                           where langue = 'FR') pd on pd.t_produit_id = p.t_produit_id
                left join (select t_produit_id, code
                           from t_produit_code
                           where type_code = 0) pc on pc.t_produit_id = p.t_produit_id
            where
                tf.nouvel_identifiant is not null and tp.nouvel_identifiant is not null
            into
                :pharmacy_id,
                :product_code,
                :product_id,
                :product_name,
                :product_price,
                :supplier_id do
            suspend;
    end

    procedure commentaire
    returns(
        category varchar(20),
        entity_id varchar(50),
        tags varchar(100),
        text blob sub_type 1)
    as
    begin
        for /*select tc.nouvel_identifiant, 31, c.commentaire_individuel
            from
                t_client c
                inner join t_transfert_client tc on tc.t_client_id = c.t_client_id
            where
                tc.nouvel_identifiant is not null and
                c.commentaire_global is not null
            union
            select tc.nouvel_identifiant, 32, c.commentaire_global
            from
                t_client c
                inner join t_transfert_client tc on tc.t_client_id = c.t_client_id
            where
                tc.nouvel_identifiant is not null and
                c.commentaire_global is not null
            union
            select df.t_durnal_fournisseur_id, 41, f.commentaire
            from
                t_lux_fournisseur lf
                inner join t_fournisseur f on f.t_fournisseur_id = lf.t_fournisseur_id
                inner join t_durnal_fournisseur df on df.matricule = lf.matricule
            where
                f.commentaire is not null
            union*/
            select 'PRODUCT', tp.nouvel_identifiant, '[ { "code" : "product.sale" } ]', '"' || replace(p.commentaire_vente, '"', '') || '"'
            from t_produit p
                inner join t_transfert_produit tp on tp.t_produit_id = p.t_produit_id
            where
                tp.nouvel_identifiant is not null and
                p.commentaire_vente is not null
            /*union
            select tp.nouvel_identifiant, 52, p.commentaire_gestion
            from
                t_produit p
                inner join t_transfert_produit tp on tp.t_produit_id = p.t_produit_id
            where
                tp.nouvel_identifiant is not null and
                p.commentaire_gestion is not null*/
            into :category, :entity_id, :tags, :text do
        begin
            suspend;
        end
    end
end
^

set term ;^
