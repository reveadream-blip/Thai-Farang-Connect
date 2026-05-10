-- Données de démo (liste projets publiés). Idempotent avec INSERT OR IGNORE.

INSERT OR IGNORE INTO users (
    id,
    email,
    password_hash,
    role,
    full_name,
    nationality,
    is_verified
) VALUES (
    'system-seed',
    'seed@thaifarang.invalid',
    '$unset$',
    'admin',
    'Platform Seed',
    'Thai',
    0
);

INSERT OR IGNORE INTO projects (
    id,
    owner_id,
    title_en,
    title_th,
    description_en,
    description_th,
    industry,
    location,
    required_investment,
    equity_offered,
    status
) VALUES (
    'proj-demo-fnb',
    'system-seed',
    'Bangkok specialty F&B expansion',
    'ขยายธุรกิจ F&B กรุงเทพฯ',
    'Modern cafe concept targeting Bangkok CBD with Thai-majority governance (51%) and lawyer-reviewed JV templates.',
    'แนวคิดคาเฟ่ในกรุงเทพฯ โครงสร้างหุ้นไทยใหญ่ 51% และสัญญาร่วมทุนที่ผ่านทนาย',
    'F&B',
    'Bangkok',
    3500000,
    51,
    'published'
);

INSERT OR IGNORE INTO projects (
    id,
    owner_id,
    title_en,
    title_th,
    description_en,
    description_th,
    industry,
    location,
    required_investment,
    equity_offered,
    status
) VALUES (
    'proj-demo-proptech',
    'system-seed',
    'Prop-tech rentals compliance dashboard',
    'แดชบอร์ดเทคโนโลยีอสังหาริมทรัพย์',
    'B2B SaaS for long-stay landlords with KYC-ready workflows and Bangkok-focused compliance.',
    'ซอฟต์แวร์ B2B สำหรับการเช่ายาว พร้อมกระบวนการตรวจสอบโปรไฟล์',
    'Tech',
    'Bangkok',
    8000000,
    51,
    'published'
);
