# DESIGN.md: ETS Local Support Chat 

## 1. Project Overview
ระบบแชทซัพพอร์ตภายในเครือข่ายโรงงาน (Intranet) เพื่อใช้แจ้งปัญหาและสื่อสารแบบ Two-way Real-time ระหว่างพนักงานประจำจุดขนถ่าย (User) และเจ้าหน้าที่สนับสนุน (Admin) โดยแยกระบบออกจาก ErawanTicketing (ETS) เพื่อให้ยังสื่อสารได้แม้ระบบหลักล่ม

## 2. Design System & Theme
*   **Style:** Modern, Clean, Industrial (เน้นความชัดเจน ใช้งานง่าย ไม่ซับซ้อน)
*   **Primary Colors:** สีน้ำเงิน (Trust & Tech) และ สีขาว/เทาอ่อน (Clean background)
*   **Alert Colors:** สีแดง (แจ้งเตือนปัญหา/เคสใหม่) และ สีเขียว (สถานะปกติ/ปิดเคส)
*   **Typography:** ฟอนต์ที่อ่านง่ายบนหน้าจอ (เช่น Inter, Noto Sans Thai, หรือ Sarabun)

---

## 3. UI Specifications & Stitch Prompts

ส่วนนี้คือคำสั่ง (Prompts) สำหรับนำไปใส่ใน Stitch (stitch.withgoogle.com) เพื่อให้ระบบ Generate หน้า UI ออกมาเป็น Code (React/Tailwind) หรือภาพ Prototype

### 3.1 Client Application (ฝั่งพนักงานหน้างาน)
**ลักษณะการทำงาน:** เป็นหน้าต่าง Widget เล็กๆ ปรากฏขึ้นมาที่มุมขวาล่างของจอภาพเมื่อกดจาก System Tray 

**📋 Stitch Prompt สำหรับ Client App:**
> "Create a modern desktop system tray chat widget UI using Tailwind CSS and React. The widget should look like a floating chat window (approx. 350px width, 500px height) with a subtle drop shadow and rounded corners. 
> 
> The UI must have two interchangeable states:
> 
> **State 1 (New Ticket Form):** 
> - A header with the text 'ETS Support'.
> - A dropdown labeled 'Select Shift' (Options: Morning, Night).
> - A dropdown labeled 'Issue Category' (Options: System Crash, Hardware, Other).
> - A large, highly visible primary button (blue) labeled 'Start Support Chat'.
> 
> **State 2 (Active Chat Room):**
> - A header showing status 'Waiting for Admin...' with a green status indicator.
> - A chat history area with a light gray background, containing a few sample chat bubbles (right-aligned for user, left-aligned for admin).
> - A sticky footer at the bottom containing a text input field and a 'Send' button icon."

---

### 3.2 Admin Support Dashboard (ฝั่งเจ้าหน้าที่ Support)
**ลักษณะการทำงาน:** เป็น Web Application แบบ Full-screen ออกแบบหน้าจอให้เห็นข้อมูลครบจบในหน้าเดียว (Split View) สำหรับทำ Multitasking

**📋 Stitch Prompt สำหรับ Admin Dashboard:**
> "Create a full-screen Admin Support Dashboard web application using Tailwind CSS and React. The layout should be a 3-column split view spanning the entire viewport width and height. Use a clean, professional, and slightly dense administrative UI style.
> 
> **Column 1 (Left pane - 25% width - 'Queue List'):** 
> - A sticky header labeled 'Active Tickets'.
> - A vertically scrollable list of ticket cards. 
> - Each card should display a location name (e.g., 'Station A', 'Station B'), time opened, and a red notification dot indicating unread messages. The selected card should have a highlighted background.
> 
> **Column 2 (Middle pane - 50% width - 'Chat Area'):**
> - A header showing the current active location ('Station A') and a red 'Close Ticket' button on the top right.
> - A large central area for chat history displaying message bubbles with timestamps.
> - A footer containing a wide text input field, an attachment paperclip icon, and a 'Send' button.
> 
> **Column 3 (Right pane - 25% width - 'ETS Integration Data'):**
> - A header labeled 'System Status (Read-only)'.
> - Display information styled as data cards or key-value pairs (e.g., 'Last Ticket Processed: #12345', 'Timestamp: 14:05', 'Network Status: Disconnected').
> - Use a light gray background for this column to differentiate it from the interactive chat area."

---

## 4. Components Breakdown (สำหรับทีม Dev)
หากต้องการแยกพัฒนาทีละส่วน (Component) ให้แบ่งดังนี้:
*   `WidgetContainer` - กรอบของหน้าต่างฝั่ง User
*   `TicketForm` - ฟอร์มกรอกข้อมูลเพื่อเปิดเคสใหม่
*   `ChatBubble` - กล่องข้อความซ้าย/ขวา รองรับการแสดงเวลา
*   `QueueListItem` - แถบรายชื่อเคสฝั่ง Admin
*   `StatusCard` - การ์ดแสดงข้อมูลที่ดึงมาจาก ETS
