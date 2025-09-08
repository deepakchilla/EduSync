import { useEffect, useState } from 'react';
import { activitiesApi, Activity } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const FacultyApprovals = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<Activity[]>([]);
  const [reason, setReason] = useState('');

  const load = async () => {
    setLoading(true);
    const res = await activitiesApi.pending();
    if (res.success) setList(res.data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const approve = async (id: number) => {
    if (!user?.email) return;
    const res = await activitiesApi.approve(id, user.email);
    if (res.success) {
      toast({ title: 'Approved', description: 'Activity approved' });
      load();
    } else {
      toast({ title: 'Error', description: res.message });
    }
  };

  const reject = async (id: number) => {
    if (!user?.email) return;
    const res = await activitiesApi.reject(id, user.email, reason || 'Not sufficient evidence');
    if (res.success) {
      toast({ title: 'Rejected', description: 'Activity rejected' });
      setReason('');
      load();
    } else {
      toast({ title: 'Error', description: res.message });
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Pending Approvals</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <div className="space-y-3">
              {list.map(a => (
                <div key={a.id} className="border rounded p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{a.title} <span className="text-xs text-gray-500">({a.category})</span></div>
                      <div className="text-sm text-gray-600">Student ID: {a.studentId}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="default" onClick={() => approve(a.id)}>Approve</Button>
                      <Button variant="destructive" onClick={() => reject(a.id)}>Reject</Button>
                    </div>
                  </div>
                  <div className="mt-2 text-sm">{a.description}</div>
                </div>
              ))}
              {list.length === 0 && <div className="text-sm text-gray-600">No pending activities.</div>}
            </div>
          )}
          <div className="mt-4">
            <div className="text-sm mb-1">Rejection reason (optional)</div>
            <Input value={reason} onChange={e => setReason(e.target.value)} placeholder="Reason for rejection" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FacultyApprovals;


