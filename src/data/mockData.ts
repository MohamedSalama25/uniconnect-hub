export interface Student {
  id: string;
  name: string;
  university: string;
  city: string;
  phone: string;
  rating: number;
  avatar: string;
}

export interface Accommodation {
  id: string;
  title: string;
  image: string;
  images: string[];
  price: number;
  distance: number;
  type: 'shared' | 'private';
  rating: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  description: string;
  hostName: string;
  hostAvatar: string;
  lat?: number;
  lng?: number;
}

export interface Service {
  id: string;
  name: string;
  category: 'restaurant' | 'pharmacy' | 'hospital' | 'laundry' | 'transportation';
  distance: number;
  rating: number;
  address: string;
  phone: string;
  hours: string;
  lat?: number;
  lng?: number;
}

export interface HelpRequest {
  id: string;
  title: string;
  description: string;
  category: 'housing' | 'academic' | 'social' | 'emergency' | 'other';
  timePosted: string;
  author: string;
  responses: number;
}

export interface ChatConversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'me' | 'other';
  time: string;
}

export const currentStudent: Student = {
  id: '1',
  name: 'أحمد محمد',
  university: 'جامعة القاهرة',
  city: 'القاهرة',
  phone: '+20 123 456 7890',
  rating: 4.8,
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
};

export const accommodations: Accommodation[] = [
  {
    id: '1',
    title: 'شقة مفروشة قرب الجامعة',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&height=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&height=600&fit=crop',
      'https://images.unsplash.com/photo-1522770179533-24471fcdba45?w=800&height=600&fit=crop',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&height=600&fit=crop',
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&height=600&fit=crop'
    ],
    price: 3500,
    distance: 0.5,
    type: 'private',
    rating: 4.5,
    location: 'الدقي، الجيزة',
    bedrooms: 2,
    bathrooms: 1,
    amenities: ['واي فاي', 'مكيف', 'غسالة', 'مطبخ مجهز', 'أمن 24 ساعة'],
    description: 'شقة واسعة ومجهزة بالكامل تقع في قلب منطقة الدقي، على بعد دقائق معدودة من جامعة القاهرة. تتميز الشقة بتصميم عصري وإطلالة رائعة، وهي مثالية للطلاب الذين يبحثون عن الراحة والخصوصية.',
    hostName: 'محمود خليل',
    hostAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    lat: 30.0444,
    lng: 31.2357
  },
  {
    id: '2',
    title: 'غرفة مشتركة للطلاب',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&height=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&height=600&fit=crop',
      'https://images.unsplash.com/photo-1505693357370-58cbe84a7a91?w=800&height=600&fit=crop',
      'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&height=600&fit=crop'
    ],
    price: 1500,
    distance: 1.2,
    type: 'shared',
    rating: 4.2,
    location: 'المهندسين، الجيزة',
    bedrooms: 1,
    bathrooms: 1,
    amenities: ['واي فاي', 'مكيف', 'مطبخ مشترك', 'منطقة دراسة'],
    description: 'غرفة مرتبة ونظيفة في شقة سكنية هادئة مخصصة للطلاب. الموقع ممتاز بالقرب من وسائل المواصلات والخدمات العامة. بيئة دراسية محفزة ورفقاء سكن متعاونون.',
    hostName: 'أحمد سعيد',
    hostAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    lat: 30.0480,
    lng: 31.2300
  },
  {
    id: '3',
    title: 'استوديو حديث التجهيز',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&height=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&height=600&fit=crop',
      'https://images.unsplash.com/photo-1502672023488-70e25813efdf?w=800&height=600&fit=crop',
      'https://images.unsplash.com/photo-1536376074432-84426582920b?w=800&height=600&fit=crop'
    ],
    price: 4000,
    distance: 0.8,
    type: 'private',
    rating: 4.8,
    location: 'الزمالك، القاهرة',
    bedrooms: 1,
    bathrooms: 1,
    amenities: ['واي فاي', 'مكيف', 'غسالة', 'مطبخ مجهز', 'تراس', 'مصعد'],
    description: 'استوديو أنيق بتصميم مودرن في أرقى أحياء القاهرة. مجهز بذكاء لاستغلال المساحات، ويحتوي على كل المرافق التي قد يحتاجها الطالب لحياة مريحة ومستقلة.',
    hostName: 'هالة منصور',
    hostAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop'
  },
  {
    id: '4',
    title: 'شقة طلابية مشتركة',
    image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&height=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&height=600&fit=crop',
      'https://images.unsplash.com/photo-1522770179533-24471fcdba45?w=800&height=600&fit=crop'
    ],
    price: 2000,
    distance: 1.5,
    type: 'shared',
    rating: 4.0,
    location: 'مدينة نصر، القاهرة',
    bedrooms: 3,
    bathrooms: 2,
    amenities: ['واي فاي', 'مكيف', 'مطبخ مشترك', 'غرفة معيشة', 'شرفة'],
    description: 'شقة فسيحة تضم عدة غرف للطلاب. تقع بمنطقة حيوية قريبة من مراكز التسوق والمطاعم. مساحات مشتركة واسعة تسمح بالتواصل والراحة.',
    hostName: 'ياسين علي',
    hostAvatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop'
  },
  {
    id: '5',
    title: 'شقة فاخرة بإطلالة مميزة',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&height=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&height=600&fit=crop',
      'https://images.unsplash.com/photo-1515263487990-61b07816b324?w=800&height=600&fit=crop',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&height=600&fit=crop'
    ],
    price: 6000,
    distance: 2.0,
    type: 'private',
    rating: 4.9,
    location: 'المعادي، القاهرة',
    bedrooms: 3,
    bathrooms: 2,
    amenities: ['واي فاي', 'مكيف', 'غسالة', 'مطبخ مجهز', 'حمام سباحة', 'جيم', 'حديقة'],
    description: 'تجربة سكنية استثنائية في أرقى كمبوندات المعادي. إطلالة بانورامية ومرافق ترفيهية متكاملة لضمان أعلى مستويات الرفاهية والتركيز.',
    hostName: 'سارة فريد',
    hostAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop'
  },
  {
    id: '6',
    title: 'غرفة مريحة قرب المترو',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&height=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&height=600&fit=crop',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&height=600&fit=crop'
    ],
    price: 1800,
    distance: 0.3,
    type: 'shared',
    rating: 4.3,
    location: 'الدقي، الجيزة',
    bedrooms: 1,
    bathrooms: 1,
    amenities: ['واي فاي', 'مكيف', 'قريب من المترو'],
    description: 'غرفة مؤثثة بعناية في موقع استراتيجي جداً بالقرب من محطة المترو، مما يسهل التنقل إلى الجامعة وأي مكان في القاهرة والجيزة.',
    hostName: 'مريم الصاوي',
    hostAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop'
  },
];

export const services: Service[] = [
  {
    id: '1',
    name: 'مطعم الشرق',
    category: 'restaurant',
    distance: 0.3,
    rating: 4.5,
    address: 'شارع جامعة القاهرة، الجيزة',
    phone: '+20 2 3567 8901',
    hours: '10:00 ص - 12:00 م',
    lat: 30.0420,
    lng: 31.2380
  },
  {
    id: '2',
    name: 'صيدلية الحياة',
    category: 'pharmacy',
    distance: 0.5,
    rating: 4.8,
    address: 'شارع الدقي، الجيزة',
    phone: '+20 2 3765 4321',
    hours: '24 ساعة',
    lat: 30.0460,
    lng: 31.2330
  },
  {
    id: '3',
    name: 'مستشفى الجامعة',
    category: 'hospital',
    distance: 1.0,
    rating: 4.2,
    address: 'داخل حرم الجامعة',
    phone: '+20 2 3567 0000',
    hours: '24 ساعة',
  },
  {
    id: '4',
    name: 'مغسلة النظافة',
    category: 'laundry',
    distance: 0.4,
    rating: 4.0,
    address: 'شارع المهندسين، الجيزة',
    phone: '+20 2 3456 7890',
    hours: '8:00 ص - 10:00 م',
  },
  {
    id: '5',
    name: 'محطة مترو الدقي',
    category: 'transportation',
    distance: 0.2,
    rating: 4.3,
    address: 'ميدان الدقي',
    phone: '+20 2 3000 0000',
    hours: '5:00 ص - 1:00 م',
  },
  {
    id: '6',
    name: 'مطعم البيت',
    category: 'restaurant',
    distance: 0.6,
    rating: 4.7,
    address: 'شارع التحرير، الدقي',
    phone: '+20 2 3789 0123',
    hours: '12:00 م - 11:00 م',
  },
];

export const helpRequests: HelpRequest[] = [
  {
    id: '1',
    title: 'مساعدة في إيجاد سكن قريب من الجامعة',
    description: 'أبحث عن شقة مشتركة قريبة من جامعة القاهرة، ميزانيتي 2000 جنيه شهرياً',
    category: 'housing',
    timePosted: 'منذ ساعتين',
    author: 'محمد أحمد',
    responses: 5,
  },
  {
    id: '2',
    title: 'استفسار عن التسجيل في الكلية',
    description: 'هل يمكن أحد مساعدتي في إجراءات التسجيل للفصل الدراسي القادم؟',
    category: 'academic',
    timePosted: 'منذ 5 ساعات',
    author: 'فاطمة علي',
    responses: 8,
  },
  {
    id: '3',
    title: 'البحث عن مجموعة دراسية',
    description: 'أريد الانضمام لمجموعة دراسية لمادة الرياضيات المتقدمة',
    category: 'social',
    timePosted: 'منذ يوم',
    author: 'عمر خالد',
    responses: 3,
  },
  {
    id: '4',
    title: 'مساعدة عاجلة - فقدت جواز السفر',
    description: 'فقدت جواز سفري في منطقة الجامعة، أرجو المساعدة',
    category: 'emergency',
    timePosted: 'منذ 30 دقيقة',
    author: 'سارة يوسف',
    responses: 12,
  },
];

export const chatConversations: ChatConversation[] = [
  {
    id: '1',
    name: 'صاحب الشقة - أحمد',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face',
    lastMessage: 'نعم الشقة متاحة للمعاينة غداً',
    time: 'منذ 5 دقائق',
    unread: 2,
  },
  {
    id: '2',
    name: 'مجموعة الدراسة',
    avatar: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=50&h=50&fit=crop',
    lastMessage: 'الاجتماع غداً الساعة 4 عصراً',
    time: 'منذ ساعة',
    unread: 0,
  },
  {
    id: '3',
    name: 'خدمة الطلاب',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=50&h=50&fit=crop&crop=face',
    lastMessage: 'تم استلام طلبك وسيتم الرد قريباً',
    time: 'منذ 3 ساعات',
    unread: 1,
  },
];

export const chatMessages: ChatMessage[] = [
  {
    id: '1',
    content: 'مرحباً، أريد الاستفسار عن الشقة المعروضة',
    sender: 'me',
    time: '10:00 ص',
  },
  {
    id: '2',
    content: 'أهلاً بك! نعم الشقة متاحة حالياً',
    sender: 'other',
    time: '10:05 ص',
  },
  {
    id: '3',
    content: 'هل يمكنني معاينتها؟',
    sender: 'me',
    time: '10:10 ص',
  },
  {
    id: '4',
    content: 'نعم الشقة متاحة للمعاينة غداً',
    sender: 'other',
    time: '10:15 ص',
  },
];

export const stats = {
  availableAccommodations: 156,
  nearbyServices: 42,
  activeChats: 3,
  helpRequests: 28,
};
