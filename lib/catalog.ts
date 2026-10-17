export const STORE_NAME = 'Nexo';

export type Category = 'Electrónica' | 'Hogar' | 'Deportes' | 'Ropa' | 'Oficina' | 'Juguetes' | 'Despensa' | 'Belleza';
export type Discount = 0 | 5 | 10 | 15 | 20 | 30;
export type Product = { id: string; name: string; category: Category; brand: string; price: number; discount: Discount; image: string; description: string; popular?: boolean };

export const categories: { name: Category; icon: string; color: string }[] = [
  { name: 'Electrónica', icon: '⌁', color: 'coral' }, { name: 'Hogar', icon: '⌂', color: 'sage' },
  { name: 'Deportes', icon: '↗', color: 'blue' }, { name: 'Ropa', icon: '◇', color: 'mauve' },
  { name: 'Oficina', icon: '▤', color: 'amber' }, { name: 'Juguetes', icon: '✳', color: 'lavender' },
  { name: 'Despensa', icon: '＋', color: 'cream' }, { name: 'Belleza', icon: '✦', color: 'rose' },
];

export const citiesByState: Record<string, string[]> = { 'Ciudad de México':['Ciudad de México'], Jalisco:['Guadalajara','Zapopan','Puerto Vallarta'], 'Nuevo León':['Monterrey','San Pedro Garza García'], 'Baja California':['Tijuana'], Puebla:['Puebla'], Querétaro:['Querétaro'], Yucatán:['Mérida'], 'Quintana Roo':['Cancún'], Guanajuato:['León'], 'Estado de México':['Toluca','Naucalpan'], Chihuahua:['Ciudad Juárez'], Veracruz:['Veracruz'], Michoacán:['Morelia'], Aguascalientes:['Aguascalientes'], Sonora:['Hermosillo'] };
export const paymentMethods = ['Tarjeta de Crédito','Tarjeta de Débito','Efectivo','Transferencia','PayPal','Meses sin intereses'];
export const orderStatuses = ['Entregado','Devuelto','Cancelado'] as const;
export const mxn = (value:number) => value.toLocaleString('es-MX',{style:'currency',currency:'MXN',maximumFractionDigits:0});
export const finalPrice = (p:Product) => Math.round(p.price * (1 - p.discount / 100));
