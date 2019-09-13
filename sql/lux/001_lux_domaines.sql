/********************************************************************/
/* Type Modem       :                                               */
/*  1 : Ne pas transmettre                                          */
/*  2 : CPL                                                         */
/*  3 : hanff                                                       */
/*  4 : Prost                                                       */
/*  5 : Pharma-Goedert                                              */
/********************************************************************/

create domain d_four_type_modem smallint
    check (value in (1, 2, 3, 4, 5));

/********************************************************************/
/* Unite            :                                               */
/*  1 : Gramme (GR)                                                 */
/*  2 : Centigramme (CG)                                            */
/*  3 : Milligramme (MG)                                            */
/*  4 : Decigramme (DG)                                             */
/*  5 : Pièce                                                       */
/*  6 : Millilitre (ML)                                             */
/*  7 : Litre (L)                                                   */
/*  8 : Decilitre (DL)                                              */
/*  9 : Centilitre (CL)                                             */
/********************************************************************/

create domain d_chimique_unite smallint
    check (value in (1, 2, 3, 4, 5, 6, 7, 8, 9));