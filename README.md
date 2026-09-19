# For My Love ♡

เว็บเซอร์ไพรส์แฟนแบบ static single-page ใช้ HTML, CSS และ JavaScript ธรรมดา เปิดได้ทันทีและ deploy ได้ง่ายบน GitHub Pages, Vercel หรือ Netlify

## เปิดดูบนเครื่อง

เปิดไฟล์ `dist/index.html` ในเบราว์เซอร์ได้โดยตรง หรือเปิด local server จากโฟลเดอร์โปรเจกต์:

```bash
cd dist
python -m http.server 4173
```

จากนั้นเปิด `http://localhost:4173`

## แก้ข้อความ

ข้อความทั้งหมดอยู่ใน `dist/index.html` แก้ได้ตรง ๆ โดยค้นหาหัวข้อที่ต้องการ เช่น:

- `เรื่องราวของเรา` สำหรับ timeline
- `ขอบคุณนะ` สำหรับ thank-you notes
- `มีบางอย่างอยากบอกเธอ` สำหรับจดหมาย
- `[ใส่ชื่อของคุณ]` สำหรับลายเซ็นท้ายจดหมาย

วันที่ใน timeline เป็นข้อความธรรมดา แก้ทั้งค่าที่มองเห็นและ `datetime="YYYY-MM-DD"` ให้ตรงกัน

## เปลี่ยนรูป

รูป placeholder อยู่ที่ `dist/assets/photos/` และใช้ชื่อ `photo-01.svg` ถึง `photo-06.svg`

วิธีที่ง่ายที่สุดคือเตรียมรูป `.jpg`, `.png` หรือ `.webp` แล้วแก้ `src` และ `data-full` ใน `dist/index.html` เช่น:

```html
<img src="assets/photos/photo-01.jpg" alt="รูปวันแรกที่เราเจอกัน" />
```

เพิ่มรูปในแกลเลอรีได้โดยคัดลอก `button` ที่มี class `gallery-card` ใน `dist/index.html` แล้วเปลี่ยน `src`, `data-full` และข้อความ `alt` ให้ตรงกับรูปใหม่ ระบบจะแบ่งรูปเป็นชุดละ 6 รูปบนเดสก์ท็อปและสร้างจุดบอกจำนวนชุดให้อัตโนมัติ ส่วนมือถือจะเลื่อนรูปแนวนอนตามเดิม

สำหรับรูป hero:

1. วางรูปชื่อ `hero.JPG` ใน `dist/assets/photos/` (ชื่อไฟล์ต้องตรงทั้งตัวพิมพ์เล็ก–ใหญ่)
2. เปิด `dist/styles.css`
3. เปลี่ยนตัวแปร `--hero-photo` เป็น:

```css
--hero-photo: url("assets/photos/hero.JPG");
```

แนะนำให้ใช้รูปแนวนอนขนาดประมาณ 1800 × 1200 px และบีบอัดไฟล์ก่อน deploy

สำหรับรูปข้างจดหมาย ให้ค้นหา `flower-photo` ใน `dist/index.html` แล้วเปลี่ยน `src` ของ `<img>` เป็นชื่อไฟล์ที่ต้องการ เช่น `assets/photos/letter-photo.jpg` แนะนำให้ใช้รูปแนวตั้ง และสามารถปรับจุดโฟกัสด้วย `object-position` ใน class `.flower-photo img` ที่ `dist/styles.css`

## เปลี่ยนวันที่เริ่มคบ

เปิด `dist/index.html` แล้วค้นหา `data-start-date`:

```html
data-start-date="2022-02-20T00:00:00+07:00"
```

เปลี่ยนเป็นวันที่จริงในรูปแบบ `YYYY-MM-DDT00:00:00+07:00` ตัวนับวัน ชั่วโมง นาที และวินาทีจะอัปเดตอัตโนมัติ

## Easter egg

กดหัวใจข้างคำว่า “เซอร์ไพรส์!” 5 ครั้ง จะมีข้อความลับปรากฏ แก้ข้อความได้โดยค้นหา class `secret-message` ใน `dist/index.html`

## เพิ่มคลิปใน Timeline

วางไฟล์วิดีโอไว้ใน `dist/assets/videos/` เช่น `1Y.mp4` แล้วเพิ่มปุ่มต่อจากข้อความของ timeline:

```html
<button class="video-button" type="button"
  data-video="assets/videos/1Y.mp4"
  data-video-title="คลิปวันครบรอบ 1 ปี">
  <span aria-hidden="true">▶</span> ดูคลิปของวันนั้น
</button>
```

แนะนำไฟล์ `.mp4` แบบ H.264 เพื่อให้เปิดได้บนเบราว์เซอร์และโทรศัพท์ส่วนใหญ่ ระบบจะหยุดคลิปให้อัตโนมัติเมื่อปิดหน้าต่าง

## Deploy

### GitHub Pages

โปรเจกต์มี workflow ที่ `.github/workflows/pages.yml` แล้ว โดยเผยแพร่เฉพาะไฟล์ใน `dist/` ทุกครั้งที่ push ไป branch `main`

1. สร้าง repository บน GitHub แล้ว push โปรเจกต์ขึ้น branch `main`
2. ที่ repository ไปที่ **Settings → Pages → Build and deployment** แล้วเลือก **Source: GitHub Actions**
3. รอ workflow ชื่อ **Deploy to GitHub Pages** สำเร็จ จากนั้นเปิด URL ที่ GitHub แสดงในหน้า Pages

โปรดตรวจรูป คลิป และข้อความใน `dist/` ก่อน push เพราะทุกไฟล์ที่เผยแพร่บน GitHub Pages สามารถเปิดดูได้ผ่านเว็บ ไม่ใช่พื้นที่เก็บข้อมูลส่วนตัว

### Vercel

1. Import repository ใน Vercel
2. เลือก Framework Preset เป็น **Other**
3. ไม่ต้องใส่ Build Command
4. ตั้ง Output Directory เป็น `dist`

### Netlify

1. Import repository ใน Netlify
2. ไม่ต้องใส่ Build Command
3. ตั้ง Publish directory เป็น `dist`

ไฟล์ `dist/404.html` จะถูกใช้เป็นหน้า 404 บน GitHub Pages และผู้ให้บริการ static hosting ส่วนใหญ่

## โครงสร้างไฟล์

```text
dist/
├── index.html
├── 404.html
├── styles.css
├── script.js
└── assets/
    └── photos/
        ├── photo-01.svg
        └── ...
```
