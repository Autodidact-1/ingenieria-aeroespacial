/* ============================================================
   data.js — Plan de estudios, rutas reales en disco, conceptos
   y biblioteca curada.  Ingeniería Aeroespacial · UNLP
   ------------------------------------------------------------
   `dir`  = ruta REAL de la carpeta relativa a la raíz del repo
            (incluye las erratas de nombre tal como están en disco).
   `areas`= áreas temáticas para el mapa inter-asignaturas.
   ============================================================ */

const SEMESTERS = [
  "Nivelación", "1° Semestre", "2° Semestre", "3° Semestre", "4° Semestre",
  "5° Semestre", "6° Semestre", "7° Semestre", "8° Semestre", "9° Semestre",
  "10° Semestre"
];

/* Ocho matices bien repartidos en la rueda de color. Antes había dos azules
   casi idénticos, dos ámbares y dos rojos: ocho áreas se leían como cuatro. */
const AREAS = {
  MAT: { label: "Matemática",            color: "#2F6BFF" },  // azul
  FIS: { label: "Física y Química",      color: "#00C2E8" },  // cian
  EST: { label: "Estructuras",           color: "#22C55E" },  // verde
  MAE: { label: "Materiales y Procesos", color: "#FFD400" },  // amarillo
  FLU: { label: "Fluidos y Aerodinámica",color: "#FF7A00" },  // naranja
  PRO: { label: "Propulsión",            color: "#FF1E3C" },  // rojo
  SIS: { label: "Sistemas y Control",    color: "#A855F7" },  // violeta
  GES: { label: "Gestión y Profesión",   color: "#FF37B0" }   // magenta
};

/* ============================================================
   Temas de color. Cada `id` corresponde a un bloque
   html[data-theme="..."] en index.html; `prev` son los colores
   que dibujan la miniatura del selector en Configuración.
   ============================================================ */
const THEMES = [
  { id:"win11", label:"Windows 11", note:"Gris Mica con el azul de acento del sistema", dark:true,
    prev:{ bg:"#191919", rail:"#141414", panel:"#1F1F1F", ink:"#FFFFFF", accent:"#0078D4", cb:"#2F80FF", tb:"#FF3B30" } },
  { id:"dark", label:"Papel nocturno", note:"El original: sepia oscuro y naranja", dark:true,
    prev:{ bg:"#252220", rail:"#221F1C", panel:"#2A2622", ink:"#EEE8DD", accent:"#E38358", cb:"#8CADD1", tb:"#9AC086" } },
  { id:"light", label:"Papel claro", note:"El mismo tono, sobre papel", dark:false,
    prev:{ bg:"#F5F1EA", rail:"#E6E0D5", panel:"#EFEAE1", ink:"#2A2620", accent:"#C25E33", cb:"#3E6E9E", tb:"#4E8A44" } },
  { id:"slate", label:"Hangar", note:"Gris acero, sobrio y neutro", dark:true,
    prev:{ bg:"#1E2124", rail:"#1A1D20", panel:"#232629", ink:"#E2E5E9", accent:"#7FB3D5", cb:"#7FB3D5", tb:"#8FC79A" } },
  { id:"midnight", label:"Vuelo nocturno", note:"Azul profundo de cabina a oscuras", dark:true,
    prev:{ bg:"#131A2B", rail:"#0F1523", panel:"#172032", ink:"#DCE3F0", accent:"#6C8CF5", cb:"#7FA9E8", tb:"#79C7A6" } },
  { id:"nebula", label:"Nebulosa", note:"Violeta con acentos magenta", dark:true,
    prev:{ bg:"#1A1524", rail:"#150F1E", panel:"#1F1A2C", ink:"#EBE3F5", accent:"#C77DFF", cb:"#7FC7E8", tb:"#86D9A8" } },
  { id:"cockpit", label:"Cabina", note:"Casi negro con ámbar de instrumento", dark:true,
    prev:{ bg:"#0F1110", rail:"#0A0C0B", panel:"#131614", ink:"#D8E0D6", accent:"#FFB020", cb:"#62C6C0", tb:"#7ED67E" } },
  { id:"forest", label:"Altímetro", note:"Verde profundo y menta", dark:true,
    prev:{ bg:"#14201C", rail:"#0F1915", panel:"#182420", ink:"#DFEAE3", accent:"#5FD3A3", cb:"#7FBBD9", tb:"#9AD98A" } },
  { id:"nordic", label:"Nórdico", note:"Paleta Nord, fría y suave", dark:true,
    prev:{ bg:"#2E3440", rail:"#272C36", panel:"#353B49", ink:"#ECEFF4", accent:"#88C0D0", cb:"#81A1C1", tb:"#A3BE8C" } },
  { id:"blueprint", label:"Plano técnico", note:"Azul de plano con ámbar", dark:true,
    prev:{ bg:"#0C2340", rail:"#081B31", panel:"#0F2A4A", ink:"#E6F1FF", accent:"#FFD166", cb:"#7FC8F8", tb:"#8FE0B0" } },
  { id:"solar-dark", label:"Solarizado oscuro", note:"Solarized dark, clásico de editores", dark:true,
    prev:{ bg:"#002B36", rail:"#00212B", panel:"#06303B", ink:"#D8D3C3", accent:"#CB4B16", cb:"#268BD2", tb:"#9BB300" } },
  { id:"solar-light", label:"Solarizado claro", note:"Solarized light, cálido y descansado", dark:false,
    prev:{ bg:"#FDF6E3", rail:"#EEE7D3", panel:"#F3ECD8", ink:"#073642", accent:"#CB4B16", cb:"#268BD2", tb:"#5F7A00" } },
  { id:"dawn", label:"Amanecer", note:"Claro y rosado, para leer de día", dark:false,
    prev:{ bg:"#FFF6F2", rail:"#F6E2D9", panel:"#FBEBE4", ink:"#3A2A26", accent:"#D4614A", cb:"#3E7CA8", tb:"#4E8A5B" } },
  { id:"contrast", label:"Alto contraste", note:"Negro puro, máxima legibilidad", dark:true,
    prev:{ bg:"#000000", rail:"#000000", panel:"#121212", ink:"#FFFFFF", accent:"#FFD400", cb:"#66C2FF", tb:"#6EE07A" } },
  { id:"crimson", label:"Carmesí", note:"Rojo y negro, elegante y agresivo", dark:true,
    prev:{ bg:"#0A0A0A", rail:"#060606", panel:"#141010", ink:"#F5F0ED", accent:"#DC143C", cb:"#4FC3F7", tb:"#66BB6A" } }
];

const SUBJECTS = [
  { code:"D1001", name:"Matemática para Ingeniería", type:"CB", sem:0, het:125, correlativasCursar:[], correlativasAprobar:[], area:"MAT",
    dir:"Asignaturas/Nivelacion/D1001 - matematica para ingenieria",
    concepts:["álgebra","trigonometría","funciones","geometría analítica"] },

  { code:"F1301", name:"Matemática A", type:"CB", sem:1, het:192, correlativasCursar:["D1001"], correlativasAprobar:["D1001"], area:"MAT",
    dir:"Asignaturas/1° Semestre/F1301 - matemarica a",
    concepts:["límite","derivada","integral","funciones de una variable"] },
  { code:"M1602", name:"Gráfica para Ingeniería", type:"CB", sem:1, het:96, correlativasCursar:[], correlativasAprobar:[], area:"MAE",
    dir:"Asignaturas/1° Semestre/M1602 - grafica para ingenieria",
    concepts:["proyecciones","CAD","normalización","tolerancias"] },
  { code:"A1101", name:"Introducción a la Ingeniería Aeroespacial", type:"CO", sem:1, het:48, correlativasCursar:[], correlativasAprobar:[], area:"GES",
    dir:"Asignaturas/1° Semestre/A1101 - introduccion a la ing aeroespacial",
    concepts:["historia aeronáutica","atmósfera","partes de la aeronave","misión"] },

  { code:"F1302", name:"Matemática B", type:"CB", sem:2, het:192, correlativasCursar:["F1301"], correlativasAprobar:["F1301"], area:"MAT",
    dir:"Asignaturas/2° Semestre/F1302 - matematica b",
    concepts:["álgebra lineal","matrices","integral múltiple","series"] },
  { code:"F1303", name:"Física I", type:"CB", sem:2, het:128, correlativasCursar:["F1301"], correlativasAprobar:["F1301"], area:"FIS",
    dir:"Asignaturas/2° Semestre/F1303 - fisica I",
    concepts:["cinemática","dinámica newtoniana","trabajo y energía","estática"] },
  { code:"U1901", name:"Química para Ingeniería", type:"CB", sem:2, het:96, correlativasCursar:[], correlativasAprobar:[], area:"FIS",
    dir:"Asignaturas/2° Semestre/U1901 - quimica para ingenieria",
    concepts:["enlace químico","estequiometría","termoquímica","corrosión"] },

  { code:"F1304", name:"Matemática C", type:"CB", sem:3, het:144, correlativasCursar:["F1302"], correlativasAprobar:["F1302"], area:"MAT",
    dir:"Asignaturas/3° Semestre/F1304 - matematica c",
    concepts:["ecuaciones diferenciales","cálculo vectorial","campos"] },
  { code:"F1305", name:"Física II", type:"CB", sem:3, het:128, correlativasCursar:["F1302","F1303"], correlativasAprobar:["F1302","F1303"], area:"FIS",
    dir:"Asignaturas/3° Semestre/F1305 - fisica II",
    concepts:["electromagnetismo","ondas","circuitos","óptica"] },
  { code:"F1315", name:"Probabilidades y Estadística", type:"CB", sem:3, het:96, correlativasCursar:["F1302"], correlativasAprobar:["F1302"], area:"MAT",
    dir:"Asignaturas/3° Semestre/F1315 - probabilidades estatadistica",
    concepts:["probabilidad","distribuciones","inferencia","regresión"] },

  { code:"F1306", name:"Matemática D", type:"CB", sem:4, het:96, correlativasCursar:["F1304"], correlativasAprobar:["F1304"], area:"MAT",
    dir:"Asignaturas/4° Semestre/F1306 - matematica d",
    concepts:["variable compleja","transformada de Fourier","Laplace","EDP"] },
  { code:"F1316", name:"Introducción a la Programación y Análisis Numérico", type:"CB", sem:4, het:80, correlativasCursar:["F1304"], correlativasAprobar:["F1304"], area:"SIS",
    dir:"Asignaturas/4° Semestre/F1316 - intro prog analisis numerico",
    concepts:["programación","métodos numéricos","interpolación","error numérico"] },
  { code:"C1151", name:"Estructuras I", type:"TB", sem:4, het:96, correlativasCursar:["F1303"], correlativasAprobar:["F1303"], area:"EST",
    dir:"Asignaturas/4° Semestre/C1151 - estructuras I",
    concepts:["estática","reticulados","diagramas de esfuerzos","equilibrio"] },
  { code:"M1603", name:"Materiales", type:"TB", sem:4, het:80, correlativasCursar:["U1901"], correlativasAprobar:["U1901"], area:"MAE",
    dir:"Asignaturas/4° Semestre/M1603 - materiales",
    concepts:["estructura cristalina","diagramas de fase","tratamientos térmicos","ensayos mecánicos"] },

  { code:"A1102", name:"Materiales Aeroespaciales", type:"TB", sem:5, het:40, correlativasCursar:["M1603"], correlativasAprobar:["M1603"], area:"MAE",
    dir:"Asignaturas/5° Semestre/A1102 - materiales aeroespaciales",
    concepts:["aleaciones de aluminio","composites","fatiga","titanio"] },
  { code:"A1006", name:"Ensayos no Destructivos", type:"TB", sem:5, het:40, correlativasCursar:["M1603","F1305"], correlativasAprobar:["M1603","F1305"], area:"MAE",
    dir:"Asignaturas/5° Semestre/A1006 - ensayos no destructivos",
    concepts:["ultrasonido","radiografía","líquidos penetrantes","detección de fisuras"] },
  { code:"M1604", name:"Termodinámica", type:"TB", sem:5, het:96, correlativasCursar:["F1302","F1303","U1901"], correlativasAprobar:["F1302","F1303","U1901"], area:"PRO",
    dir:"Asignaturas/5° Semestre/M160 - termodinamica",
    concepts:["primer principio","segundo principio","ciclos térmicos","gases ideales"] },
  { code:"C1153", name:"Estructuras II", type:"TB", sem:5, het:96, correlativasCursar:["C1151","F1302","M1603"], correlativasAprobar:["C1151","F1302","M1603"], area:"EST",
    dir:"Asignaturas/5° Semestre/C1153 - estructuras II",
    concepts:["tensión y deformación","flexión","torsión","pandeo"] },
  { code:"A1009", name:"Mecánica Racional", type:"TB", sem:5, het:96, correlativasCursar:["F1303","F1304"], correlativasAprobar:["F1303","F1304"], area:"FIS",
    dir:"Asignaturas/5° Semestre/A1009 - mecanica racional",
    concepts:["dinámica del rígido","Lagrange","vibraciones","cinemática espacial"] },

  { code:"A1010", name:"Electrotecnia y Sistemas Eléctricos de Aeronaves", type:"TB", sem:6, het:96, correlativasCursar:["F1304","F1305"], correlativasAprobar:["F1304","F1305"], area:"SIS",
    dir:"Asignaturas/6° Semestre/A1010 electrotecnia sistemas electronicos",
    concepts:["circuitos","máquinas eléctricas","electrónica","sistemas de a bordo"] },
  { code:"A1011", name:"Mecánica de los Fluidos I", type:"TB", sem:6, het:96, correlativasCursar:["F1306","F1316","M1604"], correlativasAprobar:["F1306","F1316","M1604"], area:"FLU",
    dir:"Asignaturas/6° Semestre/A1011 - mecanica fluidos I",
    concepts:["ecuación de Bernoulli","Navier-Stokes","capa límite","flujo potencial"] },
  { code:"A1016", name:"Mecanismos y Sistemas de Aeronaves", type:"TA", sem:6, het:96, correlativasCursar:["A1009","C1153","M1603"], correlativasAprobar:["A1009","C1153","M1603"], area:"SIS",
    dir:"Asignaturas/6° Semestre/A1016 - mecanismos sistemas",
    concepts:["mecanismos","transmisiones","sistemas hidráulicos","tren de aterrizaje"] },
  { code:"A1008", name:"Estructuras III", type:"TA", sem:6, het:96, correlativasCursar:["C1153","F1316"], correlativasAprobar:["C1153","F1316"], area:"EST",
    dir:"Asignaturas/6° Semestre/A1008 . estructuras III",
    concepts:["elementos finitos","matriz de rigidez","estructuras hiperestáticas","energía de deformación"] },
  { code:"DA200", name:"Actividad Formación Comp. I", type:"CO", sem:6, het:0, correlativasCursar:[], correlativasAprobar:[], req:10, area:"GES",
    dir:"Asignaturas/6° Semestre/DA200 - actividad formacion comp I", concepts:[] },

  { code:"A1013", name:"Estructuras IV", type:"TA", sem:7, het:80, correlativasCursar:["A1102","A1008"], correlativasAprobar:["A1102","A1008"], area:"EST",
    dir:"Asignaturas/7° Semestre/A1013 - estructuras IV",
    concepts:["estructuras aeronáuticas","semimonocasco","larguerillos","cargas de vuelo"] },
  { code:"A1015", name:"Mecánica de los Fluidos II", type:"TB", sem:7, het:96, correlativasCursar:["A1011","F1315"], correlativasAprobar:["A1011","F1315"], area:"FLU",
    dir:"Asignaturas/7° Semestre/A1015 - mecanica fluidos II",
    concepts:["flujo compresible","ondas de choque","turbulencia","toberas"] },
  { code:"A1012", name:"Sistemas Dinámicos", type:"TA", sem:7, het:80, correlativasCursar:["F1305","F1315","A1009","A1008"], correlativasAprobar:["F1305","F1315","A1009","A1008"], area:"SIS",
    dir:"Asignaturas/7° Semestre/A1012 - sistemas dinamicos",
    concepts:["espacio de estados","respuesta en frecuencia","estabilidad","vibraciones"] },
  { code:"P1752", name:"Economía para Ingenieros y Org. Industrial", type:"CO", sem:7, het:48, correlativasCursar:[], correlativasAprobar:[], req:15, area:"GES",
    dir:"Asignaturas/7° Semestre/P1752 - economia ingenieros",
    concepts:["costos","evaluación de proyectos","organización industrial"] },
  { code:"S0001", name:"Electiva Humanística", type:"CO", sem:7, het:48, correlativasCursar:[], correlativasAprobar:[], req:15, area:"GES",
    dir:"Asignaturas/7° Semestre/S0001 - electiva humanistica", concepts:[] },
  { code:"DA300", name:"Actividad Formación Comp. II", type:"CO", sem:7, het:0, correlativasCursar:["DA200"], correlativasAprobar:["DA200"], area:"GES",
    dir:"Asignaturas/7° Semestre/DA300 - actividad  formacion comp II", concepts:[] },

  { code:"A1017", name:"Motores a Reacción", type:"TA", sem:8, het:80, correlativasCursar:["A1015"], correlativasAprobar:["A1015"], area:"PRO",
    dir:"Asignaturas/8° Semestre/A1017 - motores reaccion",
    concepts:["ciclo Brayton","turbina","compresor","empuje"] },
  { code:"A1018", name:"Aerodinámica y Mecánica de Vuelo I", type:"TA", sem:8, het:96, correlativasCursar:["A1015","A1009"], correlativasAprobar:["A1015","A1009"], area:"FLU",
    dir:"Asignaturas/8° Semestre/A1018 - aerodinamica mecanica vuelo I",
    concepts:["perfil alar","sustentación","resistencia","performance de vuelo"] },
  { code:"A1019", name:"Procesos de Fabricación", type:"TA", sem:8, het:80, correlativasCursar:["A1102"], correlativasAprobar:["A1102"], area:"MAE",
    dir:"Asignaturas/8° Semestre/A1019 - procesos fabricacion",
    concepts:["mecanizado","conformado","uniones","fabricación de composites"] },
  { code:"A1014", name:"Estructuras V", type:"TA", sem:8, het:80, correlativasCursar:["A1013"], correlativasAprobar:["A1013"], area:"EST",
    dir:"Asignaturas/8° Semestre/A1014 - estructuras V",
    concepts:["aeroelasticidad","fatiga estructural","tolerancia al daño","damage tolerance"] },
  { code:"P1759", name:"Ingeniería Legal y Ejercicio Profesional", type:"CO", sem:8, het:48, correlativasCursar:[], correlativasAprobar:[], req:20, area:"GES",
    dir:"Asignaturas/8° Semestre/P1759 - ingenieria legal ejercicio profecional",
    concepts:["normativa","certificación","responsabilidad profesional"] },
  { code:"DA400", name:"Actividad Formación Comp. III", type:"CO", sem:8, het:0, correlativasCursar:["DA300"], correlativasAprobar:["DA300"], area:"GES",
    dir:"Asignaturas/8° Semestre/DA400 - actividad formacioncomp III", concepts:[] },

  { code:"A1020", name:"Motores Alternativos", type:"TA", sem:9, het:80, correlativasCursar:["A1012","A1016","M1604"], correlativasAprobar:["A1012","A1016","M1604"], area:"PRO",
    dir:"Asignaturas/9° Semestre/A1020 - motores alternativos",
    concepts:["ciclo Otto","hélices","refrigeración","combustión"] },
  { code:"A1022", name:"Aerodinámica y Mecánica de Vuelo II", type:"TA", sem:9, het:96, correlativasCursar:["A1018","A1012"], correlativasAprobar:["A1018","A1012"], area:"FLU",
    dir:"Asignaturas/9° Semestre/A1022 - aerodinamica mecanica vuelo II",
    concepts:["estabilidad y control","derivadas aerodinámicas","cualidades de vuelo","modos dinámicos"] },
  { code:"A1021", name:"Mediciones e Instrumentos de Aeronaves", type:"TA", sem:9, het:96, correlativasCursar:["A1010","A1016"], correlativasAprobar:["A1010","A1016"], area:"SIS",
    dir:"Asignaturas/9° Semestre/A1021 - mediciones instrumentos",
    concepts:["sensores","incertidumbre de medición","aviónica","adquisición de datos"] },
  { code:"A1028", name:"Aeropuertos y Operaciones de Vuelo", type:"TA", sem:9, het:96, correlativasCursar:["A1018","A1017"], correlativasAprobar:["A1018","A1017"], area:"GES",
    dir:"Asignaturas/9° Semestre/A1028 - aeropuertos operaciones vuelo",
    concepts:["operaciones","planificación de vuelo","infraestructura aeroportuaria","tránsito aéreo"] },
  { code:"DA500", name:"Actividad Formación Comp. IV", type:"CO", sem:9, het:0, correlativasCursar:["DA400"], correlativasAprobar:["DA400"], area:"GES",
    dir:"Asignaturas/9° Semestre/DA500 - actividades formacion comp IV", concepts:[] },

  { code:"A1023", name:"Control y Guiado", type:"TA", sem:10, het:80, correlativasCursar:["A1012","A1021"], correlativasAprobar:["A1012","A1021"], area:"SIS",
    dir:"Asignaturas/10° Semestre/A1023 - control guiado",
    concepts:["control automático","piloto automático","navegación","guiado"] },
  { code:"A1024", name:"Talleres y Mantenimiento Aeronáutico", type:"TA", sem:10, het:96, correlativasCursar:["A1022"], correlativasAprobar:["A1022"], req:30, area:"MAE",
    dir:"Asignaturas/10° Semestre/A2024 - talleres matenimiento",
    concepts:["mantenimiento","aeronavegabilidad","inspección","reparaciones"] },
  { code:"A1026", name:"Sistemas y Equipos de Aeronaves", type:"TA", sem:10, het:64, correlativasCursar:["A1022"], correlativasAprobar:["A1022"], area:"SIS",
    dir:"Asignaturas/10° Semestre/A1026 - sistemas equipos",
    concepts:["presurización","sistemas de combustible","ambiental","equipos de a bordo"] },
  { code:"A1025", name:"Optativa", type:"TA", sem:10, het:128, correlativasCursar:[], correlativasAprobar:[], req:30, area:"GES",
    dir:"Asignaturas/10° Semestre/A1025 - optativa", concepts:[] },
  { code:"DA600", name:"Actividad Formación Comp. V", type:"CO", sem:10, het:0, correlativasCursar:["DA500"], correlativasAprobar:["DA500"], area:"GES",
    dir:"Asignaturas/10° Semestre/DA600 -actividad formacion comp V", concepts:[] },
  { code:"A1034", name:"Práctica Profesional Supervisada (PPS)", type:"TA", sem:10, het:200, correlativasCursar:[], correlativasAprobar:[], req:30, area:"GES",
    dir:"Asignaturas/10° Semestre/A1034 - pps practica profesional supervisada", concepts:[] }
];

const TOTAL_HOURS = 3944;

/* Carpeta única donde viven los libros de toda la carrera.
   No es una asignatura: aparece aparte, arriba del árbol del Explorador. */
const LIBRARY_DIR = "Asignaturas/Libreria";

/* Subcarpetas estándar dentro de cada asignatura */
const SUBFOLDERS = [
  { key:"material", label:"material", hint:"Libros, PDF y fuentes LaTeX" },
  { key:"apuntes",  label:"apuntes",  hint:"Apuntes propios, Markdown y mapas" },
  { key:"practica", label:"practica", hint:"Ejercicios, TP y notebooks" }
];

/* ============================================================
   Biblioteca — recomendaciones curadas por área.
   ============================================================ */
const RECOMMENDED = [
  { area:"FLU", title:"Fundamentals of Aerodynamics", author:"John D. Anderson Jr.",
    note:"Referencia canónica para A1011/A1015/A1018. Cubre flujo incompresible y compresible.", codes:["A1011","A1015","A1018"] },
  { area:"FLU", title:"Aerodynamics for Engineering Students", author:"Houghton & Carpenter",
    note:"Complemento con enfoque británico, muy bueno para capa límite y perfiles.", codes:["A1011","A1018"] },
  { area:"FLU", title:"Viscous Fluid Flow", author:"Frank M. White",
    note:"Profundiza turbulencia y capa límite para Fluidos II.", codes:["A1015"] },
  { area:"FLU", title:"Flight Dynamics Principles", author:"Michael V. Cook",
    note:"Estabilidad y control con notación de espacio de estados; encaja con A1012.", codes:["A1022","A1012"] },
  { area:"FLU", title:"Introduction to Flight", author:"John D. Anderson Jr.",
    note:"Panorámica ideal para A1101 al inicio de la carrera.", codes:["A1101"] },

  { area:"EST", title:"Aircraft Structures for Engineering Students", author:"T.H.G. Megson",
    note:"El libro de cabecera de Estructuras IV y V: semimonocasco, cargas, aeroelasticidad.", codes:["A1013","A1014"] },
  { area:"EST", title:"Analysis and Design of Flight Vehicle Structures", author:"E.F. Bruhn",
    note:"Clásico de diseño estructural aeronáutico, muy usado en la industria.", codes:["A1013","A1014"] },
  { area:"EST", title:"Mechanics of Materials", author:"Ferdinand Beer & Russell Johnston",
    note:"Base sólida de tensiones y deformaciones para Estructuras I y II.", codes:["C1151","C1153"] },
  { area:"EST", title:"Concepts and Applications of Finite Element Analysis", author:"Cook, Malkus & Plesha",
    note:"Fundamento de elementos finitos para Estructuras III.", codes:["A1008"] },

  { area:"PRO", title:"Gas Turbine Theory", author:"Saravanamuttoo, Rogers & Cohen",
    note:"Ciclos y componentes de turbomáquinas para Motores a Reacción.", codes:["A1017"] },
  { area:"PRO", title:"Mechanics and Thermodynamics of Propulsion", author:"Hill & Peterson",
    note:"Une termodinámica y propulsión; cierra el puente M1604 → A1017.", codes:["A1017","M1604"] },
  { area:"PRO", title:"Internal Combustion Engine Fundamentals", author:"John B. Heywood",
    note:"Referencia para Motores Alternativos.", codes:["A1020"] },
  { area:"PRO", title:"Fundamentals of Engineering Thermodynamics", author:"Moran & Shapiro",
    note:"Termodinámica clásica con muchos problemas resueltos.", codes:["M1604"] },

  { area:"MAE", title:"Materials Science and Engineering: An Introduction", author:"William D. Callister",
    note:"Estándar para Materiales; estructura, fases y propiedades.", codes:["M1603"] },
  { area:"MAE", title:"Introduction to Aerospace Materials", author:"Adrian P. Mouritz",
    note:"Aleaciones y composites con foco aeroespacial.", codes:["A1102"] },
  { area:"MAE", title:"Manufacturing Engineering and Technology", author:"Kalpakjian & Schmid",
    note:"Procesos de fabricación con cobertura muy amplia.", codes:["A1019"] },
  { area:"MAE", title:"Nondestructive Evaluation: A Tool in Design, Manufacturing and Service", author:"Don E. Bray & Roderic Stanley",
    note:"Métodos de ensayo no destructivo aplicados.", codes:["A1006"] },

  { area:"SIS", title:"Modern Control Engineering", author:"Katsuhiko Ogata",
    note:"Control clásico y moderno; base de Sistemas Dinámicos y Control y Guiado.", codes:["A1012","A1023"] },
  { area:"SIS", title:"Feedback Systems: An Introduction for Scientists and Engineers", author:"Åström & Murray",
    note:"Disponible libre en la web del autor; excelente enfoque moderno.", codes:["A1012","A1023"] },
  { area:"SIS", title:"Aircraft Control and Simulation", author:"Stevens, Lewis & Johnson",
    note:"Modelado y simulación de aeronaves, ideal para el tramo final.", codes:["A1023","A1022"] },
  { area:"SIS", title:"Numerical Methods in Engineering with Python 3", author:"Jaan Kiusalaas",
    note:"Métodos numéricos implementados en Python; encaja con F1316 y con los notebooks.", codes:["F1316"] },

  { area:"MAT", title:"Cálculo", author:"James Stewart",
    note:"Cálculo de una y varias variables para Matemática A/B.", codes:["F1301","F1302"] },
  { area:"MAT", title:"Advanced Engineering Mathematics", author:"Erwin Kreyszig",
    note:"Cubre EDO, variable compleja y transformadas: Matemática C y D en un solo tomo.", codes:["F1304","F1306"] },
  { area:"MAT", title:"Álgebra Lineal y sus Aplicaciones", author:"David C. Lay",
    note:"Álgebra lineal con enfoque geométrico y aplicaciones.", codes:["F1302"] },
  { area:"MAT", title:"Probability and Statistics for Engineers and Scientists", author:"Walpole, Myers & Myers",
    note:"Probabilidad y estadística orientada a ingeniería.", codes:["F1315"] },

  { area:"FIS", title:"Física para Ciencias e Ingeniería", author:"Serway & Jewett",
    note:"Cubre Física I y II con abundante ejercitación.", codes:["F1303","F1305"] },
  { area:"FIS", title:"Classical Dynamics of Particles and Systems", author:"Thornton & Marion",
    note:"Mecánica lagrangiana y del rígido para Mecánica Racional.", codes:["A1009"] },
  { area:"FIS", title:"Química General", author:"Petrucci, Herring & Madura",
    note:"Base química para U1901.", codes:["U1901"] },

  { area:"GES", title:"Aircraft Design: A Conceptual Approach", author:"Daniel P. Raymer",
    note:"Integra todo el plan en el diseño conceptual; excelente para el TFG.", codes:["A1025","A1034"] },
  { area:"GES", title:"Ingeniería Económica", author:"Leland Blank & Anthony Tarquin",
    note:"Evaluación de proyectos para P1752.", codes:["P1752"] },
  { area:"GES", title:"Airport Engineering", author:"Norman Ashford & Paul Wright",
    note:"Planificación y diseño de aeropuertos.", codes:["A1028"] }
];

/* ============================================================
   Banco de autoevaluaciones — ejercicios de práctica por materia,
   distinto de un mazo de flashcards: acá van problemas más largos, sin
   repetición espaciada. Arranca vacío; se va cargando con el tiempo.
   Cuántas veces se acertó/falló y cuándo se practicó por última vez NO
   vive acá (es dato personal, mutable) — se guarda en el navegador,
   como el resto del progreso del alumno.
   { id, materiaId (código de SUBJECTS), enunciado, respuesta } —
   enunciado y respuesta admiten Markdown y LaTeX, igual que los apuntes.
   ============================================================ */
const QUESTIONS = [];

/* Extensiones que la interfaz sabe abrir */
const EXT_KIND = {
  pdf:"pdf", md:"md", markdown:"md", txt:"text", tex:"latex", bib:"text",
  ipynb:"notebook", html:"html", htm:"html", svg:"image", png:"image",
  jpg:"image", jpeg:"image", gif:"image", webp:"image",
  py:"code", m:"code", c:"code", cpp:"code", js:"code", json:"code",
  csv:"text", yml:"code", yaml:"code"
};
