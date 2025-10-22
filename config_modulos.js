// Configuración de módulos del sistema
// Define la ruta, icono, color y orden de cada módulo

const CONFIG_MODULOS = {
  'Gestión De Usuarios Del Sistema': {
    ruta: '/GestionUsuarios',
    icono: 'FaUsers',
    color: '#66d4ff',
    orden: 1
  },
  'Registro De Entradas y Salidas De Vehículos': {
    ruta: '/vehiculos',
    icono: 'FaCar',
    color: '#66d4ff',
    orden: 2
  },
  'Cálculo Automático De Tarifas': {
    ruta: '/tarifas',
    icono: 'FaCalculator',
    color: '#66d4ff',
    orden: 5
  },
  'Generación De Tickets': {
    ruta: '/ticket',
    icono: 'FaReceipt',
    color: '#66d4ff',
    orden: 3
  },
  'Cobros Y Facturación': {
    ruta: '/facturacion',
    icono: 'FaFileInvoiceDollar',
    color: '#66d4ff',
    orden: 6
  },
  'Reportes Automáticos': {
    ruta: '/reportes',
    icono: 'FaChartPie',
    color: '#66d4ff',
    orden: 4
  }
};

/**
 * Enriquece un array de módulos con su configuración
 * @param {Array} modulos - Array de módulos desde la BD
 * @returns {Array} - Array de módulos enriquecidos y ordenados
 */
function enriquecerModulos(modulos) {
  return modulos
    .map(modulo => {
      const config = CONFIG_MODULOS[modulo.nombre_modulo] || {
        ruta: `/${modulo.nombre_modulo.toLowerCase()}`,
        icono: 'bx-cube',
        color: '#607D8B',
        orden: 999
      };
      
      return {
        id_modulo: modulo.id_modulo,
        nombre_modulo: modulo.nombre_modulo,
        ruta: config.ruta,
        icono: config.icono,
        color: config.color,
        orden: config.orden,
        tiene_acceso: modulo.tiene_acceso !== undefined ? modulo.tiene_acceso : true
      };
    })
    .sort((a, b) => a.orden - b.orden);
}

module.exports = { enriquecerModulos, CONFIG_MODULOS };
