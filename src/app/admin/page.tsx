import { verifySession } from './actions';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const email = await verifySession();

  if (!email) {
    return <AdminLogin />;
  }

  return <AdminDashboard email={email} />;
}
