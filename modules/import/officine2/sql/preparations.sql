select
  p.inoprep, p.lprive, np.cnomprep
from d_mag_prep p
  inner join d_mag_nomprep np on np.inoprep = p.inoprep and iordre = 1