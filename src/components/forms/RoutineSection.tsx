import { ComboBox } from '../ui/ComboBox'

interface RoutineField {
  key: string
  label: string
  category: string
}

interface RoutineSectionProps {
  title: string
  icon: string
  fields: RoutineField[]
  values: Record<string, string>
  onChange: (key: string, value: string) => void
  getProducts: (category: string) => string[]
}

export function RoutineSection({
  title,
  icon,
  fields,
  values,
  onChange,
  getProducts,
}: RoutineSectionProps) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">{icon}</span>
        <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">
          {title}
        </h3>
      </div>
      <div className="space-y-3 pl-7">
        {fields.map((field) => (
          <ComboBox
            key={field.key}
            label={field.label}
            value={values[field.key] || ''}
            onChange={(val) => onChange(field.key, val)}
            options={getProducts(field.category)}
            placeholder={`Select or type ${field.label.toLowerCase()}...`}
          />
        ))}
      </div>
    </div>
  )
}
