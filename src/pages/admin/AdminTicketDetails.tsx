import { useParams } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import TicketDetailView from '@/components/tickets/TicketDetailView';
import { useAuth } from '@/components/SimpleAuthProvider';

export default function AdminTicketDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  if (!id || !user) return null;
  return (
    <AdminLayout>
      <TicketDetailView ticketId={id} currentUserId={user.id} isAdmin backTo="/adminmaster/tickets" />
    </AdminLayout>
  );
}
