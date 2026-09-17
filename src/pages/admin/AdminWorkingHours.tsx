import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { supabase } from '@/data/legacy/client';
import { Calendar, Clock, Settings, Plus, Edit2, Trash2, RefreshCw } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { format } from 'date-fns';

interface BusinessHour {
  id: string;
  day_of_week: number;
  is_open: boolean;
  open_time: string;
  close_time: string;
}

interface Holiday {
  id: string;
  title: string;
  start_date: string;
  end_date: string;
  is_full_day: boolean;
  notes?: string;
}

interface Override {
  id: string;
  date: string;
  open_time?: string;
  close_time?: string;
  is_closed: boolean;
  reason: string;
}

const AdminWorkingHours = () => {
  const [businessHours, setBusinessHours] = useState<BusinessHour[]>([]);
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [overrides, setOverrides] = useState<Override[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Dialog states
  const [showHolidayDialog, setShowHolidayDialog] = useState(false);
  const [showOverrideDialog, setShowOverrideDialog] = useState(false);
  const [editingHoliday, setEditingHoliday] = useState<Holiday | null>(null);
  const [editingOverride, setEditingOverride] = useState<Override | null>(null);

  const dayNames = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // For now, we'll use mock data since the tables are not in the types yet
      // This will be replaced with actual database calls once types are updated
      
      // Mock business hours data
      const mockHours: BusinessHour[] = [
        { id: '1', day_of_week: 0, is_open: true, open_time: '09:00', close_time: '18:00' }, // Sunday
        { id: '2', day_of_week: 1, is_open: true, open_time: '09:00', close_time: '18:00' }, // Monday
        { id: '3', day_of_week: 2, is_open: true, open_time: '09:00', close_time: '18:00' }, // Tuesday
        { id: '4', day_of_week: 3, is_open: true, open_time: '09:00', close_time: '18:00' }, // Wednesday
        { id: '5', day_of_week: 4, is_open: true, open_time: '09:00', close_time: '18:00' }, // Thursday
        { id: '6', day_of_week: 5, is_open: false, open_time: '09:00', close_time: '18:00' }, // Friday (closed)
        { id: '7', day_of_week: 6, is_open: true, open_time: '15:00', close_time: '18:00' }, // Saturday
      ];

      const mockHolidays: Holiday[] = [
        {
          id: '1',
          title: 'يوم التأسيس',
          start_date: '2025-02-22',
          end_date: '2025-02-22',
          is_full_day: true,
          notes: 'يوم التأسيس السعودي'
        },
        {
          id: '2',
          title: 'اليوم الوطني',
          start_date: '2025-09-23',
          end_date: '2025-09-23',
          is_full_day: true,
          notes: 'اليوم الوطني السعودي'
        }
      ];

      const mockOverrides: Override[] = [];

      setBusinessHours(mockHours);
      setHolidays(mockHolidays);
      setOverrides(mockOverrides);
      
      toast.success('تم تحميل البيانات التجريبية');
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('خطأ في تحميل البيانات');
    } finally {
      setIsLoading(false);
    }
  };

  const updateBusinessHour = async (id: string, updates: Partial<BusinessHour>) => {
    try {
      // Mock update for now - will be replaced with actual database call
      setBusinessHours(prev => 
        prev.map(hour => hour.id === id ? { ...hour, ...updates } : hour)
      );
      toast.success('تم تحديث ساعات العمل');
    } catch (error) {
      console.error('Error updating business hour:', error);
      toast.error('خطأ في تحديث ساعات العمل');
    }
  };

  const saveHoliday = async (holidayData: Omit<Holiday, 'id'>) => {
    try {
      if (editingHoliday) {
        // Mock update
        setHolidays(prev => 
          prev.map(h => h.id === editingHoliday.id ? { ...h, ...holidayData } : h)
        );
        toast.success('تم تحديث العطلة');
      } else {
        // Mock insert
        const newHoliday: Holiday = {
          id: Date.now().toString(),
          ...holidayData
        };
        setHolidays(prev => [...prev, newHoliday]);
        toast.success('تم إضافة العطلة');
      }
      
      setShowHolidayDialog(false);
      setEditingHoliday(null);
    } catch (error) {
      console.error('Error saving holiday:', error);
      toast.error('خطأ في حفظ العطلة');
    }
  };

  const deleteHoliday = async (id: string) => {
    try {
      // Mock delete
      setHolidays(prev => prev.filter(h => h.id !== id));
      toast.success('تم حذف العطلة');
    } catch (error) {
      console.error('Error deleting holiday:', error);
      toast.error('خطأ في حذف العطلة');
    }
  };

  const saveOverride = async (overrideData: Omit<Override, 'id'>) => {
    try {
      if (editingOverride) {
        // Mock update
        setOverrides(prev => 
          prev.map(o => o.id === editingOverride.id ? { ...o, ...overrideData } : o)
        );
        toast.success('تم تحديث التجاوز');
      } else {
        // Mock insert
        const newOverride: Override = {
          id: Date.now().toString(),
          ...overrideData
        };
        setOverrides(prev => [...prev, newOverride]);
        toast.success('تم إضافة التجاوز');
      }
      
      setShowOverrideDialog(false);
      setEditingOverride(null);
    } catch (error) {
      console.error('Error saving override:', error);
      toast.error('خطأ في حفظ التجاوز');
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6" dir="rtl">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">إدارة أوقات العمل والعطل</h1>
          <Button onClick={loadData} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 ml-2" />
            تحديث
          </Button>
        </div>

        <Tabs defaultValue="hours" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="hours" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              ساعات العمل
            </TabsTrigger>
            <TabsTrigger value="holidays" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              العطل الرسمية
            </TabsTrigger>
            <TabsTrigger value="overrides" className="flex items-center gap-2">
              <Edit2 className="h-4 w-4" />
              التجاوزات
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              الإعدادات
            </TabsTrigger>
          </TabsList>

          <TabsContent value="hours">
            <Card>
              <CardHeader>
                <CardTitle>ساعات العمل الأسبوعية</CardTitle>
                <CardDescription>
                  تعديل ساعات العمل لكل يوم من أيام الأسبوع
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {businessHours.map((hour) => (
                    <div key={hour.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <span className="font-medium min-w-[80px]">
                          {dayNames[hour.day_of_week]}
                        </span>
                        <Switch
                          checked={hour.is_open}
                          onCheckedChange={(checked) => 
                            updateBusinessHour(hour.id, { is_open: checked })
                          }
                        />
                      </div>
                      
                      {hour.is_open && (
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Label>من</Label>
                            <Input
                              type="time"
                              value={hour.open_time}
                              onChange={(e) => 
                                updateBusinessHour(hour.id, { open_time: e.target.value })
                              }
                              className="w-32"
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <Label>إلى</Label>
                            <Input
                              type="time"
                              value={hour.close_time}
                              onChange={(e) => 
                                updateBusinessHour(hour.id, { close_time: e.target.value })
                              }
                              className="w-32"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="holidays">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>العطل الرسمية</CardTitle>
                  <CardDescription>
                    إدارة العطل والمناسبات الرسمية
                  </CardDescription>
                </div>
                <Button onClick={() => setShowHolidayDialog(true)}>
                  <Plus className="h-4 w-4 ml-2" />
                  إضافة عطلة
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>العنوان</TableHead>
                      <TableHead>تاريخ البداية</TableHead>
                      <TableHead>تاريخ النهاية</TableHead>
                      <TableHead>النوع</TableHead>
                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {holidays.map((holiday) => (
                      <TableRow key={holiday.id}>
                        <TableCell className="font-medium">{holiday.title}</TableCell>
                        <TableCell>{format(new Date(holiday.start_date), 'yyyy/MM/dd')}</TableCell>
                        <TableCell>{format(new Date(holiday.end_date), 'yyyy/MM/dd')}</TableCell>
                        <TableCell>
                          <Badge variant={holiday.is_full_day ? 'default' : 'secondary'}>
                            {holiday.is_full_day ? 'يوم كامل' : 'جزئي'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingHoliday(holiday);
                                setShowHolidayDialog(true);
                              }}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => deleteHoliday(holiday.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="overrides">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>تجاوزات أوقات العمل</CardTitle>
                  <CardDescription>
                    تجاوزات مؤقتة لأيام محددة (إغلاق مبكر، تمديد ساعات، إلخ)
                  </CardDescription>
                </div>
                <Button onClick={() => setShowOverrideDialog(true)}>
                  <Plus className="h-4 w-4 ml-2" />
                  إضافة تجاوز
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>التاريخ</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead>أوقات العمل</TableHead>
                      <TableHead>السبب</TableHead>
                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {overrides.map((override) => (
                      <TableRow key={override.id}>
                        <TableCell>{format(new Date(override.date), 'yyyy/MM/dd')}</TableCell>
                        <TableCell>
                          <Badge variant={override.is_closed ? 'destructive' : 'default'}>
                            {override.is_closed ? 'مغلق' : 'مفتوح'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {override.is_closed ? 'مغلق' : `${override.open_time} - ${override.close_time}`}
                        </TableCell>
                        <TableCell>{override.reason}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingOverride(override);
                                setShowOverrideDialog(true);
                              }}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={async () => {
                                try {
                                  // Mock delete
                                  setOverrides(prev => prev.filter(o => o.id !== override.id));
                                  toast.success('تم حذف التجاوز');
                                } catch (error) {
                                  toast.error('خطأ في حذف التجاوز');
                                }
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>إعدادات العطل</CardTitle>
                <CardDescription>
                  إعدادات مزامنة التقويم الخارجي والتحديثات التلقائية
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="use-ics">استخدام تقويم خارجي (ICS)</Label>
                      <p className="text-sm text-muted-foreground">
                        مزامنة العطل الرسمية من تقويم خارجي
                      </p>
                    </div>
                    <Switch id="use-ics" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="ics-url">رابط التقويم الخارجي</Label>
                    <Input
                      id="ics-url"
                      placeholder="https://example.com/calendar.ics"
                      disabled
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" disabled>
                      جلب/تحديث العطل الآن
                    </Button>
                    <Button variant="outline" disabled>
                      عرض سجل المزامنة
                    </Button>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    آخر مزامنة: لم تتم المزامنة بعد
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Holiday Dialog */}
        <HolidayDialog
          open={showHolidayDialog}
          onOpenChange={setShowHolidayDialog}
          holiday={editingHoliday}
          onSave={saveHoliday}
        />

        {/* Override Dialog */}
        <OverrideDialog
          open={showOverrideDialog}
          onOpenChange={setShowOverrideDialog}
          override={editingOverride}
          onSave={saveOverride}
        />
      </div>
    </AdminLayout>
  );
};

// Holiday Dialog Component
const HolidayDialog: React.FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  holiday: Holiday | null;
  onSave: (holiday: Omit<Holiday, 'id'>) => void;
}> = ({ open, onOpenChange, holiday, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    start_date: '',
    end_date: '',
    is_full_day: true,
    notes: ''
  });

  useEffect(() => {
    if (holiday) {
      setFormData({
        title: holiday.title,
        start_date: holiday.start_date,
        end_date: holiday.end_date,
        is_full_day: holiday.is_full_day,
        notes: holiday.notes || ''
      });
    } else {
      setFormData({
        title: '',
        start_date: '',
        end_date: '',
        is_full_day: true,
        notes: ''
      });
    }
  }, [holiday, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{holiday ? 'تعديل العطلة' : 'إضافة عطلة جديدة'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">عنوان العطلة</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start_date">تاريخ البداية</Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="end_date">تاريخ النهاية</Label>
              <Input
                id="end_date"
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                required
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="is_full_day"
              checked={formData.is_full_day}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_full_day: checked }))}
            />
            <Label htmlFor="is_full_day">يوم كامل</Label>
          </div>
          
          <div>
            <Label htmlFor="notes">ملاحظات</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              إلغاء
            </Button>
            <Button type="submit">
              {holiday ? 'تحديث' : 'إضافة'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Override Dialog Component
const OverrideDialog: React.FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  override: Override | null;
  onSave: (override: Omit<Override, 'id'>) => void;
}> = ({ open, onOpenChange, override, onSave }) => {
  const [formData, setFormData] = useState({
    date: '',
    open_time: '',
    close_time: '',
    is_closed: false,
    reason: ''
  });

  useEffect(() => {
    if (override) {
      setFormData({
        date: override.date,
        open_time: override.open_time || '',
        close_time: override.close_time || '',
        is_closed: override.is_closed,
        reason: override.reason
      });
    } else {
      setFormData({
        date: '',
        open_time: '',
        close_time: '',
        is_closed: false,
        reason: ''
      });
    }
  }, [override, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{override ? 'تعديل التجاوز' : 'إضافة تجاوز جديد'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="date">التاريخ</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              required
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="is_closed"
              checked={formData.is_closed}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_closed: checked }))}
            />
            <Label htmlFor="is_closed">مغلق (تجاهل أوقات العمل)</Label>
          </div>
          
          {!formData.is_closed && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="open_time">وقت الفتح</Label>
                <Input
                  id="open_time"
                  type="time"
                  value={formData.open_time}
                  onChange={(e) => setFormData(prev => ({ ...prev, open_time: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="close_time">وقت الإغلاق</Label>
                <Input
                  id="close_time"
                  type="time"
                  value={formData.close_time}
                  onChange={(e) => setFormData(prev => ({ ...prev, close_time: e.target.value }))}
                />
              </div>
            </div>
          )}
          
          <div>
            <Label htmlFor="reason">السبب</Label>
            <Input
              id="reason"
              value={formData.reason}
              onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
              placeholder="مثل: صيانة، إغلاق مبكر، تمديد ساعات"
              required
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              إلغاء
            </Button>
            <Button type="submit">
              {override ? 'تحديث' : 'إضافة'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminWorkingHours;