# ETS User Support Chat

โครงสร้างโปรเจคนี้ถูกจัดใหม่ให้เหลือเฉพาะ stack ปัจจุบันเท่านั้น และตัด legacy stack เดิมออกจาก repo แล้ว

## Project Structure

```text
apps/
  admin-web/        React + Vite + Tailwind dashboard
  backend/          Node.js + Express + Socket.io + MSSQL
  client-desktop/   Python 3.8.10 + pywebview + system tray
docs/
  project-structure.md
```

## Run

### 1) Backend

```powershell
cd apps\backend
copy .env.example .env
npm install
npm run dev
```

### 2) Admin Web

```powershell
cd apps\admin-web
copy .env.example .env
npm install
npm run dev
```

### 3) Client Desktop

```powershell
cd apps\client-desktop
copy config.sample.ini config.ini
py -3.8-32 -m venv .venv
.venv\Scripts\pip install -r requirements.txt
.venv\Scripts\python app.py
```

## Build Client Desktop

```powershell
cd apps\client-desktop
.\scripts\build-x86.ps1
```

## Notes

- ฝั่ง desktop ยังคง target Windows 7 x86
- identity ของ operator อ่านจาก `config.ini` เท่านั้น
- admin name display อ่านจาก backend endpoint
- backend ใช้ schema `Tickets`, `ChatMessages`, `Locations`
