// ─────────────────────────────────────────────────────────────────────────
//  Двуязычность EN / UK. Английский — язык по умолчанию (без префикса нет,
//  все маршруты под /en и /uk). Хелперы: t(), localizePath(), getLangFromUrl().
// ─────────────────────────────────────────────────────────────────────────

export const languages = { en: 'EN', uk: 'UK' } as const;
export type Lang = keyof typeof languages;
export const defaultLang: Lang = 'en';

export function isLang(value: string | undefined): value is Lang {
  return value === 'en' || value === 'uk';
}

/** Берёт нужный язык из объекта { en, uk } (с fallback на английский). */
export function pick<T>(field: Record<string, T> | undefined, lang: Lang): T | undefined {
  if (!field) return undefined;
  return field[lang] ?? field[defaultLang];
}

/** Префиксует внутренний путь языком: ('/catalog','uk') -> '/uk/catalog'. */
export function localizePath(path: string, lang: Lang): string {
  if (path === '/' || path === '') return `/${lang}`;
  return `/${lang}${path.startsWith('/') ? path : '/' + path}`;
}

export function getLangFromUrl(url: URL): Lang {
  const seg = url.pathname.split('/').filter(Boolean)[0];
  return isLang(seg) ? seg : defaultLang;
}

export const ui = {
  en: {
    // nav
    'nav.home': 'Home',
    'nav.catalog': 'Catalog',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    // common
    'common.requestQuote': 'Request Quote',
    'common.viewCatalog': 'View Catalog',
    'common.details': 'Details',
    'common.viewDetails': 'View Details',
    'common.downloadCatalog': 'Download catalog (PDF)',
    'common.drawings': 'Technical Drawings',
    // home hero
    'home.label': 'Unmanned Robotic Systems',
    'home.title': 'Robotic Systems<br>for Ground, Air & <span class="accent">Sea</span>',
    'home.sub': 'Ground, aerial and underwater unmanned platforms with in-house BLDC drives and ESCs. B2B supply · OEM partnerships · technical documentation included.',
    'home.stat1.v': '11', 'home.stat1.l': 'Platforms in catalog',
    'home.stat2.v': 'Land·Air·Sea', 'home.stat2.l': 'Domains covered',
    'home.stat3.v': 'OEM', 'home.stat3.l': 'Custom orders',
    'home.products.label': 'Catalog',
    'home.products.title': 'Featured Systems',
    'home.viewFullCatalog': 'View Full Catalog',
    'home.val1.t': 'Field-proven', 'home.val1.d': 'Platforms designed for the line of contact and grey zones',
    'home.val2.t': 'In-house drive', 'home.val2.d': 'Own BLDC motors and next-generation ESCs across the range',
    'home.val3.t': 'Documentation', 'home.val3.d': '3D models and full specifications for every platform',
    // catalog
    'catalog.title': 'Product Catalog',
    'catalog.sub': 'Browse our range of unmanned ground, aerial and underwater systems.',
    'catalog.search': 'Search products...',
    'catalog.empty': 'No products found. Try adjusting your search or filters.',
    'catalog.showing': 'Showing', 'catalog.of': 'of', 'catalog.products': 'products',
    'catalog.prev': 'Previous', 'catalog.next': 'Next', 'catalog.page': 'Page', 'catalog.pageOf': 'of',
    'catalog.browseRange': 'Browse our range of',
    // product
    'product.specs': 'Key Specifications',
    'product.fullSpecs': 'Full Specifications',
    'product.included': 'Package Contents',
    'product.home': 'Home',
    // gallery
    'gallery.photos': 'Photos',
    'gallery.3d': '3D Model',
    'gallery.hint': 'Drag to rotate · Scroll to zoom',
    // about
    'about.title': 'About Us',
    'about.sub': 'Unmanned robotic systems for defence, logistics and industrial operations.',
    'about.p1': 'GlobalRobotex develops and manufactures unmanned ground, aerial and underwater robotic platforms, together with the BLDC drives and ESCs that power them — engineered in-house for the most demanding conditions.',
    'about.p2': 'Our systems are built for the line of contact and grey zones: recovery and logistics UGVs, long-range aerial carriers and underwater platforms. Each platform is modular and configurable for the mission.',
    'about.p3': 'Whether you need recovery, logistics, reconnaissance or a carrier platform, we can help you configure the right system. Contact us for technical support and custom quote requests.',
    // contact
    'contact.title': 'Contact Us',
    'contact.sub': 'Request a quote or get in touch with our team.',
    'contact.getInTouch': 'Get in Touch',
    'contact.email': 'Email',
    'contact.emailNote': 'For quotes and product inquiries',
    'contact.hours': 'Business Hours',
    'contact.hoursValue': 'Monday – Friday: 9:00 – 18:00',
    'contact.quote': 'Request a Quote',
    'contact.quoteNote': 'Include product names and quantities for faster response.',
    'contact.sendEmail': 'Send Email',
    // footer
    'footer.desc': 'Manufacturer of unmanned robotic systems and in-house BLDC drives. Industrial grade · OEM partnerships.',
    'footer.products': 'Products',
    'footer.company': 'Company',
    'footer.contact': 'Contact',
    'footer.terms': 'Terms',
    'footer.privacy': 'Privacy',
    'footer.hours': 'Mon–Fri · 9:00–18:00',
    'footer.rights': 'All rights reserved.',
    'footer.tagline': 'Unmanned Robotic Systems Manufacturer',
  },
  uk: {
    // nav
    'nav.home': 'Головна',
    'nav.catalog': 'Каталог',
    'nav.about': 'Про нас',
    'nav.contact': 'Контакти',
    // common
    'common.requestQuote': 'Запит вартості',
    'common.viewCatalog': 'Переглянути каталог',
    'common.details': 'Детальніше',
    'common.viewDetails': 'Детальніше',
    'common.downloadCatalog': 'Завантажити каталог (PDF)',
    'common.drawings': 'Технічна документація',
    // home hero
    'home.label': 'Безпілотні роботизовані комплекси',
    'home.title': 'Роботизовані комплекси<br>для землі, повітря та <span class="accent">води</span>',
    'home.sub': 'Наземні, літальні та підводні безпілотні платформи з власними BLDC-приводами та ЄСК. B2B-постачання · OEM-партнерство · технічна документація.',
    'home.stat1.v': '11', 'home.stat1.l': 'Платформ у каталозі',
    'home.stat2.v': 'Земля·Повітря·Вода', 'home.stat2.l': 'Середовища застосування',
    'home.stat3.v': 'OEM', 'home.stat3.l': 'Замовлення під ключ',
    'home.products.label': 'Каталог',
    'home.products.title': 'Обрані комплекси',
    'home.viewFullCatalog': 'Весь каталог',
    'home.val1.t': 'Перевірені в полі', 'home.val1.d': 'Платформи для лінії бойового зіткнення та сірих зон',
    'home.val2.t': 'Власний привід', 'home.val2.d': 'Власні BLDC-мотори та ЄСК нового покоління в усій лінійці',
    'home.val3.t': 'Документація', 'home.val3.d': '3D-моделі та повні характеристики для кожної платформи',
    // catalog
    'catalog.title': 'Каталог продукції',
    'catalog.sub': 'Огляд лінійки наземних, літальних та підводних безпілотних систем.',
    'catalog.search': 'Пошук виробів...',
    'catalog.empty': 'Нічого не знайдено. Спробуйте змінити запит або фільтри.',
    'catalog.showing': 'Показано', 'catalog.of': 'з', 'catalog.products': 'виробів',
    'catalog.prev': 'Назад', 'catalog.next': 'Далі', 'catalog.page': 'Сторінка', 'catalog.pageOf': 'з',
    'catalog.browseRange': 'Огляд лінійки —',
    // product
    'product.specs': 'Ключові характеристики',
    'product.fullSpecs': 'Повні характеристики',
    'product.included': 'Комплект поставки',
    'product.home': 'Головна',
    // gallery
    'gallery.photos': 'Фото',
    'gallery.3d': '3D-модель',
    'gallery.hint': 'Перетягніть, щоб обертати · колесо — масштаб',
    // about
    'about.title': 'Про нас',
    'about.sub': 'Безпілотні роботизовані комплекси для оборони, логістики та промисловості.',
    'about.p1': 'GlobalRobotex розробляє та виробляє безпілотні наземні, літальні та підводні роботизовані платформи разом із BLDC-приводами та ЄСК власного виробництва — спроєктованими для найвимогливіших умов.',
    'about.p2': 'Наші системи створені для лінії бойового зіткнення та сірих зон: евакуаційні та логістичні НРК, літальні носії великої дальності та підводні платформи. Кожна платформа модульна та конфігурується під завдання.',
    'about.p3': 'Потрібен евакуатор, логістика, розвідка чи платформа-носій — ми допоможемо підібрати конфігурацію. Звертайтеся за технічною підтримкою та індивідуальними запитами вартості.',
    // contact
    'contact.title': 'Контакти',
    'contact.sub': 'Залиште запит вартості або звʼяжіться з нашою командою.',
    'contact.getInTouch': 'Звʼязатися з нами',
    'contact.email': 'Пошта',
    'contact.emailNote': 'Для запитів вартості та питань щодо виробів',
    'contact.hours': 'Години роботи',
    'contact.hoursValue': 'Понеділок – Пʼятниця: 9:00 – 18:00',
    'contact.quote': 'Запит вартості',
    'contact.quoteNote': 'Вкажіть назви виробів та кількість для швидшої відповіді.',
    'contact.sendEmail': 'Надіслати листа',
    // footer
    'footer.desc': 'Виробник безпілотних роботизованих комплексів та BLDC-приводів власного виробництва. Промисловий клас · OEM-партнерство.',
    'footer.products': 'Продукція',
    'footer.company': 'Компанія',
    'footer.contact': 'Контакти',
    'footer.terms': 'Умови',
    'footer.privacy': 'Конфіденційність',
    'footer.hours': 'Пн–Пт · 9:00–18:00',
    'footer.rights': 'Усі права захищені.',
    'footer.tagline': 'Виробник безпілотних роботизованих комплексів',
  },
} as const;

export type UIKey = keyof typeof ui['en'];

export function useTranslations(lang: Lang) {
  return function t(key: UIKey): string {
    return (ui[lang] as Record<string, string>)[key] ?? (ui[defaultLang] as Record<string, string>)[key] ?? key;
  };
}
