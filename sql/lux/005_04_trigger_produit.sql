set sql dialect 3;
set term ^;

create or alter trigger tr_produit_info_lux
active before insert or update
on t_lux_produit
as
begin
   if (not exists(select null from t_produit where t_produit_id = new.t_produit_unitaire_id)) then
     new.t_produit_unitaire_id = null;
end
^

set term ;^
