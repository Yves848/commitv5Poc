select
  pc.inochim, nc.cnomchim, pc.lsupp, pc.nprixbase,
  pc.nqteprix, u.cunite, pc.ntauxconv,
  lc.cnomliste
from d_mag_produitchim pc
  inner join d_mag_listechim lc on lc.inoliste = pc.iliste
  inner join d_mag_nomchim nc on nc.inochim = pc.inochim and nc.iordre = 1
  inner join d_mag_unite u on u.iunite = pc.iuniteprix
