-- Seed de plagas y enfermedades del fríjol en Colombia
INSERT INTO plaga (nombre_comun, nombre_cientifico, tipo, sintomas) VALUES
  (
    'Antracnosis',
    'Colletotrichum lindemuthianum',
    'enfermedad_fungica',
    'Manchas hundidas de color marrón oscuro con bordes rojizos en vainas, hojas y tallos. Principal enfermedad en zonas húmedas. Favorecida por temperaturas 13-26°C y humedad >80%.'
  ),
  (
    'Mancha angular',
    'Pseudocercospora griseola',
    'enfermedad_fungica',
    'Lesiones angulares limitadas por las nervaduras foliares, color grisáceo-marrón. Defoliación prematura en ataques severos. Presente en todo el ciclo del cultivo.'
  ),
  (
    'Roya del fríjol',
    'Uromyces appendiculatus',
    'enfermedad_fungica',
    'Pústulas de color café-rojizo en el envés de hojas. Las lesiones se rodean de un halo amarillo. Epidémicas en condiciones de alta humedad y temperaturas de 17-27°C.'
  ),
  (
    'Mosca blanca',
    'Bemisia tabaci',
    'plaga_insecto',
    'Adultos blancos pequeños que se agrupan en el envés foliar. Producen melaza que favorece fumagina. Pueden transmitir virus del mosaico dorado del fríjol (BGMV).'
  ),
  (
    'Trips',
    'Thrips palmi',
    'plaga_insecto',
    'Raspado y plateado de hojas jóvenes. Deformación de flores y vainas. Mayor incidencia en época seca. Afecta principalmente floración y llenado de vaina.'
  ),
  (
    'Lorito verde',
    'Empoasca kraemeri',
    'plaga_insecto',
    'Amarillamiento y encrespamiento de hojas (hopperburn). Las ninfas y adultos succionan savia del floema. Reducción significativa del rendimiento en infestaciones altas.'
  ),
  (
    'Pudrición radical',
    'Fusarium solani f. sp. phaseoli',
    'enfermedad_fungica',
    'Oscurecimiento y pudrición de raíces y base del tallo. Las plantas muestran enanismo, amarillamiento y marchitez. Favorecido por suelos compactados con mal drenaje.'
  )
ON CONFLICT DO NOTHING;
