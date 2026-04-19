import { useParams } from 'react-router-dom';
import ClientLayout from '@/components/client/ClientLayout';
import TicketDetailView from '@/components/tickets/TicketDetailView';
import { useAuth } from '@/components/SimpleAuthProvider';

export default function ClientTicketDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  if (!id || !user) return null;
  return (
    <ClientLayout>
      <TicketDetailView ticketId={id} currentUserId={user.id} isAdmin={false} backTo="/support/tickets" displayName={user.email || 'عميل'} />
    </ClientLayout>
  );
}
