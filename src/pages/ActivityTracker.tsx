import { useEffect, useMemo, useState } from 'react';
import { activitiesApi, Activity } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Header } from '@/components/Layout/Header';

const categories = [
  'Conference','Workshop','Certification','Club','Competition','Leadership','Internship','Community'
];

const ActivityTracker = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<Activity[]>([]);
  const [statusFilter, setStatusFilter] = useState<'ALL'|'PENDING'|'APPROVED'|'REJECTED'>('ALL');
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');

  const [formState, setFormState] = useState({
    category: categories[0],
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    credits: '',
    certificate: null as File | null,
  });

  const canSubmit = useMemo(() => !!formState.title && !!formState.category && !!user?.email, [formState.title, formState.category, user]);

  const load = async () => {
    if (!user?.email) return;
    setLoading(true);
    const res = await activitiesApi.my(user.email);
    if (res.success) setList(res.data || []);
    setLoading(false);
  };

  useEffect(() => { load(); // eslint-disable-next-line
  }, [user?.email]);

  const submit = async () => {
    if (!user?.email) return;
    const data = new FormData();
    data.append('userEmail', user.email);
    data.append('category', formState.category);
    data.append('title', formState.title);
    if (formState.description) data.append('description', formState.description);
    if (formState.startDate) data.append('startDate', formState.startDate);
    if (formState.endDate) data.append('endDate', formState.endDate);
    if (formState.credits) data.append('credits', formState.credits);
    if (formState.certificate) data.append('certificate', formState.certificate);

    const res = await activitiesApi.submit(data);
    if (res.success) {
      toast({ title: 'Submitted', description: 'Activity submitted for approval' });
      setFormState({ category: categories[0], title: '', description: '', startDate: '', endDate: '', credits: '', certificate: null });
      load();
    } else {
      toast({ title: 'Error', description: res.message });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="bg-white border-l-4 border-l-blue-900 mb-8">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900">Activity Tracker</h1>
            <p className="text-gray-600">Submit achievements and track approval status</p>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <Card className="edu-card">
            <CardHeader>
              <CardTitle>Submit Activity</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
          <div>
            <Label>Category</Label>
            <select className="w-full border rounded-md p-2 bg-white" value={formState.category} onChange={e => setFormState(s => ({ ...s, category: e.target.value }))}>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <Label>Title</Label>
            <Input className="edu-input" value={formState.title} onChange={e => setFormState(s => ({ ...s, title: e.target.value }))} placeholder="e.g., National Level Hackathon" />
          </div>
          <div>
            <Label>Description</Label>
            <Input className="edu-input" value={formState.description} onChange={e => setFormState(s => ({ ...s, description: e.target.value }))} placeholder="Brief details" />
          </div>
          <div>
            <Label>Start Date</Label>
            <Input className="edu-input" type="date" value={formState.startDate} onChange={e => setFormState(s => ({ ...s, startDate: e.target.value }))} />
          </div>
          <div>
            <Label>End Date</Label>
            <Input className="edu-input" type="date" value={formState.endDate} onChange={e => setFormState(s => ({ ...s, endDate: e.target.value }))} />
          </div>
          <div>
            <Label>Credits/Hours</Label>
            <Input className="edu-input" value={formState.credits} onChange={e => setFormState(s => ({ ...s, credits: e.target.value }))} />
          </div>
          <div>
            <Label>Certificate/Proof (PDF/JPG/PNG)</Label>
            <Input className="edu-input" type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={e => setFormState(s => ({ ...s, certificate: e.target.files?.[0] || null }))} />
          </div>
          <div>
            <Button disabled={!canSubmit} onClick={submit} className="w-full edu-button-primary">Submit Activity</Button>
            <p className="text-xs text-gray-500 mt-2">Submitted activities require faculty approval. You will see status updates below.</p>
          </div>
        </CardContent>
          </Card>

          <Card className="edu-card">
            <CardHeader>
              <CardTitle>My Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-3 mb-4">
                <div>
                  <Label>Status</Label>
                  <select className="w-full border rounded-md p-2 bg-white" value={statusFilter} onChange={e => setStatusFilter(e.target.value as any)}>
                    {['ALL','PENDING','APPROVED','REJECTED'].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <Label>From</Label>
                  <Input className="edu-input" type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} />
                </div>
                <div>
                  <Label>To</Label>
                  <Input className="edu-input" type="date" value={toDate} onChange={e => setToDate(e.target.value)} />
                </div>
              </div>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="space-y-3">
                  {list
                    .filter(a => statusFilter === 'ALL' ? true : a.status === statusFilter)
                    .filter(a => {
                      const s = a.startDate || a.approvedAt || a.createdAt;
                      if (!s) return true;
                      const d = new Date(s as any).toISOString().slice(0,10);
                      if (fromDate && d < fromDate) return false;
                      if (toDate && d > toDate) return false;
                      return true;
                    })
                    .map(a => (
                    <div key={a.id} className="border rounded p-3 flex items-center justify-between bg-white">
                      <div>
                        <div className="font-medium text-gray-900">{a.title} <span className="text-xs text-gray-500">({a.category})</span></div>
                        <div className="mt-1 flex items-center gap-2">
                          <Badge
                            variant="secondary"
                            className={
                              a.status === 'APPROVED'
                                ? 'bg-green-100 text-green-700'
                                : a.status === 'REJECTED'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-yellow-100 text-yellow-700'
                            }
                          >
                            {a.status}
                          </Badge>
                          {a.credits ? <span className="text-xs text-gray-600">Credits: {a.credits}</span> : null}
                        </div>
                      </div>
                      {a.certificateFile && (
                        <span className="text-xs text-gray-500">Proof attached</span>
                      )}
                    </div>
                  ))}
                  {list.length === 0 && <div className="text-sm text-gray-600">No activities yet.</div>}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ActivityTracker;


