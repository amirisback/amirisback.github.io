# 02_design_angel.md — UI/UX Design & Copywriting Specification

**Task ID**: `TASK-FE-004-i18n-localization-bugfixes`  
**Designer**: Angel (`angel_uiux`)  
**Status**: Approved & Ready for Build  
**Date**: 2026-10-06  

---

## 1. Design Tokens & String Mapping

### A. Namespace `hero`
| Token | ID (Bahasa Indonesia Baku) | EN (Natural English) | Keterangan |
|-------|----------------------------|----------------------|------------|
| `hero.greeting` | `"Saya"` | `"I'm"` | Disandingkan dengan nama |
| `hero.iAmA` | `"Saya seorang"` | `"I am a"` | Awalan running text profesi |
| `hero.viewCv` | `"Lihat CV Amir"` | `"View Amir's CV"` | Tombol primer |
| `hero.followGithub` | `"Ikuti GitHub Amir"` | `"Follow Amir's GitHub"` | Tombol sekunder |

### B. Namespace `about`
| Token | ID (Bahasa Indonesia) | EN (Natural English) |
|-------|-----------------------|----------------------|
| `about.sectionLabel` | `"Pelajari Tentang Saya"` | `"Learn About Me"` |
| `about.sectionTitle` | `"Informasi"` | `"Information"` |
| `about.description` | Narasi profesional bahasa Indonesia (2 paragraf, tanpa em dash) | Narasi profesional bahasa Inggris (2 paragraf, tanpa em dash) |

### C. Namespace `portfolio`
| Token | ID (Bahasa Indonesia Baku) | EN (Natural English) | Catatan KBBI |
|-------|----------------------------|----------------------|--------------|
| `portfolio.sectionLabel` | `"Proyek Saya"` | `"My Projects"` | Koreksi dari "Projek" |
| `portfolio.sectionTitle` | `"Proyek Pilihan"` | `"Featured Projects"` | Koreksi dari "Projek Keren" |
| `portfolio.viewProject` | `"Lihat Proyek"` | `"View Project"` | Koreksi dari "Lihat Projek" |

### D. Namespace `experience`
| Token | ID (Bahasa Indonesia) | EN (Natural English) | Catatan |
|-------|-----------------------|----------------------|---------|
| `experience.sectionLabel` | `"Pengalaman Saya"` | `"My Experience"` | Lebih natural dari "Resume Saya" |
| `experience.sectionTitle` | `"Pengalaman Kerja"` | `"Working Experience"` | Baku |
| `experience.present` | `"Sekarang"` | `"Present"` | Menggantikan "Now" di mode ID |

### E. Namespace `footer`
| Token | ID (Bahasa Indonesia) | EN (Natural English) | Catatan |
|-------|-----------------------|----------------------|---------|
| `footer.connectSocials` | `"Terhubung di Media Sosial"` | `"Connect on Socials"` | Menghilangkan hardcoded EN |
| `footer.madeWith` | `"Dibuat dengan"` | `"Made with"` | Baku |
| `footer.location` | `"di Indonesia"` | `"in Indonesia"` | Menghilangkan "in Indonesia" di mode ID |
| `footer.copyright` | `"© {year} Muhammad Faisal Amir. Semua hak dilindungi."` | `"© {year} Muhammad Faisal Amir. All rights reserved."` | Baku |

---

## 2. Copywriting & Antislop Compliance

1. **Aturan Em Dash (R-02)**: Tidak menggunakan karakter em dash (`—`) dalam teks UI dan metadata. Digantikan oleh koma (`,`) atau tanda kurung `()`.
2. **Kesesuaian KBBI**:
   - Kata *Projek* diganti menjadi *Proyek* di seluruh interface.
   - Kata *Progressive* pada metadata bahasa Indonesia diganti menjadi *Progresif*.
3. **Penyelarasan Kalimat**:
   - Menghindari percampuran bahasa dalam satu frasa seperti `"Dibuat dengan ❤️ in Indonesia"`. Di mode ID wajib menjadi `"Dibuat dengan ❤️ di Indonesia"`.

---

## 3. Component Accessibility (WCAG AA)
- Seluruh teks localized mempertahankan kontras rasio minimal 4.5:1 untuk teks normal dan 3:1 untuk teks besar.
- Label tombol memiliki teks deskriptif yang ramah screen reader (tidak ambigu).
