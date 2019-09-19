select r.inocde, lr.inoref, lr.iqte, lr.irecu, lr.iug, lr.cnote, rfd.drecep, rfd.ypxremunit, rfd.ypxunit
from d_lgnrecep lr
  left join d_recep r on r.inocde = lr.inocde
  left join d_grossiste g on g.inogross = r.inogross
  left join d_recep_fin_detail rfd on rfd.inocde = lr.inocde and rfd.inoref = lr.inoref
where g.inogross is not null and
  r.lcomplet and
  r.tcreation > gomonth(date(), -24)