export const APP_NAME = 'RoomIA';

export const SUPPORTED_CITIES = [
  'Ciudad de México', 'Madrid', 'Bogotá', 'Buenos Aires', 'Santiago', 'Lima', 'Medellín'
];

export const CITY_CURRENCY_MAP = {
  'Ciudad de México': {
    code: 'MXN', symbol: '$', name: 'Pesos Mexicanos', defaultRent: 14500, defaultDeposit: 14500, defaultUtilities: 1800, defaultFurniture: 6000, defaultCardBalance: 75000, hasDecimals: true,
    emergencies: [{ name: 'Emergencias / Policía', number: '911' }, { name: 'Locatel / Asistencia', number: '55 5658 1111' }, { name: 'Bomberos', number: '55 5768 3700' }]
  },
  'Bogotá': {
    code: 'COP', symbol: '$', name: 'Pesos Colombianos', defaultRent: 2200000, defaultDeposit: 2200000, defaultUtilities: 250000, defaultFurniture: 800000, defaultCardBalance: 12500000, hasDecimals: false,
    emergencies: [{ name: 'Línea Única de Emergencias', number: '123' }, { name: 'Ambulancia Médica', number: '125' }, { name: 'Bomberos Bogotá', number: '119' }]
  },
  'Madrid': {
    code: 'EUR', symbol: '€', name: 'Euros', defaultRent: 950, defaultDeposit: 950, defaultUtilities: 140, defaultFurniture: 450, defaultCardBalance: 4500, hasDecimals: true,
    emergencies: [{ name: 'Emergencias UE', number: '112' }, { name: 'Policía Nacional', number: '091' }, { name: 'Urgencias Médicas (SUMMA)', number: '061' }]
  },
  'Buenos Aires': {
    code: 'ARS', symbol: '$', name: 'Pesos Argentinos', defaultRent: 450000, defaultDeposit: 450000, defaultUtilities: 35000, defaultFurniture: 150000, defaultCardBalance: 2400000, hasDecimals: false,
    emergencies: [{ name: 'Emergencias Policiales', number: '911' }, { name: 'SAME Ambulancia', number: '107' }, { name: 'Bomberos', number: '100' }]
  },
  'Santiago': {
    code: 'CLP', symbol: '$', name: 'Pesos Chilenos', defaultRent: 520000, defaultDeposit: 520000, defaultUtilities: 65000, defaultFurniture: 220000, defaultCardBalance: 2800000, hasDecimals: false,
    emergencies: [{ name: 'Carabineros de Chile', number: '133' }, { name: 'SAMU Ambulancia', number: '131' }, { name: 'Bomberos de Chile', number: '132' }]
  },
  'Lima': {
    code: 'PEN', symbol: 'S/', name: 'Soles Peruanos', defaultRent: 2100, defaultDeposit: 2100, defaultUtilities: 280, defaultFurniture: 900, defaultCardBalance: 14000, hasDecimals: true,
    emergencies: [{ name: 'Policía Nacional del Perú', number: '105' }, { name: 'SAMU Ambulancia', number: '106' }, { name: 'Bomberos Voluntarios', number: '116' }]
  },
  'Medellín': {
    code: 'COP', symbol: '$', name: 'Pesos Colombianos', defaultRent: 1900000, defaultDeposit: 1900000, defaultUtilities: 220000, defaultFurniture: 700000, defaultCardBalance: 10500000, hasDecimals: false,
    emergencies: [{ name: 'Línea de Emergencia Medellín', number: '123' }, { name: 'Ambulancia / Salud', number: '125' }, { name: 'Bomberos Medellín', number: '119' }]
  }
};

export function getCityCurrency(city) {
  return CITY_CURRENCY_MAP[city] || {
    code: 'USD', symbol: '$', name: 'Dólares', defaultRent: 850, defaultDeposit: 850, defaultUtilities: 120, defaultFurniture: 400, defaultCardBalance: 4850, hasDecimals: true,
    emergencies: [{ name: 'Emergencias Generales', number: '911' }, { name: 'Ambulancia', number: '911' }]
  };
}

export function formatMoney(amount, currencyCode) {
  const num = Number(amount) || 0;
  const noDecimalCurrencies = ['COP', 'CLP', 'ARS'];
  const isIntegerOnly = noDecimalCurrencies.includes(currencyCode);

  if (isIntegerOnly) {
    return Math.round(num).toLocaleString('es-CO');
  }

  return num.toLocaleString('es-ES', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

export const INITIAL_INGREDIENTS = [];
export const INITIAL_EXPENSES = [];
export const INITIAL_TASKS = [];
export const INITIAL_DOCS = [];
