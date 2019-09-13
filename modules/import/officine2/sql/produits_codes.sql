select distinct
  c.inoref,
  c.ccode
from
  d_codesart c
  inner join d_specialites s on s.inoref = c.inoref
where
  s.cbarcode <> c.ccode and
  right(trim(c.ccode), 1) not in ('R', 'N', 'C')