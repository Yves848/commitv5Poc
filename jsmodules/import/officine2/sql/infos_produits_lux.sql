select
  s.inoref,
  s.lstup, s.irefcde, s.iunitairestup, s.iequivstup,
  s.irefcns, s.iequivcns, s.ypxinterv, s.ypxoff
from
  d_specialites s
where
  s.lstup or s.irefcns <> s.inoref