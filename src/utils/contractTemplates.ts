import { ContractTemplate, ServiceType } from "@/types/contract";

export const contractTemplates: Record<ServiceType, ContractTemplate> = {
  'translation-legal': {
    id: 'tpl-legal',
    serviceType: 'translation-legal',
    name: 'عقد ترجمة قانونية',
    content: `
# عقد ترجمة قانونية

**بين:** {{agencyName}}
**والعميل:** {{clientName}}

## تفاصيل الخدمة
- **نوع الترجمة:** ترجمة قانونية
- **المستندات:** {{documentTypes}}
- **اللغات:** من {{sourceLang}} إلى {{targetLang}}
- **عدد الكلمات المتوقع:** {{wordCount}}
- **تاريخ التسليم:** {{deliveryDate}}

## الشروط والأحكام
1. **السرية:** نتعهد بالحفاظ على سرية جميع المستندات المترجمة
2. **الدقة:** نضمن دقة الترجمة وفقاً للمعايير القانونية المعتمدة
3. **التوثيق:** سيتم توثيق الترجمة من جهات معتمدة حسب الطلب
4. **المراجعة:** حق العميل في طلب مراجعة واحدة مجانية خلال 7 أيام

## التكلفة والدفع
- **إجمالي التكلفة:** {{totalAmount}} ريال سعودي
- **طريقة الدفع:** {{paymentMethod}}
- **شروط الدفع:** {{paymentTerms}}
`,
    terms: [
      {
        id: 'legal-1',
        title: 'السرية والحماية',
        content: 'نتعهد بالحفاظ التام على سرية المستندات وعدم الكشف عنها لأي طرف ثالث',
        required: true
      },
      {
        id: 'legal-2', 
        title: 'التوثيق القانوني',
        content: 'يمكن توثيق الترجمة من الجهات المختصة مقابل رسوم إضافية',
        required: false
      }
    ],
    variables: [
      { key: 'documentTypes', label: 'أنواع المستندات', type: 'text', required: true },
      { key: 'sourceLang', label: 'اللغة المصدر', type: 'select', required: true, options: ['العربية', 'الإنجليزية', 'الفرنسية', 'الألمانية'] },
      { key: 'targetLang', label: 'اللغة المستهدفة', type: 'select', required: true, options: ['العربية', 'الإنجليزية', 'الفرنسية', 'الألمانية'] },
      { key: 'wordCount', label: 'عدد الكلمات', type: 'number', required: true }
    ]
  },

  'translation-business': {
    id: 'tpl-business',
    serviceType: 'translation-business',
    name: 'عقد ترجمة تجارية',
    content: `
# عقد ترجمة تجارية

**المقاول:** {{agencyName}}
**العميل:** {{clientName}}

## وصف الخدمة
- **نوع المشروع:** ترجمة تجارية
- **المواد:** {{materials}}
- **اللغات:** {{sourceLang}} → {{targetLang}}
- **الحجم:** {{wordCount}} كلمة تقريباً
- **موعد التسليم:** {{deliveryDate}}

## معايير الجودة
1. ترجمة احترافية تراعي المصطلحات التجارية
2. مراجعة لغوية شاملة
3. ضمان الدقة في الأرقام والمبالغ المالية
4. تنسيق يحافظ على شكل المستند الأصلي

## الالتزامات المالية
- **القيمة الإجمالية:** {{totalAmount}} ريال
- **الدفع:** {{paymentTerms}}
- **رسوم إضافية:** التعديلات الجوهرية بعد التسليم قد تتطلب رسوماً إضافية
`,
    terms: [
      {
        id: 'business-1',
        title: 'المصطلحات التجارية',
        content: 'نلتزم باستخدام المصطلحات التجارية المعتمدة والدارجة في السوق',
        required: true
      }
    ],
    variables: [
      { key: 'materials', label: 'المواد المراد ترجمتها', type: 'text', required: true },
      { key: 'sourceLang', label: 'من لغة', type: 'select', required: true, options: ['العربية', 'الإنجليزية', 'الفرنسية'] },
      { key: 'targetLang', label: 'إلى لغة', type: 'select', required: true, options: ['العربية', 'الإنجليزية', 'الفرنسية'] }
    ]
  },

  'research-thesis': {
    id: 'tpl-thesis',
    serviceType: 'research-thesis',
    name: 'عقد كتابة رسالة علمية',
    content: `
# عقد إعداد رسالة علمية

**مقدم الخدمة:** {{agencyName}}
**الطالب/الباحث:** {{clientName}}

## تفاصيل المشروع البحثي
- **نوع الرسالة:** {{thesisType}}
- **التخصص:** {{major}}
- **موضوع البحث:** {{researchTopic}}
- **عدد الصفحات المتوقع:** {{pageCount}}
- **الجامعة:** {{university}}
- **تاريخ التسليم النهائي:** {{deliveryDate}}

## نطاق العمل
1. **إعداد خطة البحث** شاملة المقدمة والأهداف والمنهجية
2. **مراجعة الأدبيات** واستعراض الدراسات السابقة
3. **جمع وتحليل البيانات** باستخدام الأدوات الإحصائية المناسبة
4. **كتابة الفصول** وفقاً لمعايير الجامعة
5. **التوثيق والمراجع** حسب نظام APA/MLA
6. **المراجعة النهائية** والتدقيق اللغوي

## ضمانات الجودة
- أصالة المحتوى 100% (فحص السرقة الأدبية)
- مراجعة من متخصصين في المجال
- التزام بمعايير الجامعة ومتطلبات القسم
- دعم فني حتى المناقشة

## الجوانب المالية
- **إجمالي التكلفة:** {{totalAmount}} ريال سعودي
- **نظام الدفع:** {{paymentTerms}}
- **التعديلات:** تعديل مجاني واحد، التعديلات الإضافية بـ {{revisionRate}} ريال/صفحة
`,
    terms: [
      {
        id: 'thesis-1',
        title: 'الأصالة الأكاديمية',
        content: 'نضمن أن جميع المحتويات أصلية وخالية من السرقة الأدبية',
        required: true
      },
      {
        id: 'thesis-2',
        title: 'السرية البحثية',
        content: 'نتعهد بعدم نشر أو مشاركة محتوى البحث مع أي طرف آخر',
        required: true
      }
    ],
    variables: [
      { key: 'thesisType', label: 'نوع الرسالة', type: 'select', required: true, options: ['ماجستير', 'دكتوراه', 'بكالوريوس'] },
      { key: 'major', label: 'التخصص', type: 'text', required: true },
      { key: 'researchTopic', label: 'موضوع البحث', type: 'text', required: true },
      { key: 'pageCount', label: 'عدد الصفحات المتوقع', type: 'number', required: true },
      { key: 'university', label: 'الجامعة', type: 'text', required: true },
      { key: 'revisionRate', label: 'سعر التعديل للصفحة', type: 'number', required: true }
    ]
  },

  // إضافة باقي القوالب...
  'translation-technical': {
    id: 'tpl-technical',
    serviceType: 'translation-technical',
    name: 'عقد ترجمة تقنية',
    content: `# عقد ترجمة تقنية\n\n**بين:** {{agencyName}}\n**والعميل:** {{clientName}}\n\n## الخدمة المطلوبة\nترجمة تقنية متخصصة للمجال: {{technicalField}}\n\n**التفاصيل:**\n- المستندات: {{documentTypes}}\n- عدد الكلمات: {{wordCount}}\n- التسليم: {{deliveryDate}}\n- التكلفة: {{totalAmount}} ريال`,
    terms: [],
    variables: [
      { key: 'technicalField', label: 'المجال التقني', type: 'text', required: true },
      { key: 'documentTypes', label: 'نوع المستندات', type: 'text', required: true }
    ]
  },

  'translation-medical': {
    id: 'tpl-medical',
    serviceType: 'translation-medical',
    name: 'عقد ترجمة طبية',
    content: `# عقد ترجمة طبية\n\nترجمة طبية متخصصة مع ضمان الدقة في المصطلحات الطبية`,
    terms: [],
    variables: []
  },

  'translation-academic': {
    id: 'tpl-academic', 
    serviceType: 'translation-academic',
    name: 'عقد ترجمة أكاديمية',
    content: `# عقد ترجمة أكاديمية\n\nترجمة أكاديمية للأوراق البحثية والمنشورات العلمية`,
    terms: [],
    variables: []
  },

  'translation-literary': {
    id: 'tpl-literary',
    serviceType: 'translation-literary', 
    name: 'عقد ترجمة أدبية',
    content: `# عقد ترجمة أدبية\n\nترجمة أدبية إبداعية تحافظ على روح النص الأصلي`,
    terms: [],
    variables: []
  },

  'translation-media': {
    id: 'tpl-media',
    serviceType: 'translation-media',
    name: 'عقد ترجمة إعلامية', 
    content: `# عقد ترجمة إعلامية\n\nترجمة للمحتوى الإعلامي والمرئي والمسموع`,
    terms: [],
    variables: []
  },

  'research-plan': {
    id: 'tpl-research-plan',
    serviceType: 'research-plan',
    name: 'عقد إعداد خطة بحث',
    content: `# عقد إعداد خطة بحث\n\nإعداد خطة بحث شاملة ومنهجية`,
    terms: [],
    variables: []
  },

  'research-analysis': {
    id: 'tpl-analysis',
    serviceType: 'research-analysis', 
    name: 'عقد تحليل إحصائي',
    content: `# عقد تحليل إحصائي\n\nتحليل البيانات والنتائج الإحصائية باستخدام أحدث البرامج`,
    terms: [],
    variables: []
  },

  'research-formatting': {
    id: 'tpl-formatting',
    serviceType: 'research-formatting',
    name: 'عقد تنسيق أكاديمي',
    content: `# عقد تنسيق أكاديمي\n\nتنسيق الرسائل والأبحاث وفقاً لمعايير الجامعات`,
    terms: [],
    variables: []
  },

  'research-publication': {
    id: 'tpl-publication',
    serviceType: 'research-publication',
    name: 'عقد خدمات النشر',
    content: `# عقد خدمات النشر العلمي\n\nمساعدة في نشر البحوث في المجلات المحكمة`,
    terms: [],
    variables: []
  },

  'research-consultation': {
    id: 'tpl-consultation',
    serviceType: 'research-consultation',
    name: 'عقد استشارة أكاديمية',
    content: `# عقد استشارة أكاديمية\n\nخدمات استشارية متخصصة للباحثين والطلاب`,
    terms: [],
    variables: []
  },

  'custom-service': {
    id: 'tpl-custom',
    serviceType: 'custom-service',
    name: 'عقد خدمة مخصصة',
    content: `# عقد خدمة مخصصة\n\n**الوصف:** {{serviceDescription}}\n**التفاصيل:** {{serviceDetails}}\n**التكلفة:** {{totalAmount}} ريال\n**مدة التنفيذ:** {{duration}}`,
    terms: [],
    variables: [
      { key: 'serviceDescription', label: 'وصف الخدمة', type: 'text', required: true },
      { key: 'serviceDetails', label: 'تفاصيل الخدمة', type: 'text', required: true },
      { key: 'duration', label: 'مدة التنفيذ', type: 'text', required: true }
    ]
  }
};

export const getContractTemplate = (serviceType: ServiceType): ContractTemplate => {
  return contractTemplates[serviceType];
};

export const generateContractContent = (
  template: ContractTemplate, 
  variables: Record<string, string>,
  commonData: {
    agencyName: string;
    clientName: string;
    totalAmount: number;
    deliveryDate: string;
    paymentTerms: string;
  }
): string => {
  let content = template.content;
  
  // استبدال المتغيرات الأساسية
  content = content.replace(/{{agencyName}}/g, commonData.agencyName);
  content = content.replace(/{{clientName}}/g, commonData.clientName);
  content = content.replace(/{{totalAmount}}/g, commonData.totalAmount.toString());
  content = content.replace(/{{deliveryDate}}/g, commonData.deliveryDate);
  content = content.replace(/{{paymentTerms}}/g, commonData.paymentTerms);
  
  // استبدال المتغيرات المخصصة
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    content = content.replace(regex, value);
  });
  
  return content;
};