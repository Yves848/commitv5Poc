select r.inocde, r.inogross, r.tcreation, sum(rfd.ypxtot)
from d_recep r
inner join d_grossiste g on g.inogross = r.inogross
left join d_recep_fin_detail rfd on rfd.inocde = r.inocde
where r.lcomplet and
  r.tcreation > gomonth(date(), -24)
group by r.inocde, r.inogross, r.tcreation