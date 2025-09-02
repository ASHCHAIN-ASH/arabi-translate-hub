import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, User, Mail, Phone, Calendar, Clock, 
  FileText, MessageSquare, Eye, CheckCircle, AlertCircle, PlayCircle
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { 
  DatabaseOrder, 
  OrderTimeline, 
  OrderFile, 
  OrderCommunication,
  getOrderById,
  getOrderTimeline,
  getOrderFiles,
  getOrderCommunications
} from '@/utils/supabaseOrderManagement';
import { OrderStatusBadge } from '@/components/OrderStatusBadge';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  
  const [order, setOrder] = useState<DatabaseOrder | null>(null);
  const [files, setFiles] = useState<OrderFile[]>([]);
  const [timeline, setTimeline] = useState<OrderTimeline[]>([]);
  const [communications, setCommunications] = useState<OrderCommunication[]>([]);

  // تحميل البيانات
  const fetchOrderData = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      
      const [orderData, timelineData, filesData, communicationsData] = await Promise.all([
        getOrderById(id),
        getOrderTimeline(id),
        getOrderFiles(id),
        getOrderCommunications(id)
      ]);

      setOrder(orderData);
      setTimeline(timelineData);
      setFiles(filesData);
      setCommunications(communicationsData);

    } catch (error) {
      console.error('Error fetching order data:', error);
      toast({
        title: "خطأ في تحميل البيانات",
        description: "حدث خطأ أثناء تحميل بيانات الطلب",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Real-time subscriptions
  useEffect(() => {
    fetchOrderData();

    if (!id) return;

    const orderChannel = supabase
      .channel('order-details-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${id}`
        },
        (payload) => {
          if (payload.eventType === 'UPDATE') {
            setOrder(payload.new as DatabaseOrder);
            toast({
              title: "تم تحديث الطلب",
              description: "تم تحديث بيانات الطلب من قبل الإدارة",
            });
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'order_timeline',
          filter: `order_id=eq.${id}`
        },
        (payload) => {
          setTimeline(prev => [...prev, payload.new as OrderTimeline]);
          toast({
            title: "تحديث جديد",
            description: `${payload.new.title}`,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(orderChannel);
    };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">الطلب غير موجود</h2>
          <Button onClick={() => navigate('/client/orders')}>العودة للطلبات</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <Button
            variant="ghost"
            onClick={() => navigate('/client/orders')}
            className="flex items-center gap-2"
          >
            <ArrowRight className="w-4 h-4" />
            العودة للطلبات
          </Button>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">{order.title}</h1>
            <div className="flex items-center gap-3 justify-center">
              <Badge variant="outline">{order.tracking_id}</Badge>
              <OrderStatusBadge status={order.current_status} />
            </div>
          </div>
          
          <div /> {/* Spacer */}
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          
          {/* Tabs Navigation */}
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
            <TabsTrigger value="timeline">المراحل</TabsTrigger>
            <TabsTrigger value="files">الملفات</TabsTrigger>
            <TabsTrigger value="communication">التواصل</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Order Info */}
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    معلومات الطلب
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">الدرجة العلمية:</span>
                      <p className="font-medium">{order.degree}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">نوع الخدمة:</span>
                      <p className="font-medium">{order.service_type}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">تاريخ الإنشاء:</span>
                      <p className="font-medium">{new Date(order.created_at).toLocaleDateString('ar-SA')}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">التسليم المتوقع:</span>
                      <p className="font-medium">{new Date(order.estimated_delivery).toLocaleDateString('ar-SA')}</p>
                    </div>
                  </div>
                  
                  {order.description && (
                    <div className="pt-4 border-t">
                      <h4 className="font-semibold mb-2">وصف المشروع:</h4>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {order.description}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Client Info */}
              <Card className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    معلومات العميل
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {order.client_name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{order.client_name}</h3>
                    </div>
                  </div>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span>{order.client_email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span>{order.client_phone}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Timeline Tab */}
          <TabsContent value="timeline" className="space-y-6">
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  مراحل المشروع
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {timeline.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      لا توجد مراحل محددة بعد
                    </p>
                  ) : (
                    timeline.map((item, index) => (
                      <div key={item.id} className="flex items-start gap-4 relative">
                        {index < timeline.length - 1 && (
                          <div className="absolute right-5 top-12 w-0.5 h-16 bg-border" />
                        )}
                        
                        <div className={`
                          w-10 h-10 rounded-full flex items-center justify-center border-2 border-background z-10
                          ${item.completed_date ? 'bg-green-500 text-white' : 'bg-muted text-muted-foreground'}
                        `}>
                          {item.completed_date ? (
                            <CheckCircle className="w-5 h-5" />
                          ) : (
                            <Clock className="w-5 h-5" />
                          )}
                        </div>

                        <div className="flex-1 bg-muted/30 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold">{item.title}</h4>
                            <Badge variant={item.completed_date ? "default" : "secondary"}>
                              {item.completed_date ? 'مكتمل' : 'في الانتظار'}
                            </Badge>
                          </div>
                          {item.description && (
                            <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                          )}
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{item.actor_name || 'النظام'}</span>
                            <span>
                              {item.completed_date ? 
                                new Date(item.completed_date).toLocaleDateString('ar-SA') : 
                                item.scheduled_date ? 
                                  new Date(item.scheduled_date).toLocaleDateString('ar-SA') : 
                                  'غير محدد'
                              }
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Files Tab */}
          <TabsContent value="files" className="space-y-6">
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  ملفات المشروع
                </CardTitle>
              </CardHeader>
              <CardContent>
                {files.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">لا توجد ملفات متاحة حالياً</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {files.map((file) => (
                      <div key={file.id} className="p-4 border rounded-lg hover:bg-muted/30 transition-colors">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-primary" />
                          <div className="flex-1">
                            <h4 className="font-medium">{file.file_name}</h4>
                            <p className="text-xs text-muted-foreground">
                              {new Date(file.uploaded_at).toLocaleDateString('ar-SA')}
                            </p>
                          </div>
                          <Button size="sm" variant="outline">
                            تحميل
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Communication Tab */}
          <TabsContent value="communication" className="space-y-6">
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  رسائل التواصل
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto mb-6">
                  {communications.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      لا توجد رسائل بعد
                    </p>
                  ) : (
                    communications.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex gap-3 ${msg.sender_type === 'client' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`
                          max-w-sm p-4 rounded-lg
                          ${msg.sender_type === 'client' ? 
                            'bg-primary text-primary-foreground' : 
                            'bg-muted text-foreground'}
                        `}>
                          <div className="mb-2">
                            <span className="font-medium text-sm">{msg.sender_name}</span>
                            <span className="text-xs opacity-75 mr-2">
                              {new Date(msg.created_at).toLocaleDateString('ar-SA')}
                            </span>
                          </div>
                          <p className="text-sm">{msg.message}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                
                {/* Message input */}
                <div className="border-t pt-6">
                  <div className="flex gap-3">
                    <Textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="اكتب رسالتك هنا..."
                      className="flex-1 min-h-[60px] resize-none"
                    />
                    <Button 
                      onClick={() => {
                        if (newMessage.trim()) {
                          toast({
                            title: "تم إرسال الرسالة",
                            description: "سيتم الرد عليك قريباً",
                          });
                          setNewMessage('');
                        }
                      }}
                      disabled={!newMessage.trim()}
                    >
                      إرسال
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default OrderDetails;