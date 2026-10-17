'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { categories, mxn, finalPrice, STORE_NAME, type Product, type Category } from '@/lib/catalog'
import { ArrowLeft, Plus, Pencil, Trash2, X, Check, Loader2, Package, ShoppingBag, LayoutGrid } from 'lucide-react'
import { ProductForm } from './product-form'

type OrderRow = {
  id: string
  code: string
  customer_name: string
  customer_email: string
  customer_phone: string | null
  state: string | null
  city: string | null
  address: string | null
  payment_method: string
  status: string
  total: number
  created_at: string
  order_items: { id: string; product_name: string; quantity: number; unit_price: number; subtotal: number }[]
}

type Tab = 'products' | 'orders'

const ORDER_STATUSES = ['Entregado', 'Devuelto', 'Cancelado', 'En proceso'] as const

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>('products')
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<OrderRow[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Product | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)

  const loadProducts = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: true })
    if (data) setProducts(data as unknown as Product[])
    setLoading(false)
  }, [])

  const loadOrders = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('orders')
      .select('id, code, customer_name, customer_email, customer_phone, state, city, address, payment_method, status, total, created_at, order_items(id, product_name, quantity, unit_price, subtotal)')
      .order('created_at', { ascending: false })
      .limit(50)
    if (data) setOrders(data as unknown as OrderRow[])
    setLoading(false)
  }, [])

  useEffect(() => {
    if (tab === 'products') loadProducts()
    else loadOrders()
  }, [tab, loadProducts, loadOrders])

  const handleSave = async (data: Omit<Product, 'created_at'>) => {
    const { error } = await supabase.from('products').upsert({ ...data })
    if (error) throw error
    await loadProducts()
    setShowForm(false)
    setEditing(null)
  }

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) { alert('No se pudo eliminar. Puede que tenga pedidos asociados.'); return }
    await loadProducts()
  }

  const handleStatusChange = async (id: string, status: string) => {
    const { error } = await supabase.from('orders').update({ status }).eq('id', id)
    if (error) return
    setOrders(o => o.map(order => order.id === id ? { ...order, status } : order))
  }

  return <div className="admin-shell">
    <header className="admin-header">
      <div className="admin-brand"><span className="brand-mark">n</span><div><strong>{STORE_NAME} · Admin</strong><small>Panel de administración</small></div></div>
      <a href="/" className="admin-back"><ArrowLeft /> Volver a la tienda</a>
    </header>

    <nav className="admin-tabs">
      <button className={tab === 'products' ? 'active' : ''} onClick={() => setTab('products')}><LayoutGrid /> Productos</button>
      <button className={tab === 'orders' ? 'active' : ''} onClick={() => setTab('orders')}><Package /> Pedidos {orders.length > 0 && <b>{orders.length}</b>}</button>
    </nav>

    <main className="admin-main">
      {loading ? <div className="empty-state"><Loader2 className="spin" /><h2>Cargando…</h2></div> :
        tab === 'products' ? (
          <div className="admin-products">
            <div className="admin-section-head">
              <div><h1>Productos</h1><p>{products.length} productos en el catálogo</p></div>
              <button className="primary-button" onClick={() => { setEditing(null); setShowForm(true) }}><Plus /> Nuevo producto</button>
            </div>
            <div className="admin-table">
              <div className="admin-row admin-row-head">
                <span>Producto</span><span>Categoría</span><span>Precio</span><span>Desc.</span><span>Popular</span><span></span>
              </div>
              {products.map(p => (
                <div className="admin-row" key={p.id}>
                  <span className="admin-product-cell"><img src={p.image} alt="" /><div><strong>{p.name}</strong><small>{p.brand}</small></div></span>
                  <span>{p.category}</span>
                  <span>{mxn(finalPrice(p))}{p.discount > 0 && <s className="old-price"> {mxn(p.price)}</s>}</span>
                  <span>{p.discount > 0 ? `${p.discount}%` : '—'}</span>
                  <span>{p.popular ? <Check className="check-yes" /> : '—'}</span>
                  <span className="admin-row-actions">
                    <button onClick={() => { setEditing(p); setShowForm(true) }} aria-label={`Editar ${p.name}`}><Pencil /></button>
                    <button onClick={() => { if (confirm(`¿Eliminar "${p.name}"?`)) handleDelete(p.id) }} aria-label={`Eliminar ${p.name}`}><Trash2 /></button>
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="admin-orders">
            <div className="admin-section-head"><div><h1>Pedidos</h1><p>{orders.length} pedidos registrados</p></div></div>
            {orders.length === 0 ? <div className="empty-state"><ShoppingBag /><h2>Sin pedidos todavía</h2><p>Cuando los clientes confirmen compras, aparecerán aquí.</p></div> : (
              <div className="orders-list">
                {orders.map(o => {
                  const isOpen = expandedOrder === o.id
                  const desc = o.order_items.map(i => `${i.quantity} × ${i.product_name}`).join(' · ')
                  return <article className={`order-card admin-order ${isOpen ? 'open' : ''}`} key={o.id}>
                    <button className="admin-order-head" onClick={() => setExpandedOrder(isOpen ? null : o.id)}>
                      <div className="order-icon"><Package /></div>
                      <div className="admin-order-info">
                        <span className="eyebrow">{o.code} · {new Date(o.created_at).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                        <h3>{desc}</h3>
                        <span className="admin-order-meta">{o.customer_name} · {mxn(o.total)}</span>
                      </div>
                      <span className={`status ${o.status.toLowerCase().replace(/\s/g, '-')}`}>{o.status}</span>
                    </button>
                    {isOpen && <div className="admin-order-detail">
                      <div className="admin-order-grid">
                        <div><b>Cliente</b><p>{o.customer_name}</p><p>{o.customer_email}</p>{o.customer_phone && <p>{o.customer_phone}</p>}</div>
                        <div><b>Envío</b><p>{o.city || '—'}, {o.state || '—'}</p><p>{o.address || '—'}</p></div>
                        <div><b>Pago</b><p>{o.payment_method}</p></div>
                        <div className="admin-status-control"><b>Estado</b>
                          <select value={o.status} onChange={e => handleStatusChange(o.id, e.target.value)}>
                            {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>
                      </div>
                      <div className="admin-items">
                        <h4>Productos del pedido</h4>
                        {o.order_items.map(i => <div className="admin-item" key={i.id}>
                          <span>{i.quantity} × {i.product_name}</span>
                          <small>{mxn(i.unit_price)} c/u</small>
                          <strong>{mxn(i.subtotal)}</strong>
                        </div>)}
                        <div className="admin-item-total"><span>Total</span><strong>{mxn(o.total)}</strong></div>
                      </div>
                    </div>}
                  </article>
                })}
              </div>
            )}
          </div>
        )}
    </main>

    {showForm && <ProductForm product={editing} onClose={() => { setShowForm(false); setEditing(null) }} onSave={handleSave} />}
  </div>
}
