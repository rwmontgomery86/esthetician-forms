import { ComboBox } from '../ui/ComboBox'

interface AddOnsSectionProps {
  values: {
    masque: string
    eyeTreatment: string
    specialty: string
  }
  onChange: (key: 'masque' | 'eyeTreatment' | 'specialty', value: string) => void
  getProducts: (category: string) => string[]
}

export function AddOnsSection({ values, onChange, getProducts }: AddOnsSectionProps) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">+</span>
        <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">
          Add-Ons
        </h3>
      </div>
      <div className="space-y-3 pl-7">
        <ComboBox
          label="Masque"
          value={values.masque}
          onChange={(val) => onChange('masque', val)}
          options={getProducts('Masques')}
          placeholder="Select or type masque..."
        />
        <ComboBox
          label="Eye Treatment"
          value={values.eyeTreatment}
          onChange={(val) => onChange('eyeTreatment', val)}
          options={getProducts('Eye Treatments')}
          placeholder="Select or type eye treatment..."
        />
        <ComboBox
          label="Specialty"
          value={values.specialty}
          onChange={(val) => onChange('specialty', val)}
          options={getProducts('Specialty')}
          placeholder="Select or type specialty product..."
        />
      </div>
    </div>
  )
}
