set sql dialect 3;
set term ^;

create or alter package pk_officine2
as
begin
    procedure creer_medecin(
        inomed integer,
        cmatricule varchar(8),
        cnom varchar(40),
        cadresse varchar(60),
        ccodepost varchar(10),
        clocalite varchar(60),
        ctelephone varchar(25),
        cfax varchar(25),
        cspec varchar(40),
        cpays varchar(30),
        cemail varchar(30),
        mremarque blob sub_type 1);

    procedure creer_compte(
        inoclient integer,
        cnom varchar(30),
        cintitule varchar(50),
        cnomcontact varchar(50),
        cadresse_f varchar(60),
        ccp_f varchar(10),
        clocalite_f varchar(50),
        cadresse_l varchar(50),
        ccp_l varchar(10),
        clocalite_l varchar(60),
        ctelephone varchar(20),
        cfax varchar(20),
        cemail varchar(50),
        cgsm varchar(20),
        mnotes blob sub_type 1);

    procedure creer_client(
        inopat integer,
        cmatricule varchar(13),
        lmatricule smallint,
        lcarteinvalide smallint,
        ltierspayant smallint,
        cnom varchar(30),
        cprenom varchar(25),
        cadresse varchar(60),
        ccodepost varchar(10),
        clocalite varchar(50),
        cpays varchar(30),
        ctelephone varchar(25),
        cgsm varchar(25),
        cfax varchar(25),
        cemail varchar(30),
        isexe integer,
        cchambre varchar(20),
        cadresse_f varchar(60),
        ccodepost_f varchar(10),
        clocalite_f varchar(50),
        cpays_f varchar(30),
        inoclient integer,
        inopatref integer,
        mremarque blob sub_type 1,
        tcreation date);

    procedure creer_client_medecin(
        inopat integer,
        inomed integer);

    procedure creer_grossiste(
        inogross integer,
        ldefault smallint,
        cnomgross varchar(20),
        cadresse varchar(60),
        ccp varchar(10),
        clocalite varchar(50),
        ctelephone varchar(25),
        cfax varchar(25),
        cgsm varchar(25),
        cemail varchar(60),
        cnomcontact varchar(50),
        inogrossmodem integer,
        mnotes blob sub_type 1);

    procedure creer_produit(
        inoref integer,
        inocefip integer,
        inonat integer,
        cbarcode varchar(13),
        cgtin varchar(13),
        cnom varchar(40),
        igrossiste integer,
        ybasermb varchar(12),
        ypxpublic varchar(12),
        ypxachat varchar(12),
        ypamp varchar(12),
        ntauxtva varchar(12),
        remarque blob sub_type 1,
        note blob sub_type 1,
        cetat varchar(2),
        lstup smallint,
        lcopie smallint,
        lderangt smallint,
        luniqstup smallint,
        lprogsubst smallint,
        catc1 varchar(7),
        catc2 varchar(7),
        catc3 varchar(7),
        catc4 varchar(7),
        ddernvte date,
        lgererstk smallint,
        istkrayon integer,
        ldblstk smallint,
        istkreserve integer,
        lrobot smallint,
        istkrobot integer,
        istkmin integer,
        iqtecde integer,
        ccatremb varchar(2),
        ntauxremb varchar(12),
        lsupprime smallint);

    procedure creer_info_produit_lux(
        inoref integer,
        lstup smallint,
        irefcde integer,
        iunitairestup integer,
        iequivstup integer,
        irefcns integer,
        iequivcns smallint,
        ypxinterv varchar(12),
        ypxoff varchar(12));

    procedure creer_date_peremption(
        inoref integer,
        dperemp date,
        iqte integer);

    procedure creer_code_produit(
        inoref integer,
        ccode varchar(20));

    procedure creer_representant(
        inogpe integer,
        cnomgpe varchar(40));

    procedure creer_representant_produit(
        inogpe integer,
        inoref integer);

    procedure creer_historique(
        inovente integer,
        inoord integer,
        inoemp integer,
        inopatient integer,
        inomedecin integer,
        ddateord date,
        tcreation date);

    procedure creer_historique_ligne(
        inovente integer,
        inoref integer,
        iqte integer,
        ypxvendu varchar(12),
        ypxachat varchar(12),
        tcreation date);

    procedure creer_commande(
        inocde integer,
        inogross integer,
        tcreation date,
        montant_total varchar(12));

    procedure creer_commande_ligne(
        inocde integer,
        inoref integer,
        iqte integer,
        irecu integer,
        iug integer,
        cnote varchar(60),
        drecep date,
        ypxremunit varchar(12),
        ypxunit varchar(12));

    procedure creer_chimique(
        inochim integer,
        cnomchim varchar(40),
        lsupp smallint,
        nprixbase varchar(12),
        nqteprix varchar(12),
        cunite char(3),
        ntauxconv varchar(12),
        cnomliste varchar(20));

    procedure creer_preparation(
        inoprep integer,
        lprive smallint,
        cnomprep varchar(40));

    procedure creer_composant_preparation(
        inoprep integer,
        inoordre smallint,
        inochim integer,
        nqte varchar(12));
end
^

recreate package body pk_officine2
as
begin
    procedure creer_medecin(
        inomed integer,
        cmatricule varchar(8),
        cnom varchar(40),
        cadresse varchar(60),
        ccodepost varchar(10),
        clocalite varchar(60),
        ctelephone varchar(25),
        cfax varchar(25),
        cspec varchar(40),
        cpays varchar(30),
        cemail varchar(30),
        mremarque blob sub_type 1)
    as
    declare variable nom varchar(40);
    declare variable prenom varchar(40);
    declare variable nom_jf varchar(40);
    declare variable id_adresse integer;
    begin
        execute procedure pk_utilitaires.separer_nom_prenom(:cnom, ' ') returning_values :nom, :prenom, :nom_jf;

        id_adresse = pk_donnees_communes.creer_adresse(null, null, null, :cadresse, null, :ccodepost, :clocalite, :cpays,
            :ctelephone, null, :cfax, :cemail);

        insert into t_praticien(
            t_praticien_id,
            matricule,
            nom,
            prenom,
            t_adresse_id)
        values(
            :inomed,
            :cmatricule,
            :nom,
            :prenom,
            :id_adresse);
    end

    procedure creer_compte(
        inoclient integer,
        cnom varchar(30),
        cintitule varchar(50),
        cnomcontact varchar(50),
        cadresse_f varchar(60),
        ccp_f varchar(10),
        clocalite_f varchar(50),
        cadresse_l varchar(50),
        ccp_l varchar(10),
        clocalite_l varchar(60),
        ctelephone varchar(20),
        cfax varchar(20),
        cemail varchar(50),
        cgsm varchar(20),
        mnotes blob sub_type 1)
    as
    declare variable nomContact varchar(50);
    declare variable prenomContact varchar(50);
    declare variable njfContact varchar(50);
    declare variable idContact integer;
    declare variable idCompte integer;
    begin
        if (cnomcontact is not null and trim(cnomcontact) <> '') then
        begin
            -- Cr??ation Contact
            execute procedure pk_utilitaires.separer_nom_prenom(:cnomcontact)
                returning_values :nomContact, :prenomContact, :njfContact;

            idContact = pk_donnees_communes.creer_contact(nomContact, prenomContact,
                null, null, null, null, null, null, null, null, null, null);
        end

        insert into t_compte(t_compte_id,
            nom,
            intitule,
            t_contact_id)
        values(:inoclient,
            :cnomcontact,
            :cintitule,
            :idContact);

        -- Adresse de professionnelle
        pk_donnees_communes.creer_adresse(:inoclient, 1, 0, null, null, null, null, null,
            :ctelephone, :cgsm, :cfax, :cemail);

        -- Adresse de facturation
        pk_donnees_communes.creer_adresse(:inoclient, 1, 1, :cadresse_f, null, :ccp_f, :clocalite_f, null,
            null, null, null, null);

        -- Adresse de livraison
        pk_donnees_communes.creer_adresse(:inoclient, 1, 2, :cadresse_l, null, :ccp_l, :clocalite_l, null,
            null, null, null, null);

    end

    procedure creer_client(
        inopat integer,
        cmatricule varchar(13),
        lmatricule smallint,
        lcarteinvalide smallint,
        ltierspayant smallint,
        cnom varchar(30),
        cprenom varchar(25),
        cadresse varchar(60),
        ccodepost varchar(10),
        clocalite varchar(50),
        cpays varchar(30),
        ctelephone varchar(25),
        cgsm varchar(25),
        cfax varchar(25),
        cemail varchar(30),
        isexe integer,
        cchambre varchar(20),
        cadresse_f varchar(60),
        ccodepost_f varchar(10),
        clocalite_f varchar(50),
        cpays_f varchar(30),
        inoclient integer,
        inopatref integer,
        mremarque blob sub_type 1,
        tcreation date)
    as
    declare variable nom varchar(100);
    declare variable prenom varchar(100);
    declare variable njf varchar(100);
    declare variable id_clientRef integer;
    declare variable id_adresse integer;
    declare variable a smallint;
    declare variable m smallint;
    declare variable j smallint;
    declare variable matricule varchar(13);
    begin
        -- Séparation nom /prénom
        if (cprenom is null or trim(cprenom) = '') then
            execute procedure pk_utilitaires.separer_nom_prenom(cnom) returning_values :nom, :prenom, :njf;
        else
        begin
          nom = cnom;
          prenom = cprenom;
        end

        id_clientRef =
            case
                when inopatref <> 0 and inopatref <> inopat then inopatref
                else  null
            end;

        -- Vérification matricule
        matricule = trim(cmatricule);
        if ((matricule is not null) and (matricule <> '') and
             (matricule similar to '[[:DIGIT:]]{13}')) then
        begin
          a = substring(matricule from 1 for 4);
          m = substring(matricule from 5 for 2);
          j = substring(matricule from 7 for 2);
          if ((1 > a) or (1 > m) or (m > 12) or (1 > j) or (j > 31)) then
            matricule = null;
        end
        else
          matricule = null;

        insert into t_client(
            t_client_id,
            matricule,
            nom,
            prenom,
            sexe,
            chambre,
            date_derniere_visite,
            t_personne_referente_id)
        values(
            :inopat,
            :matricule,
            trim(:nom),
            trim(:prenom),
            :isexe,
            trim(:cchambre),
            :tcreation,
            :id_clientRef);

        insert into t_lux_client(
            t_client_id,
            carte_invalide,
            tiers_payant)
        values(
            :inopat,
            :lcarteinvalide = 1,
            :ltierspayant = 1);

        -- Adresse personnelle
        pk_donnees_communes.creer_adresse(:inopat, 0, 0, :cadresse, null, :ccodepost, :clocalite, :cpays,
            :ctelephone, :cgsm, :cfax, :cemail);

        -- Adresse de facturation
        pk_donnees_communes.creer_adresse(:inopat, 0, 1, :cadresse_f, null, :ccodepost_f, :clocalite_f, :cpays_f,
            null, null, null, null);

        if (inoclient <> 0) then
        begin
            insert into t_compte_client(t_compte_id,
                t_client_id)
            values(:inoclient,
                :inopat);

            -- Si le compte n'existe pas, on importe quand même
            when sqlcode -530 do
            begin

            end
        end
    end

    procedure creer_client_medecin(
        inopat integer,
        inomed integer)
    as
    begin
        insert into t_client_praticien(
            t_client_id,
            t_praticien_id)
        values(
            :inopat,
            :inomed);
    end

    procedure creer_grossiste(
        inogross integer,
        ldefault smallint,
        cnomgross varchar(20),
        cadresse varchar(60),
        ccp varchar(10),
        clocalite varchar(50),
        ctelephone varchar(25),
        cfax varchar(25),
        cgsm varchar(25),
        cemail varchar(60),
        cnomcontact varchar(50),
        inogrossmodem integer,
        mnotes blob sub_type 1)
    as
    declare variable idContact integer;
    declare variable nomContact varchar(50);
    declare variable prenomContact varchar(50);
    declare variable njfContact varchar(50);
    declare variable idAdresse integer;
    begin
        if ((trim(cnomcontact) is not null) and (trim(cnomcontact) <> '')) then
        begin
            -- Cr??ation Contact
            execute procedure pk_utilitaires.separer_nom_prenom(:cnomcontact)
            returning_values :nomContact, :prenomContact, :njfContact;

            idContact = pk_donnees_communes.creer_contact(nomContact, prenomContact,
                null, null, null, null, null, null, null, null, null, null);
        end

        -- Adresse
        idAdresse = pk_donnees_communes.creer_adresse(null, null, 2,
            :cadresse, null, :ccp, :clocalite, null, :ctelephone, :cgsm, :cfax, :cemail);

        insert into t_fournisseur(
            t_fournisseur_id,
            type_fournisseur,
            raison_sociale,
            t_adresse_id,
            t_contact_id)
        values(
            'GROSS_' || :inogross,
            1,
            trim(:cnomgross),
            :idAdresse,
            :idContact);

        insert into t_lux_fournisseur(
            t_fournisseur_id,
            type_modem,
            matricule)
        values(
            'GROSS_' || :inogross,
            :inogrossmodem,
            substring(:mnotes from 1 for 8));
    end

   procedure creer_code(
        id_produit integer,
        type_code smallint,
        code varchar(20))
    as
    begin
        if ((code is not null) and (trim(code) <> '') and (trim(code) <> '0')) then
            insert into t_produit_code(
                t_produit_id,
                type_code,
                code)
            values(
                :id_produit,
                trim(:type_code),
                iif(:type_code in (0, 1), lpad(trim(:code), 7, '0'), trim(:code)));
    end

    procedure creer_produit(
        inoref integer,
        inocefip integer,
        inonat integer,
        cbarcode varchar(13),
        cgtin varchar(13),
        cnom varchar(40),
        igrossiste integer,
        ybasermb varchar(12),
        ypxpublic varchar(12),
        ypxachat varchar(12),
        ypamp varchar(12),
        ntauxtva varchar(12),
        remarque blob sub_type 1,
        note blob sub_type 1,
        cetat varchar(2),
        lstup smallint,
        lcopie smallint,
        lderangt smallint,
        luniqstup smallint,
        lprogsubst smallint,
        catc1 varchar(7),
        catc2 varchar(7),
        catc3 varchar(7),
        catc4 varchar(7),
        ddernvte date,
        lgererstk smallint,
        istkrayon integer,
        ldblstk smallint,
        istkreserve integer,
        lrobot smallint,
        istkrobot integer,
        istkmin integer,
        iqtecde integer,
        ccatremb varchar(2),
        ntauxremb varchar(12),
        lsupprime smallint)
    as
    begin
        insert into t_produit(
            t_produit_id,
            code_reference,
            etat,
            liste,
            base_remboursement,
            prix_vente,
            prix_achat_catalogue,
            pamp,
            taux_tva,
            derniere_vente,
            classification,
            borne_mini,
            borne_maxi,
            t_repartiteur_id,
            commentaire_vente,
            commentaire_gestion,
            supprime)
        values(
            :inoref,
            lpad(:inocefip, 7, '0'),
            case
                when :cetat = '01' then 4
                when :cetat = '04' then 3
                when :cetat = '05' then 0
                when :cetat = '06' then 2
                when :cetat = '07' then 0
                when :cetat = '08' then 4
                when :cetat = '09' then 0
                when :cetat = '10' then 0
                when :cetat = '11' then 3
                when :cetat = '12' then 5
                when :cetat = '13' then 0
                when :cetat = '14' then 2
                when :cetat = '22' then 0
                when :cetat = '23' then 0
                when :cetat = '99' then 5
            else
                8
            end,
            iif(:lstup = 1, 3, 0),
            replace(:ybasermb, ',', '.'),
            replace(:ypxpublic, ',', '.'),
            replace(:ypxachat, ',', '.'),
            replace(:ypamp, ',', '.'),
            replace(:ntauxtva, ',', '.'),
            :ddernvte,
            :catc1,
            :istkmin,
            :istkmin + :iqtecde,
            iif(:igrossiste = 0, null, 'GROSS_' || :igrossiste),
            trim(:remarque),
            trim(:note),
            :lsupprime = 1);

        execute procedure pk_produit.creer_designation(:inoref, 'FR', :cnom);
        execute procedure creer_code(:inoref, 0, :inocefip);
        execute procedure creer_code(:inoref, 1, :inonat);
        execute procedure creer_code(:inoref, 2, :cbarcode);

        insert into t_lux_produit(
            t_produit_id,
            categorie_remboursement,
            taux_remboursement)
        values(
            :inoref,
            :ccatremb,
            replace(:ntauxremb, ',', '.'));

        -- Stock
        if (lgererstk = 1) then
        begin
            insert into t_stock(t_produit_id, t_depot_id, stock)
            values(:inoref, 'PHA', :istkrayon);

            if (ldblstk = 1) then
                insert into t_stock(t_produit_id, t_depot_id, stock)
                values(:inoref, 'RES', :istkreserve);

            if (lrobot = 1) then
                insert into t_stock(t_produit_id, t_depot_id, stock)
                values(:inoref, 'RBT', :istkrobot);
        end
    end

    procedure creer_info_produit_lux(
        inoref integer,
        lstup smallint,
        irefcde integer,
        iunitairestup integer,
        iequivstup integer,
        irefcns integer,
        iequivcns smallint,
        ypxinterv varchar(12),
        ypxoff varchar(12))
    as
    declare variable idProduit varchar(50);
    begin
        idProduit = cast(inoref as varchar(50));

		update or insert into t_lux_produit(
            t_produit_id,
            t_produit_a_commander_id,
            t_produit_unitaire_id,
            unites_stupefiant,
            t_produit_a_tarifer_cns_id,
            quantite_produit_a_tarifer_cns,
            prix_reference_cns,
            prix_intervention_cns)
        values(
            :idProduit,
            nullif(nullif(:irefcde, :inoref), 0),
            nullif(nullif(:iunitairestup, :inoref), 0),
            nullif(iif(:iunitairestup <> :inoref, :iequivstup, null), 0),
            nullif(nullif(:irefcns, :inoref), 0),
            iif(:irefcns <> :inoref, :iequivcns, null),
            iif(:irefcns <> :inoref, replace(:ypxoff, ',', '.'), null),
            iif(:irefcns <> :inoref, replace(:ypxinterv, ',', '.'), null))
        matching (t_produit_id);
    end

    procedure creer_date_peremption(
        inoref integer,
        dperemp date,
        iqte integer)
    as
    begin
        insert into t_produit_peremption(
            t_produit_id,
            peremption,
            quantite)
        values(
            :inoref,
            :dperemp,
            :iqte);
    end

    procedure creer_code_produit(
        inoref integer,
        ccode varchar(20))
    as
    begin
        execute procedure creer_code(:inoref, '2', trim(:ccode));
    end

    procedure creer_representant(
        inogpe integer,
        cnomgpe varchar(40))
    as
        declare variable nf varchar(40);
    begin
        /*
        if (cnomgpe similar to '[[:DIGIT:]]{8}%') then
            nf = trim(right(cnomgpe, char_length(cnomgpe) - 8));
        else
        */
            nf = trim(cnomgpe);

        insert into t_fournisseur(
            t_fournisseur_id,
            type_fournisseur,
            raison_sociale)
        values(
            'REP_' || :inogpe,
            2,
            :nf);

        /*
        insert into t_lux_fournisseur(
            t_fournisseur_id,
            matricule)
        values(
            'REP_' || :inogpe,
            substring(:cnomgpe from 1 for 8));
        */

        insert into t_catalogue(
            t_catalogue_id,
            t_fournisseur_id,
            libelle)
        values(
            :inogpe,
            'REP_' || :inogpe,
            :nf);
    end

    procedure creer_representant_produit(
        inogpe integer,
        inoref integer)
    as
        declare variable id_produit type of column t_produit.t_produit_id;
        declare variable pxa type of column t_produit.prix_achat_catalogue;
    begin
        id_produit = cast(inoref as type of column t_produit.t_produit_id);

        select prix_achat_catalogue
        from t_produit
        where t_produit_id = :id_produit
        into pxa;

        if (row_count = 0) then
            pxa = 0;

        insert into t_catalogue_ligne(
            t_catalogue_id,
            t_produit_id,
            prix_achat)
        values(
            :inogpe,
            :inoref,
            :pxa);
    end

    procedure creer_historique(
        inovente integer,
        inoord integer,
        inoemp integer,
        inopatient integer,
        inomedecin integer,
        ddateord date,
        tcreation date)
    as
    begin
        insert into t_histo_delivrance(
            t_histo_delivrance_id,
            t_client_id,
            numero_facture,
            operateur,
            t_praticien_id,
            prescription,
            delivrance)
        values(
            :inovente,
            nullif(:inopatient, 0),
            :inovente,
            :inoemp,
            nullif(:inomedecin, 0),
            :ddateord,
            :tcreation);
    end

    procedure creer_historique_ligne(
        inovente integer,
        inoref integer,
        iqte integer,
        ypxvendu varchar(12),
        ypxachat varchar(12),
        tcreation date)
    as
        declare variable idHV d_id_int;
        declare variable idProduit d_id_char;
        declare variable mois smallint;
        declare variable annee smallint;
    begin
        -- Ligne historique d??livrances
        insert into t_histo_delivrance_ligne(
            t_histo_delivrance_id,
            t_produit_id,
            quantite,
            prix_vente,
            prix_achat)
        values(
            :inovente,
            :inoref,
            :iqte,
            replace(:ypxvendu, ',', '.'),
            replace(:ypxachat, ',', '.'));

        -- Historique vente
        idProduit = cast(inoref as d_id_char);
        annee = extract(year from tcreation);
        mois = extract(month from tcreation);

        select t_historique_vente_id
        from t_historique_vente
        where t_produit_id = :idProduit
        and mois = :mois
        and annee = :annee
        into :idHV;

        if (row_count = 1) then
            update t_historique_vente
            set quantite_vendue = quantite_vendue + :iqte,
                nombre_ventes = nombre_ventes + 1
            where t_historique_vente_id = :idHV;
        else
            insert into t_historique_vente(
                t_produit_id,
                mois,
                annee,
                quantite_vendue,
                nombre_ventes)
            values(
                :idProduit,
                :mois,
                :annee,
                :iqte,
                1);
    end

    procedure creer_commande(
        inocde integer,
        inogross integer,
        tcreation date,
        montant_total varchar(12))
    as
    begin
        insert into t_commande(
            t_commande_id,
            t_fournisseur_id,
            date_commande,
            montant_ht,
            etat)
        values(
            :inocde,
            'GROSS_' || :inogross,
            :tcreation,
            coalesce(:montant_total, 0),
            3);
    end

    procedure creer_commande_ligne(
        inocde integer,
        inoref integer,
        iqte integer,
        irecu integer,
        iug integer,
        cnote varchar(60),
        drecep date,
        ypxremunit varchar(12),
        ypxunit varchar(12))
    as
        declare variable strIdProduit varchar(50);
        declare variable ftPrixAchatCat numeric(10,2);
        declare variable ftPrixVente numeric(10,2);
    begin
        strIdproduit = cast(inoref as varchar(50));

        select prix_achat_catalogue, prix_vente
        from t_produit
        where t_produit_id = :strIdproduit
        into :ftPrixAchatCat, :ftPrixVente;

        insert into t_ligne_commande(
            t_commande_id,
            t_produit_id,
            quantite_commandee,
            quantite_recue,
            unites_gratuites,
            prix_achat_catalogue,
            prix_achat_remise,
            prix_vente,
            reception_financiere,
            commentaire)
        values(
            :inocde,
            :inoref,
            :iqte,
            :irecu,
            :iug,
            coalesce(:ypxunit, :ftPrixAchatCat, 0),
            coalesce(:ypxremunit, :ftPrixAchatCat, 0),
            coalesce(:ftPrixVente, 0),
            :drecep is not null,
            :cnote);
    end

    procedure creer_chimique(
        inochim integer,
        cnomchim varchar(40),
        lsupp smallint,
        nprixbase varchar(12),
        nqteprix varchar(12),
        cunite char(3),
        ntauxconv varchar(12),
        cnomliste varchar(20))
    as
    begin
        insert into t_lux_chimique(
            t_lux_chimique_id,
            designation,
            supprime,
            prix_base,
            quantite_prix,
            unite,
            taux_conversion,
            liste)
        values(
            :inochim,
            trim(:cnomchim),
            :lsupp = 1,
            replace(:nprixbase, ',', '.'),
            replace(:nqteprix, ',', '.'),
            case :cunite
                when 'GR' then 1
                when 'CG' then 2
                when 'MG' then 3
                when 'DG' then 4
                when 'PCE' then 5
                when 'ML' then 6
                when 'L' then 7
                when 'DL' then 8
                when 'Cl' then 9
            end,
            replace(:ntauxconv, ',', '.'),
            trim(:cnomliste));
    end

    procedure creer_preparation(
        inoprep integer,
        lprive smallint,
        cnomprep varchar(40))
    as
    begin
        insert into t_lux_preparation(
            t_lux_preparation_id,
            prive,
            designation)
        values(
            :inoprep,
            :lprive = 1,
            trim(:cnomprep));
    end

    procedure creer_composant_preparation(
        inoprep integer,
        inoordre smallint,
        inochim integer,
        nqte varchar(12))
    as
    begin
        insert into t_lux_composant_preparation(
            t_lux_composant_preparation_id,
            t_lux_preparation_id,
            ordre,
            t_lux_chimique_id,
            quantite)
        values(
            next value for seq_lux_composant_preparation,
            :inoprep,
            :inoordre,
            :inochim,
            replace(:nqte, ',', '.'));
    end
end
^

set term ;^