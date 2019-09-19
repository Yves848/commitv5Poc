select
  l.inovente,
  l.inoref,
  l.iqte,
  l.ypxvendu,
  l.ypxachat,
  l.tcreation
from
  d_lgnvente l
  inner join d_vente v on v.inovente = l.inovente
where
  v.tcreation > gomonth(date(), -24)