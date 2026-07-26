export const APP_NAME = 'RoomIA';

export const SUPPORTED_CITIES = [
  'Ciudad de México', 'Madrid', 'Bogotá', 'Buenos Aires', 'Santiago', 'Lima', 'Medellín'
];

export const CITY_CURRENCY_MAP = {
  'Ciudad de México': { code: 'MXN', symbol: '$', name: 'Pesos Mexicanos', defaultRent: 14500, defaultDeposit: 14500, defaultUtilities: 1800, defaultFurniture: 6000, defaultCardBalance: 75000 },
  'Bogotá': { code: 'COP', symbol: '$', name: 'Pesos Colombianos', defaultRent: 2200000, defaultDeposit: 2200000, defaultUtilities: 250000, defaultFurniture: 800000, defaultCardBalance: 12500000 },
  'Madrid': { code: 'EUR', symbol: '€', name: 'Euros', defaultRent: 950, defaultDeposit: 950, defaultUtilities: 140, defaultFurniture: 450, defaultCardBalance: 4500 },
  'Buenos Aires': { code: 'ARS', symbol: '$', name: 'Pesos Argentinos', defaultRent: 450000, defaultDeposit: 450000, defaultUtilities: 35000, defaultFurniture: 150000, defaultCardBalance: 2400000 },
  'Santiago': { code: 'CLP', symbol: '$', name: 'Pesos Chilenos', defaultRent: 520000, defaultDeposit: 520000, defaultUtilities: 65000, defaultFurniture: 220000, defaultCardBalance: 2800000 },
  'Lima': { code: 'PEN', symbol: 'S/', name: 'Soles Peruanos', defaultRent: 2100, defaultDeposit: 2100, defaultUtilities: 280, defaultFurniture: 900, defaultCardBalance: 14000 },
  'Medellín': { code: 'COP', symbol: '$', name: 'Pesos Colombianos', defaultRent: 1900000, defaultDeposit: 1900000, defaultUtilities: 220000, defaultFurniture: 700000, defaultCardBalance: 10500000 }
};

export function getCityCurrency(city) {
  return CITY_CURRENCY_MAP[city] || { code: 'USD', symbol: '$', name: 'Dólares', defaultRent: 850, defaultDeposit: 850, defaultUtilities: 120, defaultFurniture: 400, defaultCardBalance: 4850 };
}

export const INITIAL_INGREDIENTS = [
  '3 Huevos', 'Pechuga de Pollo', 'Tomates', 'Arroz', 'Cebolla', 'Queso'
];

export const INITIAL_EXPENSES = [
  { id: 1, desc: 'Supermercado Inicial', amount: 185.50, paidBy: 'Alex', date: 'Hoy' },
  { id: 2, desc: 'Pago de Internet y Wifi', amount: 45.00, paidBy: 'Roomie', date: 'Ayer' }
];

export const INITIAL_TASKS = [
  { id: 1, title: 'Cocinar Cena de Bienvenida', assignee: 'Alex', freq: 'Semanal', completed: true },
  { id: 2, title: 'Lavar Platos y Alacena', assignee: 'Roomie', freq: 'Diario', completed: false },
  { id: 3, title: 'Surtir Refrigerador', assignee: 'Alex', freq: 'Semanal', completed: false },
  { id: 4, title: 'Limpiar Sala y Áreas Comunes', assignee: 'Roomie', freq: 'Quincenal', completed: true }
];

export const INITIAL_DOCS = [
  { name: 'Contrato_Alquiler_CDMX.pdf', size: '1.2 MB', date: '2026-07-20' },
  { name: 'Comprobante_Servicios.pdf', size: '450 KB', date: '2026-07-22' }
];
