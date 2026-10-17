'use client'

import { useState } from 'react'
import { X, Loader2 } from 'lucide-react'
import { categories, type Product, type Category } from '@/lib/catalog'

type ProductFormProps = {
  product: Product | null
  onClose: () => void
  onSave: (data: Omit<Product, 'created_at'>) => Promise<void>
}

const EMPTY: Omit<Product, 'created_at'> = {
  id: '',
  name: '',
  category: 'Electrónica',
  brand: '',
  price: 0,
  discount: 0,
  image: '',
  description: '',
  popular: false,
}

export function ProductForm({ product, onClose, onSave }: ProductFormProps) {
  const editing = !!product
  const [form, setForm] = useState<Omit<Product, 'created_at'>>(product ? { ...product } : EMPTY)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const set = <K extends keyof typeof form>(key: K, value: typeof form[K]) =>
    setForm(f => ({ ...f, [key]: value }))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.id.trim() || !form.name.trim() || !form.brand.trim() || !form.image.trim()) {
      setError('Completa id, nombre, marca e imagen.')
      return
    }
    if (!editing && !/^[a-z0-9-]+$/.test(form.id)) {
      setError('El id solo puede tener minúsculas, números y guiones.')
      return
    }
    if (form.price < 0) { setError('El precio no puede ser negativo.'); return }
    setSaving(true); setError(null)
    try {
      await onSave({
        ...form,
        id: form.id.trim().toLowerCase(),
        price: Math.round(form.price),
        discount: Math.max(0, Math.min(80, form.discount)) as typeof form.discount,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo guardar el producto.')
      setSaving(false)
    }
  }

  return <div className="modal-overlay" onClick={onClose}>
    <div className="modal-card" onClick={e => e.stopPropagation()}>
      <header className="modal-head">
        <h2>{editing ? 'Editar producto' : 'Nuevo producto'}</h2>
        <button onClick={onClose} aria-label="Cerrar"><X /></button>
      </header>
      <form onSubmit={submit} className="modal-form">
        <div className="form-grid">
          <label className={editing ? 'disabled-field' : ''}>ID (slug)
            <input value={form.id} onChange={e => set('id', e.target.value)} disabled={editing} placeholder="ej: laptop-pro" />
            {editing && <small>No se puede cambiar el id.</small>}
          </label>
          <label>Nombre<input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Nombre del producto" /></label>
          <label>Categoría
            <select value={form.category} onChange={e => set('category', e.target.value as Category)}>
              {categories.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
            </select>
          </label>
          <label>Marca<input value={form.brand} onChange={e => set('brand', e.target.value)} placeholder="Marca" /></label>
          <label>Precio (MXN)<input type="number" min={0} value={form.price} onChange={e => set('price', Number(e.target.value))} /></label>
          <label>Descuento (%)<input type="number" min={0} max={80} value={form.discount} onChange={e => set('discount', Number(e.target.value) as typeof form.discount)} /></label>
          <label className="wide">URL de imagen<input value={form.image} onChange={e => set('image', e.target.value)} placeholder="https://…" /></label>
          <label className="wide">Descripción<textarea value={form.description} onChange={e => set('description', e.target.value)} rows={3} placeholder="Descripción del producto" /></label>
          <label className="check-label wide"><input type="checkbox" checked={form.popular ?? false} onChange={e => set('popular', e.target.checked)} /> Mostrar como "más vendido" en la página principal</label>
        </div>
        {error && <p className="form-error">{error}</p>}
        <div className="modal-actions">
          <button type="button" className="text-button" onClick={onClose} disabled={saving}>Cancelar</button>
          <button type="submit" className="primary-button" disabled={saving}>{saving ? <><Loader2 className="spin" /> Guardando…</> : 'Guardar producto'}</button>
        </div>
      </form>
    </div>
  </div>
}
