select
  inovente,
  inoord,
  inoemp,
  inopatient,
  inomedecin,
  ddateord,
  tcreation
from
  d_vente
where
  tcreation > gomonth(date(), -24)
