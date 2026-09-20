export type JournalSource = "existing" | "uploaded";

export interface JournalRecord {
  id: string;
  name: string;
  nameAr?: string;
  website: string;
  issn?: string | null;
  publisher?: string;
  impactFactor?: string;
  quartile?: string;
  citescore?: string;
  sjr?: string;
  subjects?: string[];
  features?: string[];
  source: JournalSource;
  category: string;
}

export const existingJournals: JournalRecord[] = [
  {
    id: "existing-ajer",
    nameAr: "المجلة العربية للبحوث التربوية",
    name: "Arab Journal of Educational Research",
    website: "https://ajer.org.sa",
    publisher: "الجمعية السعودية للعلوم التربوية",
    issn: "2357-0407",
    impactFactor: "1.25",
    quartile: "Q2",
    citescore: "2.1",
    sjr: "0.45",
    subjects: [
      "التربية",
      "علم النفس التربوي",
      "تقنيات التعليم",
      "المناهج",
      "الإدارة التربوية"
    ],
    features: [
      "محكمة دولياً",
      "النشر المفتوح",
      "سرعة التحكيم"
    ],
    source: "existing",
    category: "التربية والعلوم الإنسانية"
  },
  {
    id: "existing-smj",
    nameAr: "المجلة السعودية للعلوم الطبية",
    name: "Saudi Medical Journal",
    website: "https://smj.org.sa",
    publisher: "الجمعية السعودية الطبية",
    issn: "0379-5284",
    impactFactor: "2.45",
    quartile: "Q1",
    citescore: "3.2",
    sjr: "0.78",
    subjects: [
      "الطب العام",
      "الطب الباطني",
      "الجراحة",
      "طب الأطفال",
      "النساء والولادة"
    ],
    features: [
      "معتمدة ISI",
      "سرعة النشر",
      "تحكيم مزدوج"
    ],
    source: "existing",
    category: "الطب والصحة"
  },
  {
    id: "existing-jksu",
    nameAr: "مجلة جامعة الملك سعود للعلوم الهندسية",
    name: "Journal of King Saud University - Engineering Sciences",
    website: "https://jksues.org",
    publisher: "جامعة الملك سعود",
    issn: "1018-3639",
    impactFactor: "3.82",
    quartile: "Q1",
    citescore: "4.5",
    sjr: "1.12",
    subjects: [
      "الهندسة المدنية",
      "الهندسة الميكانيكية",
      "الهندسة الكهربائية",
      "الهندسة الكيميائية",
      "هندسة الحاسوب"
    ],
    features: [
      "Scopus",
      "Web of Science",
      "النشر المفتوح"
    ],
    source: "existing",
    category: "الهندسة والتقنية"
  },
  {
    id: "existing-ajas",
    nameAr: "المجلة العربية للعلوم الإدارية",
    name: "Arab Journal of Administrative Sciences",
    website: "https://ajas.ku.edu.kw",
    publisher: "جامعة الكويت",
    issn: "1029-855X",
    impactFactor: "1.65",
    quartile: "Q2",
    citescore: "2.8",
    sjr: "0.62",
    subjects: [
      "إدارة الأعمال",
      "التسويق",
      "المحاسبة",
      "الموارد البشرية",
      "ريادة الأعمال"
    ],
    features: [
      "محكمة عربياً",
      "تحكيم سريع",
      "نشر إلكتروني"
    ],
    source: "existing",
    category: "الإدارة والاقتصاد"
  },
  {
    id: "existing-islamic",
    nameAr: "مجلة الدراسات الإسلامية",
    name: "Journal of Islamic Studies",
    website: "https://jis.org",
    publisher: "الجامعة الإسلامية بالمدينة المنورة",
    issn: "1658-6301",
    impactFactor: "0.85",
    quartile: "Q3",
    citescore: "1.4",
    subjects: [
      "الدراسات الإسلامية",
      "الفقه",
      "العقيدة",
      "الحديث",
      "التفسير"
    ],
    features: [
      "تحكيم شرعي",
      "نشر متعدد اللغات",
      "أرشيف رقمي"
    ],
    source: "existing",
    category: "متعددة التخصصات"
  },
  {
    id: "existing-ajcs",
    nameAr: "المجلة العربية لعلوم الحاسوب",
    name: "Arab Journal of Computer Science",
    website: "https://ajcs.org",
    publisher: "الجمعية العربية لعلوم الحاسوب",
    issn: "2518-5985",
    impactFactor: "2.15",
    quartile: "Q2",
    citescore: "3.1",
    sjr: "0.89",
    subjects: [
      "علوم الحاسوب",
      "الذكاء الاصطناعي",
      "أمن المعلومات",
      "هندسة البرمجيات",
      "قواعد البيانات"
    ],
    features: [
      "مفهرسة دولياً",
      "مراجعة سريعة",
      "النشر المفتوح"
    ],
    source: "existing",
    category: "الهندسة والتقنية"
  },
  {
    id: "existing-nature",
    nameAr: "مجلة الطبيعة",
    name: "Nature",
    website: "https://nature.com",
    publisher: "Nature Publishing Group",
    issn: "0028-0836",
    impactFactor: "69.504",
    quartile: "Q1",
    citescore: "60.8",
    sjr: "18.32",
    subjects: [
      "العلوم الطبيعية",
      "الفيزياء",
      "الكيمياء",
      "البيولوجيا",
      "علوم الأرض"
    ],
    features: [
      "أعلى تأثير عالمياً",
      "مراجعة صارمة",
      "نشر سريع"
    ],
    source: "existing",
    category: "متعددة التخصصات"
  },
  {
    id: "existing-science",
    nameAr: "مجلة العلوم",
    name: "Science",
    website: "https://science.org",
    publisher: "American Association for the Advancement of Science",
    issn: "0036-8075",
    impactFactor: "63.714",
    quartile: "Q1",
    citescore: "58.5",
    sjr: "17.45",
    subjects: [
      "العلوم متعددة التخصصات",
      "الطب",
      "الهندسة",
      "علوم الحاسوب",
      "البيئة"
    ],
    features: [
      "مجلة رائدة عالمياً",
      "تحكيم دولي",
      "نشر أسبوعي"
    ],
    source: "existing",
    category: "العلوم الطبيعية"
  },
  {
    id: "existing-lancet",
    nameAr: "مجلة لانست الطبية",
    name: "The Lancet",
    website: "https://thelancet.com",
    publisher: "Elsevier",
    issn: "0140-6736",
    impactFactor: "202.731",
    quartile: "Q1",
    citescore: "71.4",
    sjr: "9.13",
    subjects: [
      "الطب العام",
      "الصحة العامة",
      "الطب الباطني",
      "الجراحة",
      "طب الأطفال"
    ],
    features: [
      "أعرق مجلة طبية",
      "تأثير عالمي",
      "مراجعة صارمة"
    ],
    source: "existing",
    category: "متعددة التخصصات"
  },
  {
    id: "existing-amj",
    nameAr: "مجلة الإدارة الأكاديمية",
    name: "Academy of Management Journal",
    website: "https://aom.org/amj",
    publisher: "Academy of Management",
    issn: "0001-4273",
    impactFactor: "9.408",
    quartile: "Q1",
    citescore: "12.8",
    sjr: "4.52",
    subjects: [
      "إدارة الأعمال",
      "السلوك التنظيمي",
      "الاستراتيجية",
      "القيادة",
      "الابتكار"
    ],
    features: [
      "رائدة في الإدارة",
      "تحكيم متقدم",
      "تأثير أكاديمي عالٍ"
    ],
    source: "existing",
    category: "الإدارة والاقتصاد"
  },
  {
    id: "existing-hbr",
    nameAr: "مجلة هارفارد للأعمال",
    name: "Harvard Business Review",
    website: "https://hbr.org",
    publisher: "Harvard Business School",
    issn: "0017-8012",
    impactFactor: "4.65",
    quartile: "Q1",
    citescore: "6.2",
    sjr: "2.18",
    subjects: [
      "استراتيجية الأعمال",
      "القيادة",
      "الإدارة",
      "التسويق",
      "الابتكار"
    ],
    features: [
      "مرجع عالمي",
      "خبراء دوليون",
      "تطبيق عملي"
    ],
    source: "existing",
    category: "الإدارة والاقتصاد"
  },
  {
    id: "existing-ieee",
    nameAr: "مجلة آي تريبل إي للحاسوب",
    name: "IEEE Computer",
    website: "https://computer.org",
    publisher: "IEEE Computer Society",
    issn: "0018-9162",
    impactFactor: "3.872",
    quartile: "Q1",
    citescore: "5.1",
    sjr: "1.85",
    subjects: [
      "علوم الحاسوب",
      "هندسة البرمجيات",
      "الذكاء الاصطناعي",
      "الأمن السيبراني",
      "الحوسبة السحابية"
    ],
    features: [
      "معيار التقنية",
      "مراجعة تقنية",
      "تطبيقات عملية"
    ],
    source: "existing",
    category: "الهندسة والتقنية"
  },
  {
    id: "existing-jam",
    nameAr: "مجلة الرياضيات التطبيقية",
    name: "Journal of Applied Mathematics",
    website: "https://hindawi.com/journals/jam",
    publisher: "Hindawi",
    issn: "1110-757X",
    impactFactor: "1.182",
    quartile: "Q2",
    citescore: "2.4",
    sjr: "0.75",
    subjects: [
      "الرياضيات التطبيقية",
      "الإحصاء",
      "البحوث العملياتية",
      "النمذجة الرياضية",
      "التحليل العددي"
    ],
    features: [
      "نشر مفتوح",
      "مراجعة سريعة",
      "تطبيقات متنوعة"
    ],
    source: "existing",
    category: "العلوم الطبيعية"
  },
  {
    id: "existing-ilj",
    nameAr: "مجلة القانون الدولي",
    name: "International Law Journal",
    website: "https://ilj.org",
    publisher: "Oxford University Press",
    issn: "0020-7853",
    impactFactor: "2.156",
    quartile: "Q1",
    citescore: "3.8",
    sjr: "1.24",
    subjects: [
      "القانون الدولي",
      "حقوق الإنسان",
      "القانون التجاري",
      "القانون البيئي",
      "التحكيم الدولي"
    ],
    features: [
      "مرجع قانوني",
      "خبراء دوليون",
      "تحليل معمق"
    ],
    source: "existing",
    category: "القانون والسياسات"
  }
];

export const uploadedJournals: JournalRecord[] = [
  {
    id: "uploaded-1",
    name: "Best Journal of Innovation in Science, Research and Development",
    issn: "2835-3579",
    website: "https://www.bjisrd.com/index.php/bjisrd",
    source: "uploaded",
    category: "العلوم الطبيعية"
  },
  {
    id: "uploaded-2",
    name: "International Journal of Economy and Innovation",
    issn: "2545-0573",
    website: "https://www.gospodarkainnowacje.pl/index.php/issue_view_32",
    source: "uploaded",
    category: "الإدارة والاقتصاد"
  },
  {
    id: "uploaded-3",
    name: "American Journal of Public Diplomacy and International Studies",
    issn: "2993-2157",
    website: "https://grnjournal.us/index.php/AJPDIS",
    source: "uploaded",
    category: "القانون والسياسات"
  },
  {
    id: "uploaded-4",
    name: "American Journal of Pediatric Medicine and Health Sciences",
    issn: "2993-2149",
    website: "https://grnjournal.us/index.php/AJPMHS",
    source: "uploaded",
    category: "الطب والصحة"
  },
  {
    id: "uploaded-5",
    name: "Intersections of Faith and Culture: American Journal of Religious and Cultural Studies",
    issn: "2993-2599",
    website: "https://grnjournal.us/index.php/AJRCS",
    source: "uploaded",
    category: "التربية والعلوم الإنسانية"
  },
  {
    id: "uploaded-6",
    name: "American Journal of Engineering, Mechanics and Architecture",
    issn: "2993-2637",
    website: "https://grnjournal.us/index.php/AJEMA",
    source: "uploaded",
    category: "الهندسة والتقنية"
  },
  {
    id: "uploaded-7",
    name: "American Journal of Science on Integration and Human Development",
    issn: "2993-2750",
    website: "https://grnjournal.us/index.php/AJSIHD",
    source: "uploaded",
    category: "التربية والعلوم الإنسانية"
  },
  {
    id: "uploaded-8",
    name: "American Journal of Language, Literacy and Learning in STEM Education",
    issn: "2993-2769",
    website: "https://grnjournal.us/index.php/STEM",
    source: "uploaded",
    category: "التربية والعلوم الإنسانية"
  },
  {
    id: "uploaded-9",
    name: "Information Horizons: American Journal of Library and Information Science Innovation",
    issn: "2993-2777",
    website: "https://grnjournal.us/index.php/AJLISI",
    source: "uploaded",
    category: "الهندسة والتقنية"
  },
  {
    id: "uploaded-10",
    name: "European Journal of Life Safety and Stability",
    issn: "2660-9630",
    website: "https://ejlss.indexedresearch.org",
    source: "uploaded",
    category: "متعددة التخصصات"
  },
  {
    id: "uploaded-11",
    name: "Spanish Journal of Innovation and Integrity",
    issn: "2792-8268",
    website: "https://sjii.indexedresearch.org/index.php/sjii/about",
    source: "uploaded",
    category: "متعددة التخصصات"
  },
  {
    id: "uploaded-12",
    name: "EUROPEAN JOURNAL OF BUSINESS STARTUPS AND OPEN SOCIETY",
    issn: "2795-9228",
    website: "https://inovatus.es/index.php/ejbsos",
    source: "uploaded",
    category: "الإدارة والاقتصاد"
  },
  {
    id: "uploaded-13",
    name: "EUROPEAN JOURNAL OF INNOVATION IN NONFORMAL EDUCATION",
    issn: "2795-8612",
    website: "https://inovatus.es/index.php/ejine",
    source: "uploaded",
    category: "التربية والعلوم الإنسانية"
  },
  {
    id: "uploaded-14",
    name: "EUROPEAN JOURNAL OF MODERN MEDICINE AND PRACTICE",
    issn: "2795-921X",
    website: "https://inovatus.es/index.php/ejmmp/about",
    source: "uploaded",
    category: "الطب والصحة"
  },
  {
    id: "uploaded-15",
    name: "International Journal of Integrative and Modern Medicine",
    issn: "2995-5319",
    website: "https://medicaljournals.eu/index.php/IJIMM",
    source: "uploaded",
    category: "الطب والصحة"
  },
  {
    id: "uploaded-16",
    name: "International Journal of Cognitive Neuroscience and Psychology",
    issn: "2995-536X",
    website: "https://medicaljournals.eu/index.php/IJCNP",
    source: "uploaded",
    category: "التربية والعلوم الإنسانية"
  },
  {
    id: "uploaded-17",
    name: "International Journal of Alternative and Contemporary Therapy",
    issn: "2995-5378",
    website: "https://medicaljournals.eu/index.php/IJACT",
    source: "uploaded",
    category: "متعددة التخصصات"
  },
  {
    id: "uploaded-18",
    name: "International Journal of Pediatrics and Genetics",
    issn: "2995-5483",
    website: "https://medicaljournals.eu/index.php/IJPG",
    source: "uploaded",
    category: "الطب والصحة"
  },
  {
    id: "uploaded-19",
    name: "Excellencia: International Multi-disciplinary Journal of Education",
    issn: "2994-9521",
    website: "https://multijournals.org/index.php/excellencia-imje",
    source: "uploaded",
    category: "التربية والعلوم الإنسانية"
  },
  {
    id: "uploaded-20",
    name: "Synergy: Cross-Disciplinary Journal of Digital Investigation",
    issn: "2995-4827",
    website: "https://multijournals.org/index.php/synergy",
    source: "uploaded",
    category: "متعددة التخصصات"
  },
  {
    id: "uploaded-21",
    name: "Valeology: International Journal of Medical Anthropology and Bioethics",
    issn: "2995-4924",
    website: "https://multijournals.org/index.php/valeology",
    source: "uploaded",
    category: "الطب والصحة"
  },
  {
    id: "uploaded-22",
    name: "Innovative: International Multidisciplinary Journal of Applied Technology",
    issn: "2995-486X",
    website: "https://multijournals.org/index.php/innovative",
    source: "uploaded",
    category: "الهندسة والتقنية"
  },
  {
    id: "uploaded-23",
    name: "Miasto Przyszłości",
    issn: "2544-980X",
    website: "https://miastoprzyszlosci.com.pl/index.php/mp",
    source: "uploaded",
    category: "متعددة التخصصات"
  },
  {
    id: "uploaded-24",
    name: "International Journal of Formal Education",
    issn: "2720-6874",
    website: "https://journals.academiczone.net/index.php/ijfe/about",
    source: "uploaded",
    category: "التربية والعلوم الإنسانية"
  },
  {
    id: "uploaded-25",
    name: "Journal of Intellectual Property and Human Rights",
    issn: "2720-6882",
    website: "https://journals.academiczone.net/index.php/jiphr",
    source: "uploaded",
    category: "التربية والعلوم الإنسانية"
  },
  {
    id: "uploaded-26",
    name: "Research Journal of Trauma and Disability Studies",
    issn: "2720-6866",
    website: "https://journals.academiczone.net/index.php/rjtds",
    source: "uploaded",
    category: "متعددة التخصصات"
  },
  {
    id: "uploaded-27",
    name: "American Journal of Biodiversity",
    issn: "2997-3600",
    website: "https://biojournals.us/index.php/AJB",
    source: "uploaded",
    category: "متعددة التخصصات"
  },
  {
    id: "uploaded-28",
    name: "American Journal of Biology and Natural Sciences",
    issn: "2997-7185",
    website: "https://biojournals.us/index.php/AJBNS",
    source: "uploaded",
    category: "الطب والصحة"
  },
  {
    id: "uploaded-29",
    name: "American Journal of Biomedicine and Pharmacy",
    issn: "2997-7177",
    website: "https://biojournals.us/index.php/AJBP",
    source: "uploaded",
    category: "الطب والصحة"
  },
  {
    id: "uploaded-30",
    name: "American Journal of Botany and Bioengineering",
    issn: "2997-9331",
    website: "https://biojournals.us/index.php/AJBB",
    source: "uploaded",
    category: "الهندسة والتقنية"
  },
  {
    id: "uploaded-31",
    name: "American Journal of Bioscience and Clinical Integrity",
    issn: "2997-7347",
    website: "https://biojournals.us/index.php/AJBCI",
    source: "uploaded",
    category: "الطب والصحة"
  },
  {
    id: "uploaded-32",
    name: "International Journal of Informatics and Data Science Research",
    issn: "2997-3961",
    website: "https://scientificbulletin.com/index.php/IJIDSR",
    source: "uploaded",
    category: "العلوم الطبيعية"
  },
  {
    id: "uploaded-33",
    name: "American Journal of Alternative Education",
    issn: "2997-3953",
    website: "https://scientificbulletin.com/index.php/AJAE",
    source: "uploaded",
    category: "التربية والعلوم الإنسانية"
  },
  {
    id: "uploaded-34",
    name: "Journal of Adaptive Learning Technologies",
    issn: "2997-3902",
    website: "https://scientificbulletin.com/index.php/JALT",
    source: "uploaded",
    category: "متعددة التخصصات"
  },
  {
    id: "uploaded-35",
    name: "American Journal of Open University Education",
    issn: "2997-3899",
    website: "https://scientificbulletin.com/index.php/AJOUP",
    source: "uploaded",
    category: "التربية والعلوم الإنسانية"
  },
  {
    id: "uploaded-36",
    name: "American Journal of Business Practice",
    issn: "2997-934X",
    website: "https://semantjournals.org/index.php/AJBP",
    source: "uploaded",
    category: "الإدارة والاقتصاد"
  },
  {
    id: "uploaded-37",
    name: "American Journal of Management Practice",
    issn: "2997-9366",
    website: "https://semantjournals.org/index.php/AJMP",
    source: "uploaded",
    category: "الإدارة والاقتصاد"
  },
  {
    id: "uploaded-38",
    name: "American Journal of Technology Advancement",
    issn: "2997-9382",
    website: "https://semantjournals.org/index.php/AJTA",
    source: "uploaded",
    category: "الهندسة والتقنية"
  },
  {
    id: "uploaded-39",
    name: "American Journal of Corporate Management",
    issn: "2997-9404",
    website: "https://semantjournals.org/index.php/AJCM",
    source: "uploaded",
    category: "الإدارة والاقتصاد"
  },
  {
    id: "uploaded-40",
    name: "American Journal of Political Science and Leadership Studies",
    issn: "2997-9420",
    website: "https://semantjournals.org/index.php/AJPSLS",
    source: "uploaded",
    category: "القانون والسياسات"
  },
  {
    id: "uploaded-41",
    name: "American Journal of Education and Evaluation Studies",
    issn: "2997-9439",
    website: "https://semantjournals.org/index.php/AJEES",
    source: "uploaded",
    category: "التربية والعلوم الإنسانية"
  },
  {
    id: "uploaded-42",
    name: "American Journal of Religious, Culture and Archeological Studies",
    issn: "2997-948X",
    website: "https://semantjournals.org/index.php/AJRCAS",
    source: "uploaded",
    category: "التربية والعلوم الإنسانية"
  },
  {
    id: "uploaded-43",
    name: "International Journal of Leadership and Innovative Management",
    issn: "3064-7258",
    website: "https://eminentpublishing.us/index.php/IJLIM",
    source: "uploaded",
    category: "الإدارة والاقتصاد"
  },
  {
    id: "uploaded-44",
    name: "CartoGeodesy: Journal of Geodetic and Cartography Horizons",
    issn: "3064-7231",
    website: "https://eminentpublishing.us/index.php/CartoGeodesy",
    source: "uploaded",
    category: "متعددة التخصصات"
  },
  {
    id: "uploaded-45",
    name: "International Journal of Project Resources and Performances Management",
    issn: "3064-7207",
    website: "https://eminentpublishing.us/index.php/IJPRPM",
    source: "uploaded",
    category: "الإدارة والاقتصاد"
  },
  {
    id: "uploaded-46",
    name: "Insight: Advances in Research in Radiophysics and Electronics",
    issn: "3064-7274",
    website: "https://eminentpublishing.us/index.php/insight",
    source: "uploaded",
    category: "العلوم الطبيعية"
  },
  {
    id: "uploaded-47",
    name: "Quest: Journal of Geometry, Mathematical and Quantum Physics",
    issn: "3064-7282",
    website: "https://eminentpublishing.us/index.php/quest",
    source: "uploaded",
    category: "العلوم الطبيعية"
  },
  {
    id: "uploaded-48",
    name: "Cognify : Journal of Artificial Intelligence and Cognitive Science",
    issn: "3066-3466",
    website: "https://researchvision.us/index.php/cognify",
    source: "uploaded",
    category: "الهندسة والتقنية"
  },
  {
    id: "uploaded-49",
    name: "iMechanica: Journal of Applied Mechanics and Vocational Training",
    issn: "3066-3474",
    website: "https://researchvision.us/index.php/iMechanica",
    source: "uploaded",
    category: "الهندسة والتقنية"
  },
  {
    id: "uploaded-50",
    name: "Smartify: Journal of Smart Education and Pedagogy",
    issn: "066-3482",
    website: "https://researchvision.us/index.php/smartify",
    source: "uploaded",
    category: "التربية والعلوم الإنسانية"
  },
  {
    id: "uploaded-51",
    name: "Odontia : Journal of Dental Innovations and Oral Health",
    issn: "3066-361X",
    website: "https://researchvision.us/index.php/Odontia",
    source: "uploaded",
    category: "الطب والصحة"
  },
  {
    id: "uploaded-52",
    name: "Symmetria : Journal of Advanced Physics and Mathematical Review",
    issn: "3066-3636",
    website: "https://researchvision.us/index.php/symmetria",
    source: "uploaded",
    category: "العلوم الطبيعية"
  },
  {
    id: "uploaded-53",
    name: "IQTISODIYOT VA ZAMONAVIY TEXNOLOGIYA JURNALI | JOURNAL OF ECONOMY AND MODERN TECHNOLOGY",
    issn: "2992-8907",
    website: "https://www.mudarrisziyo.uz/index.php/iqtisodiyot",
    source: "uploaded",
    category: "الهندسة والتقنية"
  },
  {
    id: "uploaded-54",
    name: "AMALIY VA FUNDAMENTAL TADQIQOTLAR (JOURNAL OF APPLIED AND FUNDAMENTAL RESEARCH",
    issn: "2992-8923",
    website: "https://www.mudarrisziyo.uz/index.php/amaliy/about",
    source: "uploaded",
    category: "متعددة التخصصات"
  },
  {
    id: "uploaded-55",
    name: "PEDAGOGIKA, PSIXOLOGIYА VA IJTIMOIY TADQIQOTLAR (JOURNAL OF PEDAGOGY, PSYCHOLOGY AND SOCIAL RESEARCH",
    issn: "2992-8931",
    website: "https://www.mudarrisziyo.uz/index.php/pedagogika",
    source: "uploaded",
    category: "التربية والعلوم الإنسانية"
  },
  {
    id: "uploaded-56",
    name: "FAN, TA’LIM, MADANIYAT VA INNOVATSIYA JURNALI (JOURNAL OF SCIENCE, EDUCATION, CULTURE AND INNOVATION",
    issn: "2992-8931",
    website: "https://www.mudarrisziyo.uz/index.php/innovatsiya",
    source: "uploaded",
    category: "التربية والعلوم الإنسانية"
  },
  {
    id: "uploaded-57",
    name: "SCIENTIFIC JOURNAL OF APPLIED AND MEDICAL SCIENCES",
    issn: "2181-3469",
    website: "https://sciencebox.uz/index.php/amaltibbiyot",
    source: "uploaded",
    category: "الطب والصحة"
  },
  {
    id: "uploaded-58",
    name: "BARQARORLIK VA YETAKCHI TADQIQOTLAR ONLAYN ILMIY JURNALI",
    issn: "2181-2608",
    website: "https://sciencebox.uz/index.php/jars",
    source: "uploaded",
    category: "متعددة التخصصات"
  },
  {
    id: "uploaded-59",
    name: "SIYOSATSHUNOSLIK, HUQUQ VA XALQARO MUNOSABATLAR JURNALI",
    issn: "2181-3477",
    website: "https://sciencebox.uz/index.php/siyosatshunoslik",
    source: "uploaded",
    category: "متعددة التخصصات"
  },
  {
    id: "uploaded-60",
    name: "AGROBIOTEXNOLOGIYA VA VETERINARIYA TIBBIYOTI ILMIY JURNALI",
    issn: "2181-3450",
    website: "https://sciencebox.uz/index.php/tibbiyot",
    source: "uploaded",
    category: "متعددة التخصصات"
  },
  {
    id: "uploaded-61",
    name: "ARXITEKTURA, MUHANDISLIK VA ZAMONAVIY TEXNOLOGIYALAR JURNALI",
    issn: "2181-3464",
    website: "https://sciencebox.uz/index.php/arxitektura",
    source: "uploaded",
    category: "متعددة التخصصات"
  },
  {
    id: "uploaded-62",
    name: "BOSHQARUV VA ETIKA QOIDALARI ONLAYN ILMIY JURNALI",
    issn: "2181-2616",
    website: "https://sciencebox.uz/index.php/sjeg",
    source: "uploaded",
    category: "متعددة التخصصات"
  },
  {
    id: "uploaded-63",
    name: "IJTIMOIY FANLARDA INNOVATSIYA ONLAYN ILMIY JURNALI",
    issn: "2181-2594",
    website: "https://sciencebox.uz/index.php/jis",
    source: "uploaded",
    category: "متعددة التخصصات"
  },
  {
    id: "uploaded-64",
    name: "TA'LIM VA RIVOJLANISH TAHLILI ONLAYN ILMIY JURNALI",
    issn: "2181-2624",
    website: "https://sciencebox.uz/index.php/ajed",
    source: "uploaded",
    category: "متعددة التخصصات"
  },
  {
    id: "uploaded-65",
    name: "World of Semantics: Journal of Philosophy and Linguistics",
    issn: null,
    website: "https://wos.semanticjournals.org/index.php/JPL",
    source: "uploaded",
    category: "متعددة التخصصات"
  },
  {
    id: "uploaded-66",
    name: "World of Medicine: Journal of Biomedical Sciences",
    issn: "2960-9356",
    website: "https://wom.semanticjournals.org/index.php/biomed",
    source: "uploaded",
    category: "الطب والصحة"
  },
  {
    id: "uploaded-67",
    name: "Web of Semantics: Journal of Interdisciplinary Science",
    issn: "2960-9550",
    website: "https://web.semanticjournals.org/index.php/wos",
    source: "uploaded",
    category: "العلوم الطبيعية"
  },
  {
    id: "uploaded-68",
    name: "RAQAMLI IQTISODIYOT, BIZNES VA INNOVATSIYALAR JURNALI",
    issn: "3060-4753",
    website: "https://qomar.uz/index.php/RIBIJ",
    source: "uploaded",
    category: "متعددة التخصصات"
  },
  {
    id: "uploaded-69",
    name: "ADABIYOT VA LINGVISTIKA TADQIQOTLARI JURNALI",
    issn: null,
    website: "https://qomar.uz/index.php/ALTJ",
    source: "uploaded",
    category: "متعددة التخصصات"
  },
  {
    id: "uploaded-70",
    name: "MARKAZIY OSIYO MADANIY ME'ROSI VA TURIZM TENDENSIYALARI JURNALI",
    issn: "3060-4834",
    website: "https://qomar.uz/index.php/MOSTTJ",
    source: "uploaded",
    category: "متعددة التخصصات"
  },
  {
    id: "uploaded-71",
    name: "TIBBIYOT ILMIY TADQIQOTLARI JURNALI",
    issn: null,
    website: "https://qomar.uz/index.php/TITJ",
    source: "uploaded",
    category: "متعددة التخصصات"
  },
  {
    id: "uploaded-72",
    name: "IQTISODIYOT VA XALQARO MUNOSABATLAR ONLAYN ILMIY JURNALI",
    issn: null,
    website: "https://economia.uz/index.php/IXMOIJ",
    source: "uploaded",
    category: "متعددة التخصصات"
  },
  {
    id: "uploaded-73",
    name: "MENEJMENT VA MEHNAT MUNOSABATLARI ONLAYN ILMIY JURNALI",
    issn: null,
    website: "https://economia.uz/index.php/MMMOIJ",
    source: "uploaded",
    category: "متعددة التخصصات"
  },
  {
    id: "uploaded-74",
    name: "Journal of Economy, Tourism and Service",
    issn: "2181-435X",
    website: "https://jets.innovascience.uz/index.php/jets",
    source: "uploaded",
    category: "الإدارة والاقتصاد"
  },
  {
    id: "uploaded-75",
    name: "Journal of Healthcare and Life-Science Research",
    issn: "2181-4368",
    website: "https://jhlsr.innovascience.uz/index.php/jhlsr",
    source: "uploaded",
    category: "الطب والصحة"
  },
  {
    id: "uploaded-76",
    name: "Journal of theory, mathematics and physics",
    issn: "2181-4376",
    website: "https://jtmp.innovascience.uz/index.php/journal",
    source: "uploaded",
    category: "العلوم الطبيعية"
  },
  {
    id: "uploaded-77",
    name: "Journal of engineering, mechanics and modern architecture",
    issn: "2181-4384",
    website: "https://jemma.innovascience.uz/index.php/jemma",
    source: "uploaded",
    category: "الهندسة والتقنية"
  },
  {
    id: "uploaded-78",
    name: "Journal of education, ethics and value",
    issn: "2181-4392",
    website: "https://jeev.innovascience.uz/index.php/jeev",
    source: "uploaded",
    category: "التربية والعلوم الإنسانية"
  },
  {
    id: "uploaded-79",
    name: "Journal of science, research and teaching",
    issn: "2181-4406",
    website: "https://jsrt.innovascience.uz/index.php/jsrt",
    source: "uploaded",
    category: "العلوم الطبيعية"
  },
  {
    id: "uploaded-80",
    name: "Journal of Innovation, Creativity and Art (JICA)",
    issn: "2181-4287",
    website: "https://jica.innovascience.uz/index.php/jica",
    source: "uploaded",
    category: "متعددة التخصصات"
  },
  {
    id: "uploaded-81",
    name: "Journal of Innovation in Education and Social Research",
    issn: "2992-894X",
    website: "https://journal.proindex.uz/index.php/jiesr",
    source: "uploaded",
    category: "التربية والعلوم الإنسانية"
  },
  {
    id: "uploaded-82",
    name: "Journal of Research in Innovative Teaching and Inclusive Learning",
    issn: "3030-3036",
    website: "https://journal.proindex.uz/index.php/JRITIL",
    source: "uploaded",
    category: "متعددة التخصصات"
  },
  {
    id: "uploaded-83",
    name: "Journal of Science in Medicine and Life",
    issn: "2992-9202",
    website: "https://journal.proindex.uz/index.php/JSML",
    source: "uploaded",
    category: "الطب والصحة"
  },
  {
    id: "uploaded-84",
    name: "Journal of Discoveries in Applied and Natural Science",
    issn: "3030-301X",
    website: "https://journal.proindex.uz/index.php/JDANS",
    source: "uploaded",
    category: "العلوم الطبيعية"
  },
  {
    id: "uploaded-85",
    name: "Journal of Creativity in Art and Design",
    issn: "3030-3028",
    website: "https://journal.proindex.uz/index.php/JCAD",
    source: "uploaded",
    category: "متعددة التخصصات"
  },
  {
    id: "uploaded-86",
    name: "Journal of Integrity in Ecosystems and Environment",
    issn: "3030-3729",
    website: "https://journal.proindex.uz/index.php/JIEE",
    source: "uploaded",
    category: "العلوم الطبيعية"
  },
  {
    id: "uploaded-87",
    name: "Journal of Sustainability in Integrated Policy and Practice",
    issn: null,
    website: "https://journal.proindex.uz/index.php/SIPP",
    source: "uploaded",
    category: "القانون والسياسات"
  },
  {
    id: "uploaded-88",
    name: "IQTISODIYOT VA ZAMONAVIY TEXNOLOGIYA",
    issn: "2992-8907",
    website: "https://mudarrisziyo.uz/index.php/iqtisodiyot",
    source: "uploaded",
    category: "متعددة التخصصات"
  },
  {
    id: "uploaded-89",
    name: "AMALIY VA FUNDAMENTAL TADQIQOTLAR",
    issn: null,
    website: "https://mudarrisziyo.uz/index.php/amaliy",
    source: "uploaded",
    category: "متعددة التخصصات"
  },
  {
    id: "uploaded-90",
    name: "PEDAGOGIKA, PSIXOLOGIYA VA IJTIMOIY TADQIQOTLAR",
    issn: "2992-8931",
    website: "https://mudarrisziyo.uz/index.php/pedagogika",
    source: "uploaded",
    category: "التربية والعلوم الإنسانية"
  },
  {
    id: "uploaded-91",
    name: "FAN, TA'LIM, MADANIYAT VA INNOVATSIYA JURNALI",
    issn: "2992-8915",
    website: "https://mudarrisziyo.uz/index.php/innovatsiya",
    source: "uploaded",
    category: "متعددة التخصصات"
  },
  {
    id: "uploaded-92",
    name: "Journal of Intelligent Decision Making and Information Science",
    nameAr: "مجلة اتخاذ القرار الذكي وعلوم المعلومات",
    issn: "2709-337X",
    website: "https://jidmis.com",
    publisher: "Intelligent Decision Making and Information Science",
    subjects: [
      "اتخاذ القرار الذكي",
      "علوم المعلومات",
      "الذكاء الاصطناعي",
      "تحليل البيانات"
    ],
    features: [
      "مجلة علمية محكمة",
      "نشر دولي",
      "تخصصات الذكاء الاصطناعي"
    ],
    source: "uploaded",
    category: "الهندسة والتقنية"
  },
  {
    id: "uploaded-93",
    name: "Natural Resources for Human Health",
    nameAr: "الموارد الطبيعية لصحة الإنسان",
    issn: "2583-1194",
    website: "https://www.nrfhh.com",
    publisher: "Natural Resources for Human Health",
    subjects: [
      "علم الأحياء",
      "الكيمياء الطبية",
      "الكيمياء الزراعية والغذائية",
      "الطب التقليدي",
      "تطبيقات الموارد الطبيعية"
    ],
    features: [
      "مجلة علمية محكمة",
      "نشر فصلي",
      "وصول مفتوح"
    ],
    source: "uploaded",
    category: "العلوم الطبيعية"
  }
];

export const journals: JournalRecord[] = [...existingJournals, ...uploadedJournals];
