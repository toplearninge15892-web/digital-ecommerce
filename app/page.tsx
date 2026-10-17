'use client'

import { useEffect, useMemo, useState, useCallback } from 'react'
import { Search, ShoppingBag, UserRound, ChevronRight, ArrowRight, SlidersHorizontal, X, Minus, Plus, Check, Package, Truck, RotateCcw, ShieldCheck, Loader2 } from 'lucide-react'
import { categories, citiesByState, finalPrice, mxn, paymentMethods, STORE_NAME, type Product, type Category } from '@/lib/catalog'
import { supabase } from '@/lib/supabase'

type View = 'home' | 'catalog' | 'product' | 'cart' | 'checkout' | 'confirmation' | 'orders'
type CartLine = { product: Product; quantity: number }

type OrderRow = {
  id: string
  code: string
  status: string
  total: number
  created_at: string
  order_items: { product_name: string; quantity: number }[]
}

function Header({ view, setView, cartCount }: { view: View; setView: (v: View) => void; cartCount: number }) {
  const [search, setSearch] = useState('')
  return <>
    <div className="topline">Envíos a todo México · Compra segura y fácil</div>
    <header className="site-header">
      <button className="brand" onClick={() => setView('home')} aria-label={`Ir a inicio de ${STORE_NAME}`}><span className="brand-mark">n</span><span>{STORE_NAME}</span></button>
      <div className="search-wrap"><Search aria-hidden="true" /><input value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') setView('catalog') }} placeholder="¿Qué estás buscando?" aria-label="Buscar productos" /><kbd>⌘ K</kbd></div>
      <nav className="header-actions" aria-label="Navegación principal"><button onClick={() => setView('orders')}><UserRound aria-hidden="true" /><span>Mis pedidos</span></button><button className="cart-action" onClick={() => setView('cart')}><ShoppingBag aria-hidden="true" /><span>Carrito</span>{cartCount > 0 && <b>{cartCount}</b>}</button></nav>
    </header>
    <nav className="category-nav" aria-label="Categorías"><button onClick={() => setView('catalog')}>Todo</button>{categories.slice(0, 6).map(c => <button key={c.name} onClick={() => setView('catalog')}>{c.name}</button>)}<button className="nav-sale" onClick={() => setView('catalog')}>Ofertas</button></nav>
  </>
}

function Price({ product, large = false }: { product: Product; large?: boolean }) { return <div className={large ? 'price price-large' : 'price'}>{product.discount > 0 && <span className="old-price">{mxn(product.price)}</span>}<strong>{mxn(finalPrice(product))}</strong>{product.discount > 0 && <span className="discount">-{product.discount}%</span>}</div> }

function ProductCard({ product, onOpen, onAdd }: { product: Product; onOpen: (p: Product) => void; onAdd: (p: Product) => void }) { return <article className="product-card"><button className="product-image" onClick={() => onOpen(product)}><img src={product.image} alt={product.name} loading="lazy" />{product.discount > 0 && <span className="discount-badge">-{product.discount}%</span>}</button><div className="product-info"><span className="eyebrow">{product.category} · {product.brand}</span><button className="product-name" onClick={() => onOpen(product)}>{product.name}</button><Price product={product} /><button className="add-button" onClick={() => onAdd(product)} aria-label={`Agregar ${product.name} al carrito`}><Plus aria-hidden="true" /></button></div></article> }

function Home({ products, onOpen, onAdd, setView }: { products: Product[]; onOpen: (p: Product) => void; onAdd: (p: Product) => void; setView: (v: View) => void }) { const popular = products.filter(p => p.popular); return <main>
  <section className="hero"><div className="hero-copy"><span className="pill">NUEVA TEMPORADA · HASTA 30% OFF</span><h1>Lo que buscas,<br /><em>más cerca.</em></h1><p>Encuentra productos para tu día a día, con precios claros y entrega en todo México.</p><button className="primary-button" onClick={() => setView('catalog')}>Explorar productos <ArrowRight data-icon="inline-end" /></button></div><div className="hero-art"><div className="sun-disc" /><div className="hero-card card-one"><span>Más vendido</span><strong>Laptop<br />AeroBook 14</strong><small>{products.length > 1 ? mxn(finalPrice(products[1])) : ''}</small></div><div className="hero-card card-two"><span>Envíos</span><strong>18 ciudades<br />de México</strong><Truck /></div><div className="hero-shape" /></div></section>
  <section className="trust-row"><div><ShieldCheck /><span><b>Compra segura</b><small>Pago protegido y simulado</small></span></div><div><Truck /><span><b>Entrega nacional</b><small>En 18 ciudades</small></span></div><div><RotateCcw /><span><b>Compra con calma</b><small>Consulta tus pedidos</small></span></div></section>
  <section className="section"><div className="section-heading"><div><span className="section-kicker">EXPLORA POR TEMA</span><h2>Encuentra tu próximo favorito</h2></div><button className="text-button" onClick={() => setView('catalog')}>Ver todo <ChevronRight /></button></div><div className="category-grid">{categories.map(c => <button className={`category-tile ${c.color}`} key={c.name} onClick={() => setView('catalog')}><span className="category-icon">{c.icon}</span><span>{c.name}</span><ChevronRight /></button>)}</div></section>
  <section className="section tinted"><div className="section-heading"><div><span className="section-kicker">SELECCIÓN NEXO</span><h2>Lo más vendido</h2></div><button className="text-button" onClick={() => setView('catalog')}>Ver catálogo <ChevronRight /></button></div><div className="product-grid">{popular.map(p => <ProductCard key={p.id} product={p} onOpen={onOpen} onAdd={onAdd} />)}</div></section>
  <section className="offer-banner"><div><span className="section-kicker">OPORTUNIDADES DEL DÍA</span><h2>Precios que se sienten bien.</h2><p>Descubre productos seleccionados con descuentos de hasta 30%.</p><button className="primary-button dark" onClick={() => setView('catalog')}>Ver ofertas <ArrowRight data-icon="inline-end" /></button></div><div className="offer-stack"><div className="offer-circle">30<span>%</span></div><span>descuento</span></div></section>
</main> }

function Catalog({ products, onOpen, onAdd }: { products: Product[]; onOpen: (p: Product) => void; onAdd: (p: Product) => void }) { const [query,setQuery]=useState(''); const [category,setCategory]=useState('Todas'); const [brand,setBrand]=useState('Todas'); const [discount,setDiscount]=useState(false); const [sort,setSort]=useState('Relevancia'); const brands=['Todas',...Array.from(new Set(products.map(p=>p.brand)))]; const filtered=useMemo(()=>products.filter(p=>(category==='Todas'||p.category===category)&&(brand==='Todas'||p.brand===brand)&&(!discount||p.discount>0)&&p.name.toLowerCase().includes(query.toLowerCase())).sort((a,b)=>sort==='Precio menor'?finalPrice(a)-finalPrice(b):sort==='Precio mayor'?finalPrice(b)-finalPrice(a):0),[query,category,brand,discount,sort,products]); return <main className="catalog-page"><div className="catalog-title"><div><span className="section-kicker">CATÁLOGO</span><h1>Todo para tu mundo</h1><p>{filtered.length} productos para descubrir</p></div><label className="sort">Ordenar por <select value={sort} onChange={e=>setSort(e.target.value)}><option>Relevancia</option><option>Precio menor</option><option>Precio mayor</option></select></label></div><div className="catalog-layout"><aside className="filters"><div className="filter-title"><b>Filtrar</b><SlidersHorizontal /></div><label>Buscar<input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Nombre de producto" /></label><label>Categoría<select value={category} onChange={e=>setCategory(e.target.value)}><option>Todas</option>{categories.map(c=><option key={c.name}>{c.name}</option>)}</select></label><label>Marca<select value={brand} onChange={e=>setBrand(e.target.value)}>{brands.map(b=><option key={b}>{b}</option>)}</select></label><label className="check-label"><input type="checkbox" checked={discount} onChange={e=>setDiscount(e.target.checked)} /> Solo con descuento</label><button className="clear-filters" onClick={()=>{setQuery('');setCategory('Todas');setBrand('Todas');setDiscount(false)}}>Limpiar filtros</button></aside><section className="catalog-results">{filtered.length===0?<div className="empty-state"><Search /><h2>No encontramos productos</h2><p>Prueba con otra búsqueda o limpia los filtros.</p></div>:<div className="product-grid">{filtered.map(p=><ProductCard key={p.id} product={p} onOpen={onOpen} onAdd={onAdd}/>)}</div>}</section></div></main> }

function ProductDetail({ product, onAdd, setView }: { product: Product; onAdd: (p:Product)=>void; setView:(v:View)=>void }) { return <main className="detail-page"><button className="back-button" onClick={()=>setView('catalog')}>← Volver al catálogo</button><div className="detail-layout"><div className="detail-image"><img src={product.image} alt={product.name}/></div><div className="detail-copy"><span className="section-kicker">{product.category} · {product.brand}</span><h1>{product.name}</h1><p className="detail-description">{product.description}</p><Price product={product} large/><p className="availability"><span /> Disponible para envío</p><button className="primary-button" onClick={()=>onAdd(product)}>Agregar al carrito <ShoppingBag data-icon="inline-end"/></button><div className="detail-notes"><div><Truck/><span><b>Entrega disponible</b><small>En 18 ciudades de México</small></span></div><div><ShieldCheck/><span><b>Compra segura</b><small>Pago simulado, sin cargos reales</small></span></div></div></div></div></main> }

function Cart({ cart, setCart, setView }: { cart: CartLine[]; setCart: React.Dispatch<React.SetStateAction<CartLine[]>>; setView:(v:View)=>void }) { const total=cart.reduce((s,l)=>s+finalPrice(l.product)*l.quantity,0); return <main className="cart-page"><div className="catalog-title"><div><span className="section-kicker">TU COMPRA</span><h1>Carrito</h1><p>{cart.length ? `${cart.reduce((s,l)=>s+l.quantity,0)} productos seleccionados` : 'Aún no agregas productos'}</p></div></div>{cart.length===0?<div className="empty-state cart-empty"><ShoppingBag/><h2>Tu carrito está esperando</h2><p>Agrega algo que te guste y aparecerá aquí.</p><button className="primary-button" onClick={()=>setView('catalog')}>Explorar productos</button></div>:<div className="cart-layout"><div className="cart-lines">{cart.map(line=><div className="cart-line" key={line.product.id}><img src={line.product.image} alt=""/><div><span className="eyebrow">{line.product.category}</span><h3>{line.product.name}</h3><Price product={line.product}/></div><div className="quantity"><button onClick={()=>setCart(c=>c.map(x=>x.product.id===line.product.id?{...x,quantity:Math.max(1,x.quantity-1)}:x))} aria-label="Reducir cantidad"><Minus/></button><span>{line.quantity}</span><button onClick={()=>setCart(c=>c.map(x=>x.product.id===line.product.id?{...x,quantity:x.quantity+1}:x))} aria-label="Aumentar cantidad"><Plus/></button></div><button className="remove" onClick={()=>setCart(c=>c.filter(x=>x.product.id!==line.product.id))} aria-label="Eliminar producto"><X/></button></div>)}</div><aside className="summary"><h2>Resumen</h2><div><span>Subtotal</span><strong>{mxn(total)}</strong></div><div><span>Envío</span><strong className="free">Gratis</strong></div><div className="summary-total"><span>Total</span><strong>{mxn(total)}</strong></div><button className="primary-button full" onClick={()=>setView('checkout')}>Continuar compra <ArrowRight data-icon="inline-end"/></button><button className="text-button" onClick={()=>setView('catalog')}>Seguir comprando</button></aside></div>}</main> }

function Checkout({ cart, setView, onConfirm }: { cart: CartLine[]; setView:(v:View)=>void; onConfirm:(info: CheckoutInfo)=>void }) {
  const [state,setState]=useState(''); const [name,setName]=useState(''); const [email,setEmail]=useState(''); const [phone,setPhone]=useState(''); const [city,setCity]=useState(''); const [address,setAddress]=useState(''); const [payment,setPayment]=useState(paymentMethods[0]); const [submitting,setSubmitting]=useState(false); const [error,setError]=useState<string|null>(null);
  const total=cart.reduce((s,l)=>s+finalPrice(l.product)*l.quantity,0); const cities=state?citiesByState[state]:[];
  const submit = async () => {
    if (!name || !email || cart.length === 0) { setError('Completa tu nombre y correo para continuar.'); return }
    setSubmitting(true); setError(null);
    try { await onConfirm({ name, email, phone, state, city, address, payment }); }
    catch (e) { setError(e instanceof Error ? e.message : 'No pudimos registrar tu pedido. Intenta de nuevo.'); setSubmitting(false); }
  }
  return <main className="checkout-page"><button className="back-button" onClick={()=>setView('cart')}>← Volver al carrito</button><div className="checkout-layout"><section><span className="section-kicker">ÚLTIMO PASO</span><h1>Completa tu compra</h1><div className="form-card"><h2>Datos de contacto</h2><div className="form-grid"><label>Nombre completo<input value={name} onChange={e=>setName(e.target.value)} placeholder="Tu nombre" /></label><label>Correo electrónico<input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="tu@correo.com" /></label><label>Teléfono<input type="tel" value={phone} onChange={e=>setPhone(e.target.value)} placeholder="10 dígitos" /></label><label>Estado<select value={state} onChange={e=>{setState(e.target.value);setCity('')}}><option value="">Selecciona un estado</option>{Object.keys(citiesByState).map(s=><option key={s}>{s}</option>)}</select></label><label>Ciudad<select disabled={!state} value={city} onChange={e=>setCity(e.target.value)}><option value="">{state?'Selecciona una ciudad':'Primero elige un estado'}</option>{cities.map(c=><option key={c} value={c}>{c}</option>)}</select></label><label className="wide">Dirección de entrega<input value={address} onChange={e=>setAddress(e.target.value)} placeholder="Calle, número y colonia" /></label></div></div><div className="form-card"><h2>Método de pago</h2><div className="payment-grid">{paymentMethods.map((method)=><label className="payment-option" key={method}><input type="radio" name="payment" checked={payment===method} onChange={()=>setPayment(method)}/><span>{method}</span></label>)}</div><p className="secure-note"><ShieldCheck/> Pago simulado · No se realizará ningún cargo real.</p></div>{error&&<p className="secure-note" style={{color:'#9a4e45'}}>{error}</p>}</section><aside className="summary checkout-summary"><h2>Tu pedido</h2>{cart.map(l=><div className="mini-line" key={l.product.id}><span>{l.quantity} × {l.product.name}</span><strong>{mxn(finalPrice(l.product)*l.quantity)}</strong></div>)}<div className="summary-total"><span>Total</span><strong>{mxn(total)}</strong></div><button className="primary-button full" onClick={submit} disabled={submitting}>{submitting ? 'Guardando…' : 'Confirmar pedido'}{!submitting && <Check data-icon="inline-end"/>}</button></aside></div></main>
}

type CheckoutInfo = { name: string; email: string; phone: string; state: string; city: string; address: string; payment: string }

function Orders({ setView, orders, loading }: { setView:(v:View)=>void; orders: OrderRow[]; loading: boolean }) {
  const fmtDate = (iso: string) => new Date(iso).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })
  return <main className="orders-page"><span className="section-kicker">HISTORIAL</span><h1>Mis pedidos</h1><p className="lead">Consulta el estado de tus compras recientes.</p><div className="orders-list">{loading ? <div className="empty-state"><Loader2 className="spin" /><h2>Cargando pedidos…</h2></div> : orders.length === 0 ? <div className="empty-state"><Package /><h2>Aún no tienes pedidos</h2><p>Cuando confirmes una compra, aparecerá aquí.</p></div> : orders.map(o => { const desc = o.order_items.map(i => `${i.quantity} × ${i.product_name}`).join(' · '); return <article className="order-card" key={o.id}><div className="order-icon"><Package/></div><div><span className="eyebrow">Pedido {o.code} · {fmtDate(o.created_at)}</span><h3>{desc}</h3><span className={`status ${o.status.toLowerCase()}`}>{o.status}</span></div><ChevronRight/></article> })}</div><button className="primary-button" onClick={()=>setView('catalog')}>Seguir comprando <ArrowRight data-icon="inline-end"/></button></main>
}

export default function Page() {
  const [view,setView]=useState<View>('home');
  const [selected,setSelected]=useState<Product|null>(null);
  const [cart,setCart]=useState<CartLine[]>([]);
  const [orderDone,setOrderDone]=useState<{code:string}|null>(null);
  const [products,setProducts]=useState<Product[]>([]);
  const [productsLoading,setProductsLoading]=useState(true);
  const [orders,setOrders]=useState<OrderRow[]>([]);
  const [ordersLoading,setOrdersLoading]=useState(false);

  useEffect(() => {
    let cancelled = false
    setProductsLoading(true)
    supabase.from('products').select('*').order('created_at', { ascending: true }).then(({ data, error }) => {
      if (cancelled) return
      if (error || !data || data.length === 0) { setProductsLoading(false); return }
      setProducts(data as unknown as Product[])
      setProductsLoading(false)
    })
    return () => { cancelled = true }
  }, [])

  const loadOrders = useCallback(async () => {
    setOrdersLoading(true)
    const { data, error } = await supabase
      .from('orders')
      .select('id, code, status, total, created_at, order_items(product_name, quantity)')
      .order('created_at', { ascending: false })
      .limit(20)
    if (!error && data) setOrders(data as unknown as OrderRow[])
    setOrdersLoading(false)
  }, [])

  useEffect(() => { if (view === 'orders') loadOrders() }, [view, loadOrders])

  const add=(p:Product)=>setCart(c=>{const found=c.find(x=>x.product.id===p.id); return found?c.map(x=>x.product.id===p.id?{...x,quantity:x.quantity+1}:x):[...c,{product:p,quantity:1}]});
  const open=(p:Product)=>{setSelected(p);setView('product')};

  const confirm = useCallback(async (info: CheckoutInfo) => {
    const total = cart.reduce((s,l)=>s+finalPrice(l.product)*l.quantity,0)
    const code = `NX-${Math.floor(1000+Math.random()*8999)}`
    const { data: order, error: orderError } = await supabase.from('orders').insert({
      code,
      customer_name: info.name,
      customer_email: info.email,
      customer_phone: info.phone || null,
      state: info.state || null,
      city: info.city || null,
      address: info.address || null,
      payment_method: info.payment,
      status: 'Entregado',
      total,
    }).select('id, code').single()
    if (orderError || !order) throw new Error('No pudimos registrar tu pedido. Intenta de nuevo.')
    const items = cart.map(l => ({
      order_id: order.id,
      product_id: l.product.id,
      product_name: l.product.name,
      unit_price: finalPrice(l.product),
      quantity: l.quantity,
      subtotal: finalPrice(l.product) * l.quantity,
    }))
    const { error: itemsError } = await supabase.from('order_items').insert(items)
    if (itemsError) throw new Error('Tu pedido fue creado pero no guardamos los productos. Escríbenos.')
    setCart([]); setOrderDone({ code: order.code }); setView('confirmation')
  }, [cart])

  return <><Header view={view} setView={setView} cartCount={cart.reduce((s,l)=>s+l.quantity,0)}/>
    {productsLoading ? <main className="orders-page"><div className="empty-state"><Loader2 className="spin" /><h2>Cargando productos…</h2></div></main>
    : view==='home' && <Home products={products} onOpen={open} onAdd={add} setView={setView}/>}
    {view==='catalog' && <Catalog products={products} onOpen={open} onAdd={add}/>}
    {view==='product' && selected && <ProductDetail product={selected} onAdd={add} setView={setView}/>}
    {view==='cart' && <Cart cart={cart} setCart={setCart} setView={setView}/>}
    {view==='checkout' && <Checkout cart={cart} setView={setView} onConfirm={confirm}/>}
    {view==='orders' && <Orders setView={setView} orders={orders} loading={ordersLoading}/>}
    {view==='confirmation' && orderDone && <main className="confirmation"><div className="success-mark"><Check/></div><span className="section-kicker">PEDIDO CONFIRMADO</span><h1>Gracias por tu compra.</h1><p>Tu pedido ha sido registrado correctamente. En esta demo, el pago es simulado.</p><div className="confirmation-id">Número de pedido <strong>{orderDone.code}</strong></div><button className="primary-button" onClick={()=>setView('orders')}>Ver mis pedidos <ArrowRight data-icon="inline-end"/></button><button className="text-button" onClick={()=>setView('home')}>Volver al inicio</button></main>}
    <footer><div className="brand"><span className="brand-mark">n</span>{STORE_NAME}</div><p>Una tienda demo para tu sistema comercial.</p><span>© 2026 · Hecho para comprar mejor.</span></footer>
  </>
}
