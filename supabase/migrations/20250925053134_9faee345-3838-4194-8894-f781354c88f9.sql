-- إزالة دور المدير فقط من المستخدمين المحددين بدلاً من حذفهم
DELETE FROM user_roles WHERE user_id IN (
  SELECT u.id FROM auth.users u WHERE u.email IN ('info@alialshehriholding.com', 'ali6c201@gmail.com')
) AND role = 'admin';