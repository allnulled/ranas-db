# Actualizaciones de cada versión de RanasDB:



# 2.0.0

  - Cambiados los parámetros de creación o del constructor, pasan de:
    - List&lt;Store&gt;
  ...a:
    - List&lt;List&lt;Store,UpgradeFunction&gt;&gt;
  Esto rompe con la compatibilidad con la versión anterior 1.

# 1.0.2

  - Cambiados campos 'static { prop } =' por 'static get ...' que lo entienda webpack desde el npm.

# 1.0.1

  - Añadido campo 'browser' en 'package.json' para poder importar desde 'import ... from ...'.