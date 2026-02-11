import { Card } from '../ui/Card'
import { ProfileSettings } from './ProfileSettings'
import { LogoUpload } from './LogoUpload'
import { TreatmentListManager } from './TreatmentListManager'
import { ProductCatalogManager } from './ProductCatalogManager'

export function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-text-primary">Settings</h2>
        <p className="text-sm text-text-muted mt-1">
          Configure your profile, logo, treatments, and product catalog.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <ProfileSettings />
        </Card>

        <Card>
          <LogoUpload />
        </Card>
      </div>

      <Card>
        <TreatmentListManager />
      </Card>

      <Card>
        <ProductCatalogManager />
      </Card>
    </div>
  )
}
