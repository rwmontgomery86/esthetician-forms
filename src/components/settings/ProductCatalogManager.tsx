import { useState } from 'react'
import { cn } from '../../utils/cn'
import { Button } from '../ui/Button'
import { useSettingsStore } from '../../stores/settings-store'

export function ProductCatalogManager() {
  const catalog = useSettingsStore((s) => s.settings.productCatalog)
  const addCategory = useSettingsStore((s) => s.addCategory)
  const removeCategory = useSettingsStore((s) => s.removeCategory)
  const renameCategory = useSettingsStore((s) => s.renameCategory)
  const addProduct = useSettingsStore((s) => s.addProduct)
  const removeProduct = useSettingsStore((s) => s.removeProduct)
  const updateProduct = useSettingsStore((s) => s.updateProduct)

  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [newProductName, setNewProductName] = useState<Record<string, string>>({})
  const [editingCatId, setEditingCatId] = useState<string | null>(null)
  const [editCatValue, setEditCatValue] = useState('')
  const [editingProductKey, setEditingProductKey] = useState<string | null>(null)
  const [editProductValue, setEditProductValue] = useState('')

  function handleAddCategory() {
    const trimmed = newCategoryName.trim()
    if (!trimmed) return
    addCategory(trimmed)
    setNewCategoryName('')
  }

  function handleAddProduct(categoryId: string) {
    const name = (newProductName[categoryId] || '').trim()
    if (!name) return
    addProduct(categoryId, name)
    setNewProductName((prev) => ({ ...prev, [categoryId]: '' }))
  }

  function startEditCategory(id: string, name: string) {
    setEditingCatId(id)
    setEditCatValue(name)
  }

  function saveEditCategory() {
    if (editingCatId && editCatValue.trim()) {
      renameCategory(editingCatId, editCatValue.trim())
    }
    setEditingCatId(null)
  }

  function startEditProduct(catId: string, productId: string, name: string) {
    setEditingProductKey(`${catId}-${productId}`)
    setEditProductValue(name)
  }

  function saveEditProduct(catId: string, productId: string) {
    if (editProductValue.trim()) {
      updateProduct(catId, productId, editProductValue.trim())
    }
    setEditingProductKey(null)
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">
        Product Catalog
      </h3>
      <p className="text-xs text-text-muted">
        Organize products by category. These appear in the Skincare Routine form dropdowns.
      </p>

      <div className="flex gap-2">
        <input
          type="text"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
          placeholder="Add new category..."
          className="flex-1 px-3 py-2 text-sm bg-surface border border-border rounded-md
            text-text-primary placeholder:text-text-muted
            focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
        />
        <Button size="sm" onClick={handleAddCategory} disabled={!newCategoryName.trim()}>
          Add Category
        </Button>
      </div>

      <div className="space-y-2">
        {catalog.map((cat) => {
          const isExpanded = expandedId === cat.id
          return (
            <div
              key={cat.id}
              className="border border-border-light rounded-lg overflow-hidden"
            >
              <div
                className="flex items-center gap-2 px-4 py-3 bg-accent-subtle/30 cursor-pointer hover:bg-accent-subtle/60 transition-colors"
                onClick={() => setExpandedId(isExpanded ? null : cat.id)}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  className={cn(
                    'text-text-muted transition-transform shrink-0',
                    isExpanded && 'rotate-90'
                  )}
                >
                  <path
                    d="M5.25 3.5L8.75 7L5.25 10.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

                {editingCatId === cat.id ? (
                  <input
                    type="text"
                    value={editCatValue}
                    onChange={(e) => setEditCatValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveEditCategory()
                      if (e.key === 'Escape') setEditingCatId(null)
                    }}
                    onClick={(e) => e.stopPropagation()}
                    autoFocus
                    className="flex-1 px-2 py-0.5 text-sm bg-surface border border-accent rounded
                      text-text-primary focus:outline-none"
                  />
                ) : (
                  <span className="flex-1 text-sm font-medium text-text-primary">
                    {cat.name}
                  </span>
                )}

                <span className="text-xs text-text-muted">
                  {cat.products.length} product{cat.products.length !== 1 ? 's' : ''}
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    if (editingCatId === cat.id) {
                      saveEditCategory()
                    } else {
                      startEditCategory(cat.id, cat.name)
                    }
                  }}
                  className="text-xs text-text-muted hover:text-text-secondary cursor-pointer"
                >
                  {editingCatId === cat.id ? 'Save' : 'Rename'}
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    removeCategory(cat.id)
                  }}
                  className="text-xs text-error hover:text-error/80 cursor-pointer"
                >
                  Delete
                </button>
              </div>

              {isExpanded && (
                <div className="px-4 py-3 space-y-2 bg-surface">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newProductName[cat.id] || ''}
                      onChange={(e) =>
                        setNewProductName((prev) => ({
                          ...prev,
                          [cat.id]: e.target.value,
                        }))
                      }
                      onKeyDown={(e) =>
                        e.key === 'Enter' && handleAddProduct(cat.id)
                      }
                      placeholder="Add product..."
                      className="flex-1 px-2 py-1.5 text-sm bg-background border border-border rounded
                        text-text-primary placeholder:text-text-muted
                        focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
                    />
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleAddProduct(cat.id)}
                      disabled={!(newProductName[cat.id] || '').trim()}
                    >
                      Add
                    </Button>
                  </div>

                  {cat.products.length === 0 ? (
                    <p className="text-xs text-text-muted italic py-2">
                      No products in this category yet.
                    </p>
                  ) : (
                    <div className="space-y-0.5">
                      {cat.products.map((p) => {
                        const productKey = `${cat.id}-${p.id}`
                        return (
                          <div
                            key={p.id}
                            className="flex items-center gap-2 py-1.5 px-2 rounded hover:bg-accent-subtle/30 group"
                          >
                            {editingProductKey === productKey ? (
                              <>
                                <input
                                  type="text"
                                  value={editProductValue}
                                  onChange={(e) =>
                                    setEditProductValue(e.target.value)
                                  }
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter')
                                      saveEditProduct(cat.id, p.id)
                                    if (e.key === 'Escape')
                                      setEditingProductKey(null)
                                  }}
                                  autoFocus
                                  className="flex-1 px-2 py-0.5 text-sm bg-surface border border-accent rounded
                                    text-text-primary focus:outline-none"
                                />
                                <button
                                  onClick={() => saveEditProduct(cat.id, p.id)}
                                  className="text-xs text-accent-dark hover:text-accent cursor-pointer"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => setEditingProductKey(null)}
                                  className="text-xs text-text-muted cursor-pointer"
                                >
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <>
                                <span className="flex-1 text-sm text-text-primary">
                                  {p.name}
                                </span>
                                <button
                                  onClick={() =>
                                    startEditProduct(cat.id, p.id, p.name)
                                  }
                                  className="opacity-0 group-hover:opacity-100 text-xs text-text-muted
                                    hover:text-text-secondary transition-opacity cursor-pointer"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => removeProduct(cat.id, p.id)}
                                  className="opacity-0 group-hover:opacity-100 text-xs text-error
                                    hover:text-error/80 transition-opacity cursor-pointer"
                                >
                                  Remove
                                </button>
                              </>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
