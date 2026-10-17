export const STORE_NAME = 'Nexo';

export type Category = 'Electrónica' | 'Hogar' | 'Deportes' | 'Ropa' | 'Oficina' | 'Juguetes' | 'Despensa' | 'Belleza';
export type Discount = 0 | 5 | 10 | 15 | 20 | 30;
export type Product = { id: string; name: string; category: Category; brand: string; price: number; discount: Discount; image: string; description: string; popular?: boolean };

const img = (seed: string) => `https://images.unsplash.com/${seed}?auto=format&fit=crop&w=900&q=82`;

export const categories: { name: Category; icon: string; color: string }[] = [
  { name: 'Electrónica', icon: '⌁', color: 'coral' }, { name: 'Hogar', icon: '⌂', color: 'sage' },
  { name: 'Deportes', icon: '↗', color: 'blue' }, { name: 'Ropa', icon: '◇', color: 'mauve' },
  { name: 'Oficina', icon: '▤', color: 'amber' }, { name: 'Juguetes', icon: '✳', color: 'lavender' },
  { name: 'Despensa', icon: '＋', color: 'cream' }, { name: 'Belleza', icon: '✦', color: 'rose' },
];

export const products: Product[] = [
  { id:'nova-x', name:'Smartphone Nova X', category:'Electrónica', brand:'Nova', price:8999, discount:10, image:img('photo-1511707171634-5f897ff02aa9'), description:'Pantalla brillante, cámara versátil y batería para todo el día.', popular:true },
  { id:'aerobook', name:'Laptop AeroBook 14', category:'Electrónica', brand:'Aero', price:17999, discount:15, image:img('photo-1496181133206-80ce9b88a853'), description:'Potencia ligera para trabajar, crear y estudiar.', popular:true },
  { id:'audifonos', name:'Audífonos Bluetooth Pro', category:'Electrónica', brand:'Sonic', price:1499, discount:20, image:img('photo-1505740420928-5e560c06d30e'), description:'Cancelación de ruido y sonido envolvente en cada llamada.' },
  { id:'smartwatch', name:'Smartwatch Pulse', category:'Electrónica', brand:'Pulse', price:3299, discount:10, image:img('photo-1523275335684-37898b6baf30'), description:'Tu actividad, salud y notificaciones siempre a la mano.' },
  { id:'tablet', name:'Tablet Slate 10', category:'Electrónica', brand:'Slate', price:5499, discount:5, image:img('photo-1544244015-0df4b3ffc6b0'), description:'Entretenimiento y productividad en una pantalla cómoda.', popular:true },
  { id:'bocina', name:'Bocina Portátil Boom', category:'Electrónica', brand:'Sonic', price:999, discount:30, image:img('photo-1608043152269-423dbba4e7e1'), description:'Sonido potente para llevar a cualquier lugar.' },
  { id:'camara', name:'Cámara Web HD', category:'Electrónica', brand:'Visio', price:799, discount:0, image:img('photo-1587825140708-dfaf72ae4b04'), description:'Videollamadas claras para tu escritorio.' },
  { id:'monitor', name:'Monitor 27" QHD', category:'Electrónica', brand:'Visio', price:5999, discount:10, image:img('photo-1527443224154-c4a3942d3acf'), description:'Más espacio y detalle para crear y trabajar.', popular:true },
  { id:'licuadora', name:'Licuadora TurboMix', category:'Hogar', brand:'Nova', price:1299, discount:15, image:img('photo-1585515320310-259814833e62'), description:'Potencia práctica para tus recetas diarias.' },
  { id:'escritorio', name:'Escritorio Ajustable', category:'Oficina', brand:'Slate', price:5499, discount:20, image:img('photo-1518455027359-f3f8164ba6b7'), description:'Cambia de postura y trabaja con comodidad.' },
  { id:'tenis', name:'Tenis Urbanos', category:'Ropa', brand:'Aero', price:1499, discount:10, image:img('photo-1542291026-7eec264c27ff'), description:'Diseño cómodo para el ritmo de la ciudad.' },
  { id:'calcetas', name:'Calcetas Pack x6', category:'Ropa', brand:'Nova', price:199, discount:5, image:img('photo-1582966772680-860e372bb558'), description:'Básicos suaves para todos los días.' },
  { id:'dron', name:'Dron Mini Kids', category:'Juguetes', brand:'Visio', price:1299, discount:30, image:img('photo-1473968512647-3e447244af8f'), description:'Primeros vuelos llenos de aventura.' },
  { id:'bici', name:'Bicicleta Montaña R29', category:'Deportes', brand:'Pulse', price:7499, discount:15, image:img('photo-1485965120184-e220f721d03e'), description:'Lista para explorar caminos urbanos y de montaña.', popular:true },
  { id:'serum', name:'Serum Vitamina C', category:'Belleza', brand:'Nova', price:449, discount:20, image:img('photo-1556228578-8c89e6adf883'), description:'Rutina sencilla para una piel luminosa.' },
  { id:'impresora', name:'Impresora Multifunción', category:'Oficina', brand:'Visio', price:2899, discount:10, image:img('photo-1612815154858-60aa4c59eaa6'), description:'Imprime, escanea y copia desde casa.' },
  { id:'sarten', name:'Set de Sartenes 3 piezas', category:'Hogar', brand:'Slate', price:1199, discount:0, image:img('photo-1556911220-bff31c812dba'), description:'Cocina práctica con recubrimiento antiadherente.' },
  { id:'mochila', name:'Mochila Ejecutiva', category:'Oficina', brand:'Aero', price:899, discount:10, image:img('photo-1553062407-98eeb64c6a62'), description:'Organiza tu día con compartimentos inteligentes.' },
  { id:'cafe', name:'Café Molido Chiapas 500g', category:'Despensa', brand:'Nova', price:189, discount:5, image:img('photo-1495474472287-4d71bcdd2085'), description:'Aroma intenso para empezar bien la mañana.' },
  { id:'bloques', name:'Bloques Creativos 500 piezas', category:'Juguetes', brand:'Pulse', price:699, discount:20, image:img('photo-1587654780291-39c9404d746b'), description:'Construye ideas sin límite.' },
  { id:'tapete', name:'Tapete de Yoga', category:'Deportes', brand:'Pulse', price:499, discount:0, image:img('photo-1592432678016-e910b2a0d6c4'), description:'Soporte y agarre para tu práctica.' },
  { id:'lampara', name:'Lámpara de Escritorio', category:'Hogar', brand:'Visio', price:649, discount:15, image:img('photo-1507473885765-e6ed057f782c'), description:'Luz cálida y dirigida para tus espacios.' },
  { id:'shampoo', name:'Shampoo Reparación 700ml', category:'Belleza', brand:'Aero', price:229, discount:10, image:img('photo-1556229010-6c3f2c9ca5f8'), description:'Limpieza suave para cabello con movimiento.' },
  { id:'granola', name:'Granola Frutos Rojos 400g', category:'Despensa', brand:'Nova', price:159, discount:0, image:img('photo-1517093157656-b9eccef91cb1'), description:'Un snack crujiente para cualquier momento.' },
  { id:'camisa', name:'Camisa Oxford', category:'Ropa', brand:'Slate', price:799, discount:20, image:img('photo-1602810318383-e386cc2a3ccf'), description:'Un clásico que funciona de lunes a domingo.' },
  { id:'peluche', name:'Peluche Zorro Suave', category:'Juguetes', brand:'Nova', price:349, discount:30, image:img('photo-1559454403-b8fb88521f11'), description:'Compañía suave para pequeños exploradores.' },
  { id:'termo', name:'Termo Acero 750ml', category:'Deportes', brand:'Sonic', price:599, discount:5, image:img('photo-1602143407151-7111542de6e8'), description:'Mantén tu bebida a la temperatura ideal.' },
  { id:'toalla', name:'Juego de Toallas', category:'Hogar', brand:'Aero', price:899, discount:10, image:img('photo-1583845112203-454c1b4f51a5'), description:'Textura suave para renovar tu baño.' },
  { id:'proteina', name:'Proteína Vainilla 900g', category:'Despensa', brand:'Pulse', price:899, discount:15, image:img('photo-1593095948071-474c5cc2989d'), description:'Una opción práctica para complementar tu rutina.' },
  { id:'crema', name:'Crema Hidratante Facial', category:'Belleza', brand:'Sonic', price:389, discount:10, image:img('photo-1556228720-195a672e8a03'), description:'Hidratación ligera para todos los días.' },
  { id:'pantalon', name:'Pantalón Cargo', category:'Ropa', brand:'Pulse', price:999, discount:15, image:img('photo-1515886657613-9f3515b0c78f'), description:'Versatilidad y libertad de movimiento.' },
];

export const citiesByState: Record<string, string[]> = { 'Ciudad de México':['Ciudad de México'], Jalisco:['Guadalajara','Zapopan','Puerto Vallarta'], 'Nuevo León':['Monterrey','San Pedro Garza García'], 'Baja California':['Tijuana'], Puebla:['Puebla'], Querétaro:['Querétaro'], Yucatán:['Mérida'], 'Quintana Roo':['Cancún'], Guanajuato:['León'], 'Estado de México':['Toluca','Naucalpan'], Chihuahua:['Ciudad Juárez'], Veracruz:['Veracruz'], Michoacán:['Morelia'], Aguascalientes:['Aguascalientes'], Sonora:['Hermosillo'] };
export const paymentMethods = ['Tarjeta de Crédito','Tarjeta de Débito','Efectivo','Transferencia','PayPal','Meses sin intereses'];
export const orderStatuses = ['Entregado','Devuelto','Cancelado'] as const;
export const mxn = (value:number) => value.toLocaleString('es-MX',{style:'currency',currency:'MXN',maximumFractionDigits:0});
export const finalPrice = (p:Product) => Math.round(p.price * (1 - p.discount / 100));
