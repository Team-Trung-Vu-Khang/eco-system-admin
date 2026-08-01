import { useRoute } from 'wouter'
import { AdminFormPage } from '../AdminFormPage'

export function AdminsEditPage() {
  const [match, params] = useRoute('/admins/:id/edit')

  if (!match || !params?.id) {
    return <AdminFormPage mode="edit" />
  }

  return <AdminFormPage mode="edit" adminId={params.id} />
}
