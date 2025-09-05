export const locales = ['en', 'zh', 'ja'] as const
export type Locale = typeof locales[number]

export const defaultLocale: Locale = 'ja'

export const localeNames: Record<Locale, string> = {
  en: 'English',
  zh: '中文',
  ja: '日本語'
}

export const translations = {
  en: {
    // Navigation
    home: 'Home',
    strengths: 'Our Strengths',
    products: 'Products & Services',
    contact: 'Contact',
    
    // Footer
    companyDescription: 'We provide innovative solutions to take your business to the next level with cutting-edge technology and an experienced team.',
    services: 'Services',
    contactInfo: 'Contact Information',
    address: '160 Robinson Road, #14-04 Singapore Business Federation Center, Singapore 068914',
    phoneInfo: 'Phone: +65 8815 4153',
    email: 'Email: info@jittee.com',
    copyright: '© 2025 Jittee Pte. Ltd. All rights reserved.',
    
    // Home Page
    heroTitle: 'Innovative Solutions',
    heroSubtitle: 'Taking your business to the next level with cutting-edge technology',
    heroDescription: 'Jittee provides innovative solutions using the latest technology to elevate your business. We support your success with cutting-edge technology and an experienced team.',
    
    // Products Page
    productsTitle: 'Products & Services',
    productsSubtitle: 'Providing optimal solutions for your business',
    mainSolution: 'Application Development & Operations',
    mainSolutionDescription: 'We develop and operate custom applications tailored to your business processes. From business efficiency to digital transformation, we provide solutions optimized for your needs.',
    developmentProcess: 'Development Process',
    developmentProcessSteps: {
      step1: 'Business Requirements Gathering & Analysis',
      step2: 'System Design & Prototype Creation',
      step3: 'Custom Application Development',
      step4: 'System Implementation & Operation Support',
      step5: 'Continuous Maintenance & Improvement'
    },
    technologies: 'Supported Technologies',
    technologiesList: {
      web: 'Web Application Development',
      mobile: 'Mobile App Development',
      cloud: 'Cloud Service Integration',
      api: 'External API Integration',
      database: 'Database Design & Construction'
    },
    caseStudies: 'Case Studies',
    customDevelopment: 'Custom Development for Your Needs',
    customDevelopmentDescription: 'We develop optimal solutions for your business beyond the above services. Please feel free to consult with us.',
    contactUs: 'Contact Us',
    
    // Soccer App
    soccerAppTitle: 'LINE-Integrated Soccer App',
    soccerAppDescription: 'A comprehensive management application for soccer teams with LINE integration. We provide an easy-to-use system for both members and administrators.',
    soccerFeatures: {
      line: 'LINE Integration (Member & Admin)',
      schedule: 'Schedule & Attendance Management',
      events: 'Event Management',
      payment: 'Payment Management',
      expense: 'Expense Management',
      video: 'Match Score & Video Management'
    },
    soccerService: 'We provide customized functions tailored to customer needs and continuous operation support. We contribute to team operation automation and real-time information sharing, achieving significant improvements in business efficiency.',
    
    // Interior App
    interiorAppTitle: 'Interior Progress Management App',
    interiorAppDescription: 'An application for efficiently managing interior construction progress. Real-time communication between office and site enables quality improvement and construction period shortening.',
    interiorFeatures: {
      project: 'Project Management',
      drawing: 'Drawing Management',
      site: 'Site Interior Management',
      communication: 'Communication Board'
    },
    interiorService: 'Real-time communication functions between office and site enable immediate sharing of construction progress and issues. We achieve quality improvement and construction period shortening, contributing to customer satisfaction.',
    
    // Contact Page
    contactTitle: 'Contact',
    contactSubtitle: 'Please feel free to contact us',
    contactMethods: 'Contact Methods',
    contactDescription: 'Please contact us through the following methods',
    phoneWhatsapp: 'Phone / WhatsApp',
    phoneWhatsappDescription: 'You can contact us by phone or WhatsApp.',
    emailLabel: 'Email',
    emailAddress: 'info@jittee.com',
    emailDescription: 'Please contact us by email.',
    whatsapp: 'WhatsApp',
    whatsappDescription: 'Please feel free to contact us via WhatsApp',
    phoneLabel: 'Phone',
    phoneNumber: '+65 8815 4153',
    urgentNote: 'For urgent matters, please contact us directly through the above methods. We will respond promptly.',
    // Footer
    emailInfo: 'Email: info@jittee.com',
    
    // Common
    learnMore: 'Learn More',
    viewDetails: 'View Details',
    
    // Home Page Features
    features: 'Features',
    whyChooseUs: 'Why Choose Jittee',
    featuresDescription: 'We introduce our strengths and the value we provide to our customers.',
    innovativeTechnology: 'Innovative Technology',
    innovativeTechnologyDescription: 'We constantly follow the latest technology trends and provide optimal solutions for your business.',
    experiencedTeam: 'Experienced Team',
    experiencedTeamDescription: 'Our expert team with rich experience in diverse industries will lead your project to success.',
    continuousSupport: 'Continuous Support',
    continuousSupportDescription: 'We provide continuous support even after project completion and support your business growth in the long term.',
    qualityAssurance: 'Quality Assurance',
    qualityAssuranceDescription: 'We ensure high-quality solutions through strict quality control processes.',
    startProject: 'Start Your Project',
    readyToStart: 'Ready to start?',
    contactNow: 'Contact Now',
    
    // Products Page
    featuresGallery: 'Features (Click to enlarge)',
    serviceContent: 'Service Content',
    
    // Strengths Page
    ourStrengths: 'Our Strengths',
    strengthsSubtitle: 'Discover what makes Jittee the ideal partner for your business success',
    strength1Title: 'End-to-End Service Delivery',
    strength1Description: 'From requirements definition to maintenance, we handle the entire development lifecycle to deliver truly valuable solutions.',
    strength1Point1: 'Comprehensive requirements analysis and system design',
    strength1Point2: 'Custom development tailored to your business needs',
    strength1Point3: 'Ongoing maintenance and continuous improvement support',
    strength2Title: 'AI-Powered Development Efficiency',
    strength2Description: 'We leverage cutting-edge AI technology to significantly reduce development costs while maintaining high quality.',
    strength2Point1: 'Advanced AI tools for faster development cycles',
    strength2Point2: 'Automated testing and quality assurance processes',
    strength2Point3: 'Cost-effective solutions without compromising quality',
    strength3Title: 'Deep Understanding of Japanese Business Culture',
    strength3Description: 'With extensive experience in Japanese business practices and successful operations in Singapore, we excel at serving Japanese companies.',
    strength3Point1: 'Thorough understanding of Japanese business customs and practices',
    strength3Point2: 'Proven track record of successful operations in Singapore',
    strength3Point3: 'Specialized expertise in serving Japanese companies',
    endToEndService: 'End-to-End Service',
    endToEndServiceDescription: 'Complete project lifecycle management from conception to maintenance',
    aiInnovation: 'AI Innovation',
    aiInnovationDescription: 'Cutting-edge AI technology for efficient and cost-effective development',
    japaneseExpertise: 'Japanese Expertise',
    japaneseExpertiseDescription: 'Deep cultural understanding and proven success in Japanese business environments',
    strengthsCTA: 'Ready to Experience Our Strengths?',
    strengthsCTADescription: 'Let us demonstrate how our comprehensive approach can transform your business'
  },
  
  zh: {
    // Navigation
    home: '首页',
    strengths: '我们的优势',
    products: '产品服务',
    contact: '联系我们',
    
    // Footer
    companyDescription: '我们通过尖端技术和经验丰富的团队，提供创新解决方案，将您的业务提升到新的水平。',
    services: '服务',
    contactInfo: '联系信息',
    address: '160 Robinson Road, #14-04 Singapore Business Federation Center, Singapore 068914',
    phoneInfo: '电话: +65 8815 4153',
    email: '邮箱: info@jittee.com',
    copyright: '© 2025 Jittee Pte. Ltd. 版权所有。',
    
    // Home Page
    heroTitle: '创新解决方案',
    heroSubtitle: '通过尖端技术将您的业务提升到新的水平',
    heroDescription: 'Jittee使用最新技术提供创新解决方案，提升您的业务。我们通过尖端技术和经验丰富的团队支持您的成功。',
    
    // Products Page
    productsTitle: '产品服务',
    productsSubtitle: '为您的业务提供最佳解决方案',
    mainSolution: '应用程序开发与运营',
    mainSolutionDescription: '我们开发和运营适合您业务流程的定制应用程序。从业务效率到数字化转型，我们提供针对您需求优化的解决方案。',
    developmentProcess: '开发流程',
    developmentProcessSteps: {
      step1: '业务需求收集与分析',
      step2: '系统设计与原型创建',
      step3: '定制应用程序开发',
      step4: '系统实施与运营支持',
      step5: '持续维护与改进'
    },
    technologies: '支持技术',
    technologiesList: {
      web: 'Web应用程序开发',
      mobile: '移动应用开发',
      cloud: '云服务集成',
      api: '外部API集成',
      database: '数据库设计与构建'
    },
    caseStudies: '案例研究',
    customDevelopment: '根据您的需求定制开发',
    customDevelopmentDescription: '除了上述服务外，我们还为您的业务开发最佳解决方案。请随时咨询我们。',
    contactUs: '联系我们',
    
    // Soccer App
    soccerAppTitle: 'LINE集成足球应用',
    soccerAppDescription: '与LINE集成的足球团队综合管理应用程序。我们为成员和管理员提供易用的系统。',
    soccerFeatures: {
      line: 'LINE集成（成员用・管理员用）',
      schedule: '日程出勤管理',
      events: '活动管理',
      payment: '支付管理',
      expense: '费用管理',
      video: '比赛分数・视频管理'
    },
    soccerService: '我们提供根据客户需求定制的功能和持续运营支持。我们为团队运营自动化和实时信息共享做出贡献，实现业务效率的显著提升。',
    
    // Interior App
    interiorAppTitle: '内装进度管理应用',
    interiorAppDescription: '用于高效管理内装施工进度的应用程序。办公室与现场之间的实时通信实现质量提升和工期缩短。',
    interiorFeatures: {
      project: '项目管理',
      drawing: '图纸管理',
      site: '现场内装管理',
      communication: '通信板'
    },
    interiorService: '办公室与现场之间的实时通信功能实现施工进度和问题的即时共享。我们实现质量提升和工期缩短，为客户满意度做出贡献。',
    
    // Contact Page
    contactTitle: '联系我们',
    contactSubtitle: '请随时联系我们',
    contactMethods: '联系方式',
    contactDescription: '请通过以下方式联系我们',
    phoneWhatsapp: '电话 / WhatsApp',
    phoneWhatsappDescription: '您可以通过电话或WhatsApp与我们联系。',
    emailLabel: '邮箱',
    emailAddress: 'info@jittee.com',
    emailDescription: '请通过电子邮件与我们联系。',
    whatsapp: 'WhatsApp',
    whatsappDescription: '请通过WhatsApp随时联系我们',
    phoneLabel: '电话',
    phoneNumber: '+65 8815 4153',
    urgentNote: '紧急情况请通过上述方式直接联系我们。我们将及时回复。',
    // Footer
    emailInfo: '邮箱: info@jittee.com',
    
    // Common
    learnMore: '了解更多',
    viewDetails: '查看详情',
    
    // Home Page Features
    features: '特色',
    whyChooseUs: '为什么选择Jittee',
    featuresDescription: '我们介绍我们的优势以及为客户提供的价值。',
    innovativeTechnology: '创新技术',
    innovativeTechnologyDescription: '我们不断跟进最新技术趋势，为您的业务提供最佳解决方案。',
    experiencedTeam: '经验丰富的团队',
    experiencedTeamDescription: '我们在多个行业拥有丰富经验的专家团队将引导您的项目走向成功。',
    continuousSupport: '持续支持',
    continuousSupportDescription: '即使在项目完成后，我们也提供持续支持，长期支持您的业务增长。',
    qualityAssurance: '质量保证',
    qualityAssuranceDescription: '我们通过严格的质量控制流程确保高质量解决方案。',
    startProject: '开始您的项目',
    readyToStart: '准备开始了吗？',
    contactNow: '立即联系',
    
    // Products Page
    featuresGallery: '提供功能（点击放大）',
    serviceContent: '服务内容',
    
    // Strengths Page
    ourStrengths: '我们的优势',
    strengthsSubtitle: '了解为什么Jittee是您业务成功的理想合作伙伴',
    strength1Title: '端到端服务交付',
    strength1Description: '从需求定义到维护，我们处理整个开发生命周期，提供真正有价值的解决方案。',
    strength1Point1: '全面的需求分析和系统设计',
    strength1Point2: '根据您的业务需求定制开发',
    strength1Point3: '持续的维护和改进支持',
    strength2Title: 'AI驱动的开发效率',
    strength2Description: '我们利用尖端AI技术显著降低开发成本，同时保持高质量。',
    strength2Point1: '先进的AI工具，加快开发周期',
    strength2Point2: '自动化测试和质量保证流程',
    strength2Point3: '经济高效的解决方案，不妥协质量',
    strength3Title: '对日本商业文化的深度理解',
    strength3Description: '凭借在日本商业实践中的丰富经验和在新加坡的成功运营，我们擅长为日本公司服务。',
    strength3Point1: '对日本商业习俗和实践的透彻理解',
    strength3Point2: '在新加坡成功运营的可靠记录',
    strength3Point3: '为日本公司服务的专业专长',
    endToEndService: '端到端服务',
    endToEndServiceDescription: '从概念到维护的完整项目生命周期管理',
    aiInnovation: 'AI创新',
    aiInnovationDescription: '尖端AI技术，实现高效且经济实惠的开发',
    japaneseExpertise: '日本专长',
    japaneseExpertiseDescription: '对日本商业环境的深度文化理解和成功经验',
    strengthsCTA: '准备体验我们的优势？',
    strengthsCTADescription: '让我们展示我们的综合方法如何改变您的业务'
  },
  
  ja: {
    // Navigation
    home: 'ホーム',
    strengths: '弊社の強み',
    products: '製品・サービス',
    contact: 'お問い合わせ',
    
    // Footer
    companyDescription: '革新的なソリューションで、お客様のビジネスを次のレベルに引き上げます。最先端の技術と経験豊富なチームで、お客様の成功をサポートします。',
    services: 'サービス',
    contactInfo: 'お問い合わせ',
    address: '160 Robinson Road, #14-04 Singapore Business Federation Center, Singapore 068914',
    phoneInfo: '電話: +65 8815 4153',
    email: 'Email: info@jittee.com',
    copyright: '© 2025 Jittee Pte. Ltd. All rights reserved.',
    
    // Home Page
    heroTitle: '革新的なソリューション',
    heroSubtitle: '最先端の技術で、お客様のビジネスを次のレベルに引き上げます',
    heroDescription: 'Jitteeは最先端の技術で、お客様のビジネスを次のレベルに引き上げます。最先端の技術と経験豊富なチームで、お客様の成功をサポートします。',
    
    // Products Page
    productsTitle: '製品・サービス',
    productsSubtitle: 'お客様のビジネスに最適なソリューションを提供します',
    mainSolution: 'アプリケーション開発・運用',
    mainSolutionDescription: 'お客様の業務に沿ったカスタムアプリケーションの開発と運用を行います。業務効率化からデジタル変革まで、お客様のニーズに最適なソリューションを提供いたします。',
    developmentProcess: '開発プロセス',
    developmentProcessSteps: {
      step1: '業務要件のヒアリング・分析',
      step2: 'システム設計・プロトタイプ作成',
      step3: 'カスタムアプリケーション開発',
      step4: 'システム導入・運用サポート',
      step5: '継続的なメンテナンス・改善'
    },
    technologies: '対応技術',
    technologiesList: {
      web: 'Webアプリケーション開発',
      mobile: 'モバイルアプリ開発',
      cloud: 'クラウドサービス連携',
      api: '外部API連携',
      database: 'データベース設計・構築'
    },
    caseStudies: '開発事例',
    customDevelopment: 'お客様のニーズに合わせた開発',
    customDevelopmentDescription: '上記のサービス以外にも、お客様の業務に最適なソリューションを開発いたします。お気軽にご相談ください。',
    contactUs: 'お問い合わせ',
    
    // Soccer App
    soccerAppTitle: 'LINE連携サッカーアプリ',
    soccerAppDescription: 'サッカーチームの運営に必要な機能を統合した総合管理アプリケーションです。LINEとの連携により、メンバーと管理者の両方にとって使いやすいシステムを提供しています。',
    soccerFeatures: {
      line: 'LINE連携（メンバー用・アドミン用）',
      schedule: 'スケジュール出欠管理',
      events: 'イベント管理',
      payment: '支払い管理',
      expense: '経費管理',
      video: '試合スコア・ビデオ管理'
    },
    soccerService: 'お客様の業務フローに合わせたカスタム機能の開発と、システム導入後の運用・保守サポートを提供。チーム運営の自動化とリアルタイム情報共有により、業務効率の大幅な向上を実現しています。',
    
    // Interior App
    interiorAppTitle: '内装進捗管理アプリ',
    interiorAppDescription: '内装工事の進捗状況を効率的に管理するアプリケーションです。オフィスと現場とのリアルタイムコミュニケーションにより、工事の品質向上と工期短縮を実現しています。',
    interiorFeatures: {
      project: 'プロジェクト管理',
      drawing: '図面管理',
      site: '現場内装管理',
      communication: 'コミュニケーションボード'
    },
    interiorService: 'オフィスと現場とのリアルタイムコミュニケーション機能により、工事の進捗状況や課題を即座に共有。品質向上と工期短縮を実現し、お客様の満足度向上に貢献しています。',
    
    // Contact Page
    contactTitle: 'お問い合わせ',
    contactSubtitle: 'お気軽にお問い合わせください',
    contactMethods: 'お問い合わせ方法',
    contactDescription: '以下の方法でお気軽にお問い合わせください',
    phoneWhatsapp: '電話・WhatsApp',
    phoneWhatsappDescription: 'お電話またはWhatsAppでご連絡いただけます。',
    emailLabel: 'メール',
    emailAddress: 'info@jittee.com',
    emailDescription: 'メールでご連絡ください。',
    whatsapp: 'WhatsApp',
    whatsappDescription: 'WhatsAppでお気軽にお問い合わせください',
    phoneLabel: '電話',
    phoneNumber: '+65 8815 4153',
    urgentNote: 'お急ぎの場合は、上記の方法で直接お問い合わせください。迅速に対応させていただきます。',
    // Footer
    emailInfo: 'Email: info@jittee.com',
    
    // Common
    learnMore: '詳しく見る',
    viewDetails: '詳細を見る',
    
    // Home Page Features
    features: '特徴',
    whyChooseUs: 'なぜJitteeを選ぶのか',
    featuresDescription: '私たちの強みと、お客様に提供する価値をご紹介します。',
    innovativeTechnology: '革新的な技術',
    innovativeTechnologyDescription: '最新の技術トレンドを常に追い続け、お客様のビジネスに最適なソリューションを提供します。',
    experiencedTeam: '経験豊富なチーム',
    experiencedTeamDescription: '多様な業界での豊富な経験を持つエキスパートチームが、お客様のプロジェクトを成功に導きます。',
    continuousSupport: '継続的サポート',
    continuousSupportDescription: 'プロジェクト完了後も継続的にサポートし、お客様のビジネスの成長を長期的に支援します。',
    qualityAssurance: '品質保証',
    qualityAssuranceDescription: '厳格な品質管理プロセスにより、高品質なソリューションを確実にお届けします。',
    startProject: 'プロジェクトを開始する',
    readyToStart: '準備はできていますか？',
    contactNow: '今すぐ相談する',
    
    // Products Page
    featuresGallery: '提供機能（クリックで拡大）',
    serviceContent: 'サービス内容',
    
    // Strengths Page
    ourStrengths: '弊社の強み',
    strengthsSubtitle: 'Jitteeがお客様のビジネス成功の理想的なパートナーである理由をご紹介します',
    strength1Title: '要件定義から保守まで一貫したサービス提供',
    strength1Description: '要件定義から保守まで、開発の全工程を一貫して受け持つことで、本当に価値のあるソリューションを提供できます。',
    strength1Point1: '包括的な要件分析とシステム設計',
    strength1Point2: 'お客様のビジネスニーズに合わせたカスタム開発',
    strength1Point3: '継続的なメンテナンスと改善サポート',
    strength2Title: 'AIを活用した開発効率化',
    strength2Description: '最先端のAI技術を活用することで、開発コストを大幅に削減しながら高品質を維持します。',
    strength2Point1: '開発サイクルを短縮する先進的なAIツール',
    strength2Point2: '自動化されたテストと品質保証プロセス',
    strength2Point3: '品質を損なうことのないコスト効率の良いソリューション',
    strength3Title: '日本の商習慣への深い理解',
    strength3Description: '日本の商習慣への豊富な経験とシンガポールでの成功した運用実績により、日系企業へのサービスが得意です。',
    strength3Point1: '日本の商習慣や慣習への深い理解',
    strength3Point2: 'シンガポールでの成功した運用実績',
    strength3Point3: '日系企業へのサービスに特化した専門知識',
    endToEndService: '一貫したサービス',
    endToEndServiceDescription: '企画から保守まで、プロジェクトの全ライフサイクルを管理',
    aiInnovation: 'AI革新',
    aiInnovationDescription: '効率的でコストパフォーマンスの高い開発のための最先端AI技術',
    japaneseExpertise: '日本企業への専門知識',
    japaneseExpertiseDescription: '日本のビジネス環境への深い文化的理解と実績',
    strengthsCTA: '弊社の強みを体験してみませんか？',
    strengthsCTADescription: '弊社の包括的なアプローチがお客様のビジネスをどのように変革できるかお見せします'
  }
} as const

export type TranslationKey = keyof typeof translations.en
export type Translation = typeof translations[Locale] 