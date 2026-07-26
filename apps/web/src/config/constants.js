export const APP_NAME = 'RoomIA';

export const SUPPORTED_CITIES = [
  'Ciudad de México', 'Madrid', 'Bogotá', 'Buenos Aires', 'Santiago', 'Lima', 'Medellín'
];

export const CITY_CURRENCY_MAP = {
  'Ciudad de México': { code: 'MXN', symbol: '$', name: 'Pesos Mexicanos', defaultRent: 14500, defaultDeposit: 14500, defaultUtilities: 1800, defaultFurniture: 6000, defaultCardBalance: 75000, hasDecimals: true },
  'Bogotá': { code: 'COP', symbol: '$', name: 'Pesos Colombianos', defaultRent: 2200000, defaultDeposit: 2200000, defaultUtilities: 250000, defaultFurniture: 800000, defaultCardBalance: 12500000, hasDecimals: false },
  'Madrid': { code: 'EUR', symbol: '€', name: 'Euros', defaultRent: 950, defaultDeposit: 950, defaultUtilities: 140, defaultFurniture: 450, defaultCardBalance: 4500, hasDecimals: true },
  'Buenos Aires': { code: 'ARS', symbol: '$', name: 'Pesos Argentinos', defaultRent: 450000, defaultDeposit: 450000, defaultUtilities: 35000, defaultFurniture: 150000, defaultCardBalance: 2400000, hasDecimals: false },
  'Santiago': { code: 'CLP', symbol: '$', name: 'Pesos Chilenos', defaultRent: 520000, defaultDeposit: 520000, defaultUtilities: 65000, defaultFurniture: 220000, defaultCardBalance: 2800000, hasDecimals: false },
  'Lima': { code: 'PEN', symbol: 'S/', name: 'Soles Peruanos', defaultRent: 2100, defaultDeposit: 2100, defaultUtilities: 280, defaultFurniture: 900, defaultCardBalance: 14000, hasDecimals: true },
  'Medellín': { code: 'COP', symbol: '$', name: 'Pesos Colombianos', defaultRent: 1900000, defaultDeposit: 1900000, defaultUtilities: 220000, defaultFurniture: 700000, defaultCardBalance: 10500000, hasDecimals: false }
};

export function getCityCurrency(city) {
  return CITY_CURRENCY_MAP[city] || { code: 'USD', symbol: '$', name: 'Dólares', defaultRent: 850, defaultDeposit: 850, defaultUtilities: 120, defaultFurniture: 400, defaultCardBalance: 4850, hasDecimals: true };
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

export const INITIAL_INGREDIENTS = [
  '3 Huevos', 'Pechuga de Pollo', 'Tomates', 'Arroz', 'Cebolla', 'Queso'
];

export const INITIAL_EXPENSES = [
  { id: 1, desc: 'Mercado Semanal del Hogar', amount: 180000, paidBy: 'Alex', date: 'Hoy' },
  { id: 2, desc: 'Servicio de Internet y Wifi', amount: 95000, paidBy: 'Sam', date: 'Ayer' }
];

export const INITIAL_TASKS = [
  { id: 1, title: 'Cocinar Cena de Bienvenida', assignee: 'Alex', freq: 'Semanal', status: 'done', completed: true },
  { id: 2, title: 'Lavar Platos y Alacena', assignee: 'Sam', freq: 'Diario', status: 'in_progress', completed: false },
  { id: 3, title: 'Surtir Refrigerador', assignee: 'Alex', freq: 'Semanal', status: 'todo', completed: false },
  { id: 4, title: 'Limpiar Sala y Áreas Comunes', assignee: 'Sam', freq: 'Quincenal', status: 'todo', completed: false }
];

export const INITIAL_DOCS = [
  { name: 'Contrato_Alquiler_CDMX.pdf', size: '1.2 MB', date: '2026-07-20' },
  { name: 'Comprobante_Servicios.pdf', size: '450 KB', date: '2026-07-22' }
];
