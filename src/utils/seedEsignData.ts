// بيانات تجريبية لنظام التوقيع الإلكتروني
import { 
  createEsignDocument,
  sendDocumentForSigning 
} from '@/utils/supabaseEsignService';

export const seedEsignData = async () => {
  try {
    console.log('Creating sample e-signature documents...');

    // إنشاء مستند توقيع تجريبي 1
    const doc1Id = await createEsignDocument(
      'contract-001',
      'عقد ترجمة قانونية - أحمد محمد علي',
      [
        {
          role: 'customer',
          name: 'أحمد محمد علي',
          email: 'ahmed@example.com',
          phone: '+966559600824'
        },
        {
          role: 'company',
          name: 'وكالة ماستر إيدو باث',
          email: 'admin@masteredupath.com',
          phone: '+966559600824'
        }
      ]
    );

    // إنشاء مستند توقيع تجريبي 2
    const doc2Id = await createEsignDocument(
      'contract-002',
      'عقد إعداد رسالة ماجستير - فاطمة أحمد',
      [
        {
          role: 'customer',
          name: 'فاطمة أحمد',
          email: 'fatima@example.com',
          phone: '+966559600824'
        },
        {
          role: 'company',
          name: 'وكالة ماستر إيدو باث',
          email: 'admin@masteredupath.com',
          phone: '+966559600824'
        }
      ]
    );

    // إرسال المستند الأول للتوقيع
    await sendDocumentForSigning(doc1Id, []);

    console.log('Sample e-signature documents created successfully');
    
    return {
      success: true,
      documentsCreated: [doc1Id, doc2Id],
      message: 'تم إنشاء مستندات التوقيع التجريبية بنجاح'
    };

  } catch (error) {
    console.error('Error creating sample e-signature documents:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'فشل في إنشاء البيانات التجريبية'
    };
  }
};