export interface CvContactInfo {
  location: string;
  email: string;
  phone: string;
  phoneUrl: string;
  linkedIn: string;
  linkedInUrl: string;
  gitHub: string;
  gitHubUrl: string;
  portfolio: string;
  portfolioUrl: string;
  medium: string;
  mediumUrl: string;
}

export interface CvSkillCategory {
  category: string;
  skills: string;
}

export interface CvExperienceItem {
  company: string;
  location: string;
  role: string;
  period: string;
  bullets: string[];
}

export interface CvProjectItem {
  title: string;
  role?: string;
  description: string;
  link?: string;
}

export interface CvEducationItem {
  institution: string;
  location: string;
  degree: string;
  period: string;
  highlights: string[];
}

export interface CvLanguageItem {
  name: string;
  proficiency: string;
}

export interface CvContentLocale {
  fullName: string;
  roleTitle: string;
  contact: CvContactInfo;
  summary: string;
  skills: CvSkillCategory[];
  experience: CvExperienceItem[];
  openSource: CvProjectItem[];
  publications: CvProjectItem[];
  education: CvEducationItem[];
  languages: CvLanguageItem[];
  staticPdfUrl: string;
}

export const cvData: Record<"en" | "id", CvContentLocale> = {
  en: {
    fullName: "Muhammad Faisal Amir",
    roleTitle: "Senior Android Developer & Software Engineer",
    contact: {
      location: "Jakarta / Probolinggo, East Java, Indonesia",
      email: "faisalamircs@gmail.com",
      phone: "+62 813-5710-8568",
      phoneUrl: "https://wa.me/6281357108568",
      linkedIn: "linkedin.com/in/faisalamircs",
      linkedInUrl: "https://www.linkedin.com/in/faisalamircs/",
      gitHub: "github.com/amirisback",
      gitHubUrl: "https://github.com/amirisback",
      portfolio: "amirisback.github.io",
      portfolioUrl: "https://amirisback.github.io",
      medium: "medium.com/@faisalamircs",
      mediumUrl: "https://medium.com/@faisalamircs",
    },
    summary:
      "Accomplished and growth-oriented Software Engineer with over 6 years of hands-on experience specializing in Native Android Development (Kotlin, Java, Jetpack Compose) and modern Frontend Web Development (Next.js, TypeScript, Tailwind CSS). Demonstrated success in architecting scalable mobile applications, engineering reusable developer SDKs/libraries, and establishing automated CI/CD build pipelines. Founder and lead maintainer of the open-source Frogobox ecosystem (e.g., Frogo-Recycler-View, Frogo SDK). Proven background delivering mission-critical applications across fintech, e-commerce, journalism, healthcare, and enterprise messaging. Strong advocate of clean architecture (MVVM/MVI), reactive programming, and AI-accelerated modern development workflows.",
    skills: [
      {
        category: "Mobile Development",
        skills:
          "Kotlin, Java, Jetpack Compose, Android SDK, Android Jetpack (ViewModel, LiveData, StateFlow, Room, Navigation, WorkManager, Paging 3), XML Layouts, Material Design 3, Coroutines & Flow, Dependency Injection (Dagger Hilt, Koin), Retrofit2, OkHttp3, CameraX, Play Store Publishing & Policy Compliance.",
      },
      {
        category: "Web & Frontend",
        skills:
          "Next.js (App Router & Pages Router), React.js, TypeScript, JavaScript (ES6+), HTML5, CSS3, Tailwind CSS, Responsive Web Design, Progressive Web Apps (PWA / Serwist).",
      },
      {
        category: "Architecture & Patterns",
        skills:
          "Clean Architecture, MVVM, MVI, Repository Pattern, Modularization, SOLID Principles, Reactive Programming.",
      },
      {
        category: "Testing & Quality",
        skills:
          "Test-Driven Development (TDD), Unit Testing (JUnit, Mockito), Systematic Debugging, Android Profiler (Memory, CPU, Network), Lint Analysis.",
      },
      {
        category: "DevOps & Tooling",
        skills:
          "Git, GitHub Actions (Automated Android CI/CD), Gradle (Kotlin DSL & Groovy), Android Studio, Visual Studio Code, Postman, Vercel, Firebase (FCM, Crashlytics, Analytics).",
      },
      {
        category: "Methodologies",
        skills:
          "Agile / Scrum, Cross-Functional Collaboration, Technical Documentation, Open-Source Maintenance, AI Vibes Coding & Prompt Engineering.",
      },
    ],
    experience: [
      {
        company: "Qomunal (PT Qomunal / PT Aset Solusi Digital)",
        location: "Jakarta Selatan, Indonesia",
        role: "Software Engineer (Android & Frontend Next.js)",
        period: "September 2023 – Present",
        bullets: [
          "Architect and engineer high-performance Android applications and modern Next.js web solutions across multiple business verticals.",
          "Spearheaded end-to-end development of production applications: Qomunal Android App, Tokowibu (Android & Web), SJI (School of Journalism Indonesia), Hening (Mindfulness/Audio App), and NewLife (Maternal Care Companion).",
          "Migrated legacy UI components to Jetpack Compose and Kotlin Coroutines/Flow, reducing UI boilerplate by over 40% and improving frame rendering rates.",
          "Collaborated closely with product designers, product managers, and backend engineers to integrate RESTful endpoints, token authentication, and robust offline caching mechanisms.",
        ],
      },
      {
        company: "KoinWorks (PT Lunaria Annua Teknologi)",
        location: "Jakarta Selatan, Indonesia",
        role: "Android Engineer",
        period: "June 2022 – March 2023",
        bullets: [
          "Engineered core financial features and peer-to-peer (P2P) lending modules for the KoinWorks Super App serving millions of active retail and business users.",
          "Collaborated in cross-functional agile squads with Product, Backend, QA, and Security teams to implement KYC, digital onboarding, and automated payment flows.",
          "Refactored legacy Java modules into modern Kotlin following Clean Architecture and MVVM patterns, resulting in improved crash-free user sessions (>99.5%).",
          "Optimized networking layers and Room database queries, cutting screen initialization and list rendering latency.",
          "Participated in code reviews and assisted in maintaining unit test suites using JUnit and Mockito.",
        ],
      },
      {
        company: "PT Rumahawan Karya Indonesia",
        location: "Jakarta Selatan, Indonesia",
        role: "Android Engineer",
        period: "June 2022 – June 2022",
        bullets: [
          "Contributed to mobile architecture design and foundational Android client features for residential property management services.",
        ],
      },
      {
        company: "ChatAja Messenger",
        location: "Bandung, West Java, Indonesia",
        role: "Android Programmer (Internship)",
        period: "July 2020 – December 2020",
        bullets: [
          "Participated in developing native Android features for an enterprise-grade instant messaging platform.",
          "Implemented real-time chat UI components, background push notifications (FCM), and message synchronization with SQLite/Room.",
          "Resolved race conditions and threading bottlenecks in real-time socket communication.",
        ],
      },
      {
        company: "GITS Indonesia",
        location: "Bandung, West Java, Indonesia",
        role: "Android Programmer",
        period: "June 2019 – September 2019",
        bullets: [
          "Developed custom Android client applications for enterprise clients adhering to standard MVVM patterns.",
          "Integrated RESTful web services, third-party authentication SDKs, and payment gateways.",
        ],
      },
      {
        company: "Kodelokus",
        location: "Bandung, West Java, Indonesia",
        role: "Android Programmer (Internship)",
        period: "January 2019 – May 2019",
        bullets: [
          "Built client application modules, crafted responsive XML layouts, and resolved UI/UX defects across varied screen densities.",
          "Collaborated with lead developers in version-controlled workflows using Git and agile sprint routines.",
        ],
      },
    ],
    openSource: [
      {
        title: "Frogo-Recycler-View",
        role: "Founder & Lead Maintainer",
        description:
          "High-performance Android library eliminating boilerplate adapter code for RecyclerView and bridging smoothly to Jetpack Compose. Widely adopted by Indonesian and international Android developer communities.",
        link: "https://github.com/amirisback/frogo-recycler-view",
      },
      {
        title: "Frogo SDK (frogo-sdk, frogo-core, frogo-admob)",
        role: "Founder & Lead Maintainer",
        description:
          "Modular Android SDK collection providing consumable code utilities, networking wrappers, and rapid Google Mobile Ads mediation setup.",
        link: "https://github.com/frogobox",
      },
      {
        title: "automated-build-android-app-with-github-action",
        role: "Author",
        description:
          "Open-source CI/CD template automating Android build artifacts, keystore signing, and GitHub release uploads.",
        link: "https://github.com/amirisback/automated-build-android-app-with-github-action",
      },
      {
        title: "Keyboard Like Google",
        role: "Author",
        description:
          "Custom virtual keyboard implementation exploring Android InputMethodService architecture.",
        link: "https://github.com/amirisback/keyboard-like-google",
      },
    ],
    publications: [
      {
        title: "Consumable Code by Amirisback: Apa itu?",
        role: "Medium Publication",
        description:
          "Widely read developer series illustrating modular library design, clean architecture abstractions, and code reusability across software ecosystems.",
        link: "https://medium.com/@faisalamircs",
      },
    ],
    education: [
      {
        institution: "Telkom University",
        location: "Bandung, Indonesia",
        degree: "Bachelor of Computer Science (S.Kom.) — S1 Informatics, School of Computing",
        period: "2019 – 2022",
        highlights: [
          "Official Degree: Sarjana Komputer (S.Kom.) conferred under Rector Decree No. KR.149/AKD15/AKD-BAA/2022 (Graduation: March 2, 2022, Diploma No: 552012022001490).",
          "Research & Final Project: 'Framework Developer for Creating Nutrition-Related Applications based on Android Platform'.",
          "Intellectual Property: Awarded copyright certification from Kemdiktisaintek for the MicroNutrient Application Generator.",
        ],
      },
      {
        institution: "Telkom University",
        location: "Bandung, Indonesia",
        degree: "Associate Degree in Software Engineering (D3 Rekayasa Perangkat Lunak Aplikasi)",
        period: "2016 – 2019",
        highlights: [
          "Key Project: Finpro (Final Project Guidance & Examination Management System) Android application.",
        ],
      },
      {
        institution: "SMAN 1 Probolinggo",
        location: "Probolinggo, East Java, Indonesia",
        degree: "Natural Sciences (IPA)",
        period: "2013 – 2016",
        highlights: [],
      },
    ],
    languages: [
      { name: "Indonesian", proficiency: "Native proficiency" },
      { name: "English", proficiency: "Professional working proficiency" },
    ],
    staticPdfUrl: "/docs/cv/cv-muhammad-faisal-amir-en.pdf",
  },
  id: {
    fullName: "Muhammad Faisal Amir",
    roleTitle: "Senior Android Developer & Software Engineer",
    contact: {
      location: "Jakarta / Probolinggo, Jawa Timur, Indonesia",
      email: "faisalamircs@gmail.com",
      phone: "+62 813-5710-8568",
      phoneUrl: "https://wa.me/6281357108568",
      linkedIn: "linkedin.com/in/faisalamircs",
      linkedInUrl: "https://www.linkedin.com/in/faisalamircs/",
      gitHub: "github.com/amirisback",
      gitHubUrl: "https://github.com/amirisback",
      portfolio: "amirisback.github.io",
      portfolioUrl: "https://amirisback.github.io",
      medium: "medium.com/@faisalamircs",
      mediumUrl: "https://medium.com/@faisalamircs",
    },
    summary:
      "Software Engineer yang berdedikasi dan berorientasi pada pencapaian dengan pengalaman lebih dari 6 tahun yang berfokus pada Pengembangan Aplikasi Android Native (Kotlin, Java, Jetpack Compose) dan Frontend Web Modern (Next.js, TypeScript, Tailwind CSS). Terbukti sukses merancang arsitektur aplikasi mobile yang scalable dan berperforma tinggi, membangun library serta SDK modular yang dapat digunakan kembali, dan menyusun pipeline CI/CD otomatis. Merupakan founder dan maintainer ekosistem open-source Frogobox (antara lain Frogo-Recycler-View, Frogo SDK). Berpengalaman luas dalam meluncurkan aplikasi-aplikasi skala produksi di bidang fintech, e-commerce, media/jurnalisme, kesehatan, dan perpesanan enterprise. Memiliki komitmen mendalam terhadap penerapan Clean Architecture (MVVM/MVI), pengujian otomatis, serta alur kerja modern berbasis AI.",
    skills: [
      {
        category: "Mobile Development",
        skills:
          "Kotlin, Java, Jetpack Compose, Android SDK, Android Jetpack (ViewModel, LiveData, StateFlow, Room, Navigation, WorkManager, Paging 3), XML Layouts, Material Design 3, Coroutines & Flow, Dependency Injection (Dagger Hilt, Koin), Retrofit2, OkHttp3, CameraX, Pengelolaan & Kebijakan Google Play Store.",
      },
      {
        category: "Web & Frontend",
        skills:
          "Next.js (App Router & Pages Router), React.js, TypeScript, JavaScript (ES6+), HTML5, CSS3, Tailwind CSS, Desain Web Responsif, Progressive Web Apps (PWA / Serwist).",
      },
      {
        category: "Arsitektur & Pola Desain",
        skills:
          "Clean Architecture, MVVM, MVI, Repository Pattern, Modularization, Prinsip SOLID, Reactive Programming.",
      },
      {
        category: "Pengujian & Kualitas Perangkat Lunak",
        skills:
          "Test-Driven Development (TDD), Unit Testing (JUnit, Mockito), Debugging Sistematis, Android Profiler (Memory, CPU, Network), Analisis Lint.",
      },
      {
        category: "DevOps & Peralatan",
        skills:
          "Git, GitHub Actions (Automasi CI/CD Android), Gradle (Kotlin DSL & Groovy), Android Studio, Visual Studio Code, Postman, Vercel, Firebase (FCM, Crashlytics, Analytics).",
      },
      {
        category: "Metodologi",
        skills:
          "Agile / Scrum, Kolaborasi Lintas Fungsi, Dokumentasi Teknis, Pemeliharaan Proyek Open-Source, AI Vibes Coding & Prompt Engineering.",
      },
    ],
    experience: [
      {
        company: "Qomunal (PT Qomunal / PT Aset Solusi Digital)",
        location: "Jakarta Selatan, Indonesia",
        role: "Software Engineer (Android & Frontend Next.js)",
        period: "September 2023 – Sekarang",
        bullets: [
          "Bertanggung jawab merancang arsitektur dan mengembangkan aplikasi Android berperforma tinggi serta antarmuka web modern Next.js di berbagai lini produk.",
          "Memimpin pengembangan end-to-end aplikasi skala produksi: Qomunal Android App, Tokowibu (Android & Web), SJI (School of Journalism Indonesia), Hening (Aplikasi Mindfulness/Audio), dan NewLife (Pendamping Kesehatan Ibu Hamil).",
          "Melakukan modernisasi kode ke Jetpack Compose dan Kotlin Coroutines/Flow, mengurangi boilerplate UI hingga 40% dan mengoptimalkan frame rate rendering aplikasi.",
          "Berkolaborasi erat dengan tim UI/UX, Product Manager, dan Backend Engineer dalam mengintegrasikan endpoint REST API, autentikasi aman, serta sistem caching luring (offline caching).",
        ],
      },
      {
        company: "KoinWorks (PT Lunaria Annua Teknologi)",
        location: "Jakarta Selatan, Indonesia",
        role: "Android Engineer",
        period: "Juni 2022 – Maret 2023",
        bullets: [
          "Mengembangkan fitur-fitur finansial inti dan modul pinjaman peer-to-peer (P2P) pada KoinWorks Super App yang melayani jutaan pengguna aktif.",
          "Berkolaborasi dalam squad agile lintas fungsi (Product, Backend, QA, dan Security) dalam membangun alur KYC, registrasi digital, dan pembayaran otomatis.",
          "Memimpin refactoring modul legacy Java ke Kotlin dengan standar Clean Architecture dan MVVM, meningkatkan stabilitas crash-free user sessions (>99.5%).",
          "Mengoptimalkan lapisan jaringan dan query basis data Room SQLite, memangkas latensi inisialisasi layar dan pemuatan daftar transaksi.",
          "Berpartisipasi aktif dalam code review serta pemeliharaan automated unit test menggunakan JUnit dan Mockito.",
        ],
      },
      {
        company: "PT Rumahawan Karya Indonesia",
        location: "Jakarta Selatan, Indonesia",
        role: "Android Engineer",
        period: "Juni 2022 – Juni 2022",
        bullets: [
          "Berkontribusi dalam perancangan fondasi arsitektur mobile dan pengembangan modul klien Android untuk layanan properti perumahan.",
        ],
      },
      {
        company: "ChatAja Messenger",
        location: "Bandung, Jawa Barat, Indonesia",
        role: "Android Programmer (Internship)",
        period: "Juli 2020 – Desember 2020",
        bullets: [
          "Berperan dalam pengembangan aplikasi pesan instan enterprise berbasis Android native.",
          "Mengembangkan komponen antarmuka percakapan interaktif, notifikasi push latar belakang (FCM), serta sinkronisasi pesan dengan SQLite/Room.",
          "Mengatasi kendala multithreading dan race condition pada komunikasi soket pesan waktu-nyata (real-time).",
        ],
      },
      {
        company: "GITS Indonesia",
        location: "Bandung, Jawa Barat, Indonesia",
        role: "Android Programmer",
        period: "Juni 2019 – September 2019",
        bullets: [
          "Membangun aplikasi Android kustom untuk klien enterprise berbasis arsitektur standar MVVM.",
          "Mengintegrasikan RESTful API, SDK autentikasi pihak ketiga, dan antarmuka interaktif.",
        ],
      },
      {
        company: "Kodelokus",
        location: "Bandung, Jawa Barat, Indonesia",
        role: "Android Programmer (Internship)",
        period: "Januari 2019 – Mei 2019",
        bullets: [
          "Mengembangkan modul aplikasi klien, mendesain tata letak XML responsif, dan memperbaiki bug UI/UX di berbagai ukuran layar perangkat Android.",
          "Bekerja secara terstruktur menggunakan alur kerja kontrol versi Git dan sprint agile mingguan.",
        ],
      },
    ],
    openSource: [
      {
        title: "Frogo-Recycler-View",
        role: "Founder & Lead Maintainer",
        description:
          "Library Android populer yang mengeliminasi penulisan adapter boilerplate pada RecyclerView serta mendukung integrasi Jetpack Compose. Digunakan luas oleh komunitas developer Android.",
        link: "https://github.com/amirisback/frogo-recycler-view",
      },
      {
        title: "Frogo SDK (frogo-sdk, frogo-core, frogo-admob)",
        role: "Founder & Lead Maintainer",
        description:
          "Rangkaian SDK modular yang menyediakan utilitas consumable code, pembungkus jaringan REST, dan integrasi monetisasi iklan.",
        link: "https://github.com/frogobox",
      },
      {
        title: "automated-build-android-app-with-github-action",
        role: "Author",
        description:
          "Template CI/CD otomatis untuk pengujian lint, build APK/AAB, dan rilis GitHub Actions secara instan.",
        link: "https://github.com/amirisback/automated-build-android-app-with-github-action",
      },
      {
        title: "Keyboard Like Google",
        role: "Author",
        description:
          "Implementasi papan ketik virtual Android kustom menggunakan arsitektur InputMethodService.",
        link: "https://github.com/amirisback/keyboard-like-google",
      },
    ],
    publications: [
      {
        title: "Consumable Code by Amirisback: Apa itu?",
        role: "Publikasi Medium",
        description:
          "Seri artikel teknis populer yang mengulas perancangan modular library, abstraksi kode bersih, dan pemakaian ulang komponen.",
        link: "https://medium.com/@faisalamircs",
      },
    ],
    education: [
      {
        institution: "Universitas Telkom (Telkom University)",
        location: "Bandung, Indonesia",
        degree: "Sarjana Komputer (S.Kom.) — S1 Informatika, Fakultas Informatika",
        period: "2019 – 2022",
        highlights: [
          "Gelar Resmi: Sarjana Komputer (S.Kom.) berdasarkan SK Rektor No. KR.149/AKD15/AKD-BAA/2022 (Yudisium: 2 Maret 2022, No. Ijazah Nasional: 552012022001490).",
          "Penelitian / Tugas Akhir: 'Pengembang Framework untuk Membuat Aplikasi Seputar Permasalahan Gizi berbasis Platform Android'.",
          "Hak Cipta / HKI: Memperoleh Sertifikat Hak Cipta resmi dari Kemdiktisaintek untuk 'Generator Aplikasi MicroNutrient'.",
        ],
      },
      {
        institution: "Universitas Telkom (Telkom University)",
        location: "Bandung, Indonesia",
        degree: "Ahli Madya Rekayasa Perangkat Lunak Aplikasi (D3 RPL Aplikasi)",
        period: "2016 – 2019",
        highlights: [
          "Proyek Kunci: Aplikasi Android Finpro (Sistem Manajemen Bimbingan & Sidang Tugas Akhir).",
        ],
      },
      {
        institution: "SMAN 1 Probolinggo",
        location: "Probolinggo, Jawa Timur, Indonesia",
        degree: "Ilmu Pengetahuan Alam (IPA)",
        period: "2013 – 2016",
        highlights: [],
      },
    ],
    languages: [
      { name: "Bahasa Indonesia", proficiency: "Penutur Asli (Native)" },
      { name: "Bahasa Inggris", proficiency: "Kemahiran Profesional (Professional Working)" },
    ],
    staticPdfUrl: "/docs/cv/cv-muhammad-faisal-amir-id.pdf",
  },
};
