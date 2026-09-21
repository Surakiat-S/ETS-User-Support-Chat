// ============================================================================
// File: Form1.Designer.cs
// Target: .NET 6.0+ (Windows 10 / 11 Optimized)
// Project: ETS Local Support Chat - ClientApp (Zero-Login Factory Workstation)
// ============================================================================

namespace ETSClientApp
{
    partial class Form1
    {
        private System.ComponentModel.IContainer components = null;

        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        private void InitializeComponent()
        {
            this.components = new System.ComponentModel.Container();
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(Form1));
            
            // Core Panels & Controls
            this.pnlHeader = new System.Windows.Forms.Panel();
            this.lblStatusDot = new System.Windows.Forms.Label();
            this.lblStatusText = new System.Windows.Forms.Label();
            this.lblLocationTitle = new System.Windows.Forms.Label();
            this.lblAppName = new System.Windows.Forms.Label();
            this.btnMinimize = new System.Windows.Forms.Button();
            this.btnCloseWindow = new System.Windows.Forms.Button();

            // Panel 1: Idle / New Ticket Form
            this.pnlIdleState = new System.Windows.Forms.Panel();
            this.lblSelectPrompt = new System.Windows.Forms.Label();
            this.btnIssueSystemCrash = new System.Windows.Forms.Button();
            this.btnIssuePrinter = new System.Windows.Forms.Button();
            this.btnIssueScanner = new System.Windows.Forms.Button();
            this.btnIssueOther = new System.Windows.Forms.Button();
            this.lblSelectedIssueDisplay = new System.Windows.Forms.Label();
            this.btnStartChat = new System.Windows.Forms.Button();
            this.lblZeroLoginNotice = new System.Windows.Forms.Label();

            // Panel 2: Active Chat Room
            this.pnlChatState = new System.Windows.Forms.Panel();
            this.pnlChatSubHeader = new System.Windows.Forms.Panel();
            this.lblTicketBadge = new System.Windows.Forms.Label();
            this.btnEndChat = new System.Windows.Forms.Button();
            this.rtbChatHistory = new System.Windows.Forms.RichTextBox();
            this.pnlInputArea = new System.Windows.Forms.Panel();
            this.txtMessageInput = new System.Windows.Forms.TextBox();
            this.btnSend = new System.Windows.Forms.Button();

            // System Tray
            this.notifyIcon1 = new System.Windows.Forms.NotifyIcon(this.components);
            this.trayContextMenu = new System.Windows.Forms.ContextMenuStrip(this.components);
            this.menuOpen = new System.Windows.Forms.ToolStripMenuItem();
            this.menuExit = new System.Windows.Forms.ToolStripMenuItem();

            this.pnlHeader.SuspendLayout();
            this.pnlIdleState.SuspendLayout();
            this.pnlChatState.SuspendLayout();
            this.pnlChatSubHeader.SuspendLayout();
            this.pnlInputArea.SuspendLayout();
            this.trayContextMenu.SuspendLayout();
            this.SuspendLayout();

            // -------------------------------------------------------------
            // pnlHeader (Top Bar - 48px)
            // -------------------------------------------------------------
            this.pnlHeader.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(29)))), ((int)(((byte)(78)))), ((int)(((byte)(216))))); // #1d4ed8
            this.pnlHeader.Controls.Add(this.lblAppName);
            this.pnlHeader.Controls.Add(this.lblLocationTitle);
            this.pnlHeader.Controls.Add(this.lblStatusDot);
            this.pnlHeader.Controls.Add(this.lblStatusText);
            this.pnlHeader.Controls.Add(this.btnMinimize);
            this.pnlHeader.Controls.Add(this.btnCloseWindow);
            this.pnlHeader.Dock = System.Windows.Forms.DockStyle.Top;
            this.pnlHeader.Location = new System.Drawing.Point(0, 0);
            this.pnlHeader.Name = "pnlHeader";
            this.pnlHeader.Size = new System.Drawing.Size(420, 60);
            this.pnlHeader.TabIndex = 0;
            this.pnlHeader.MouseDown += new System.Windows.Forms.MouseEventHandler(this.PnlHeader_MouseDown);

            // lblAppName (Row 1 Left)
            this.lblAppName.AutoSize = true;
            this.lblAppName.Font = new System.Drawing.Font("Segoe UI", 11F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.lblAppName.ForeColor = System.Drawing.Color.White;
            this.lblAppName.Location = new System.Drawing.Point(12, 8);
            this.lblAppName.Name = "lblAppName";
            this.lblAppName.Size = new System.Drawing.Size(135, 20);
            this.lblAppName.TabIndex = 0;
            this.lblAppName.Text = "ETS Local Support";

            // lblLocationTitle (Row 2 Left)
            this.lblLocationTitle.AutoSize = true;
            this.lblLocationTitle.Font = new System.Drawing.Font("Segoe UI", 8.5F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.lblLocationTitle.ForeColor = System.Drawing.Color.FromArgb(((int)(((byte)(191)))), ((int)(((byte)(219)))), ((int)(((byte)(254)))));
            this.lblLocationTitle.Location = new System.Drawing.Point(13, 32);
            this.lblLocationTitle.Name = "lblLocationTitle";
            this.lblLocationTitle.Size = new System.Drawing.Size(130, 15);
            this.lblLocationTitle.TabIndex = 1;
            this.lblLocationTitle.Text = "Station: Bay 04 - WB-04";

            // lblStatusDot (Row 1 Right)
            this.lblStatusDot.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(34)))), ((int)(((byte)(197)))), ((int)(((byte)(94)))));
            this.lblStatusDot.Location = new System.Drawing.Point(265, 15);
            this.lblStatusDot.Name = "lblStatusDot";
            this.lblStatusDot.Size = new System.Drawing.Size(8, 8);
            this.lblStatusDot.TabIndex = 2;

            // lblStatusText (Row 1 Right)
            this.lblStatusText.AutoSize = true;
            this.lblStatusText.Font = new System.Drawing.Font("Segoe UI", 8.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.lblStatusText.ForeColor = System.Drawing.Color.White;
            this.lblStatusText.Location = new System.Drawing.Point(276, 12);
            this.lblStatusText.Name = "lblStatusText";
            this.lblStatusText.Size = new System.Drawing.Size(42, 13);
            this.lblStatusText.TabIndex = 3;
            this.lblStatusText.Text = "Online";

            // btnMinimize (Row 1 Right)
            this.btnMinimize.BackColor = System.Drawing.Color.Transparent;
            this.btnMinimize.FlatAppearance.BorderSize = 0;
            this.btnMinimize.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.btnMinimize.Font = new System.Drawing.Font("Segoe UI", 9F, System.Drawing.FontStyle.Bold);
            this.btnMinimize.ForeColor = System.Drawing.Color.White;
            this.btnMinimize.Location = new System.Drawing.Point(350, 6);
            this.btnMinimize.Name = "btnMinimize";
            this.btnMinimize.Size = new System.Drawing.Size(26, 26);
            this.btnMinimize.TabIndex = 4;
            this.btnMinimize.Text = "—";
            this.btnMinimize.UseVisualStyleBackColor = false;
            this.btnMinimize.Click += new System.EventHandler(this.BtnMinimize_Click);

            // btnCloseWindow (Row 1 Right)
            this.btnCloseWindow.BackColor = System.Drawing.Color.Transparent;
            this.btnCloseWindow.FlatAppearance.BorderSize = 0;
            this.btnCloseWindow.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.btnCloseWindow.Font = new System.Drawing.Font("Segoe UI", 9F, System.Drawing.FontStyle.Bold);
            this.btnCloseWindow.ForeColor = System.Drawing.Color.White;
            this.btnCloseWindow.Location = new System.Drawing.Point(380, 6);
            this.btnCloseWindow.Name = "btnCloseWindow";
            this.btnCloseWindow.Size = new System.Drawing.Size(26, 26);
            this.btnCloseWindow.TabIndex = 5;
            this.btnCloseWindow.Text = "✕";
            this.btnCloseWindow.UseVisualStyleBackColor = false;
            this.btnCloseWindow.Click += new System.EventHandler(this.BtnCloseWindow_Click);

            // -------------------------------------------------------------
            // pnlIdleState (Panel 1: Open New Ticket - Zero Login)
            // -------------------------------------------------------------
            this.pnlIdleState.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(248)))), ((int)(((byte)(249)))), ((int)(((byte)(255))))); // #f8f9ff
            this.pnlIdleState.Controls.Add(this.lblSelectPrompt);
            this.pnlIdleState.Controls.Add(this.btnIssueSystemCrash);
            this.pnlIdleState.Controls.Add(this.btnIssuePrinter);
            this.pnlIdleState.Controls.Add(this.btnIssueScanner);
            this.pnlIdleState.Controls.Add(this.btnIssueOther);
            this.pnlIdleState.Controls.Add(this.lblSelectedIssueDisplay);
            this.pnlIdleState.Controls.Add(this.btnStartChat);
            this.pnlIdleState.Controls.Add(this.lblZeroLoginNotice);
            this.pnlIdleState.Dock = System.Windows.Forms.DockStyle.Fill;
            this.pnlIdleState.Location = new System.Drawing.Point(0, 60);
            this.pnlIdleState.Name = "pnlIdleState";
            this.pnlIdleState.Padding = new System.Windows.Forms.Padding(18);
            this.pnlIdleState.Size = new System.Drawing.Size(420, 490);
            this.pnlIdleState.TabIndex = 1;

            // lblSelectPrompt
            this.lblSelectPrompt.AutoSize = true;
            this.lblSelectPrompt.Font = new System.Drawing.Font("Segoe UI", 11.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.lblSelectPrompt.ForeColor = System.Drawing.Color.FromArgb(((int)(((byte)(30)))), ((int)(((byte)(41)))), ((int)(((byte)(59)))));
            this.lblSelectPrompt.Location = new System.Drawing.Point(20, 15);
            this.lblSelectPrompt.Name = "lblSelectPrompt";
            this.lblSelectPrompt.Size = new System.Drawing.Size(262, 20);
            this.lblSelectPrompt.TabIndex = 0;
            this.lblSelectPrompt.Text = "เลือกปัญหาที่พบ (Select an Issue):";

            // btnIssuePrinter
            this.btnIssuePrinter.BackColor = System.Drawing.Color.White;
            this.btnIssuePrinter.Cursor = System.Windows.Forms.Cursors.Hand;
            this.btnIssuePrinter.FlatAppearance.BorderColor = System.Drawing.Color.FromArgb(((int)(((byte)(203)))), ((int)(((byte)(213)))), ((int)(((byte)(225)))));
            this.btnIssuePrinter.FlatAppearance.BorderSize = 2;
            this.btnIssuePrinter.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.btnIssuePrinter.Font = new System.Drawing.Font("Segoe UI Semibold", 10.5F, System.Drawing.FontStyle.Bold);
            this.btnIssuePrinter.ForeColor = System.Drawing.Color.FromArgb(((int)(((byte)(15)))), ((int)(((byte)(23)))), ((int)(((byte)(42)))));
            this.btnIssuePrinter.Location = new System.Drawing.Point(20, 45);
            this.btnIssuePrinter.Name = "btnIssuePrinter";
            this.btnIssuePrinter.Size = new System.Drawing.Size(380, 50);
            this.btnIssuePrinter.TabIndex = 1;
            this.btnIssuePrinter.Text = "🖨️  Printer Error / เครื่องพิมพ์สลิปไม่ตอบสนอง";
            this.btnIssuePrinter.TextAlign = System.Drawing.ContentAlignment.MiddleLeft;
            this.btnIssuePrinter.UseVisualStyleBackColor = false;
            this.btnIssuePrinter.Click += new System.EventHandler(this.BtnIssueOption_Click);

            // btnIssueScanner
            this.btnIssueScanner.BackColor = System.Drawing.Color.White;
            this.btnIssueScanner.Cursor = System.Windows.Forms.Cursors.Hand;
            this.btnIssueScanner.FlatAppearance.BorderColor = System.Drawing.Color.FromArgb(((int)(((byte)(203)))), ((int)(((byte)(213)))), ((int)(((byte)(225)))));
            this.btnIssueScanner.FlatAppearance.BorderSize = 2;
            this.btnIssueScanner.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.btnIssueScanner.Font = new System.Drawing.Font("Segoe UI Semibold", 10.5F, System.Drawing.FontStyle.Bold);
            this.btnIssueScanner.ForeColor = System.Drawing.Color.FromArgb(((int)(((byte)(15)))), ((int)(((byte)(23)))), ((int)(((byte)(42)))));
            this.btnIssueScanner.Location = new System.Drawing.Point(20, 105);
            this.btnIssueScanner.Name = "btnIssueScanner";
            this.btnIssueScanner.Size = new System.Drawing.Size(380, 50);
            this.btnIssueScanner.TabIndex = 2;
            this.btnIssueScanner.Text = "📟  Scanner Issue / เครื่องอ่านบัตร RFID ค้าง";
            this.btnIssueScanner.TextAlign = System.Drawing.ContentAlignment.MiddleLeft;
            this.btnIssueScanner.UseVisualStyleBackColor = false;
            this.btnIssueScanner.Click += new System.EventHandler(this.BtnIssueOption_Click);

            // btnIssueSystemCrash
            this.btnIssueSystemCrash.BackColor = System.Drawing.Color.White;
            this.btnIssueSystemCrash.Cursor = System.Windows.Forms.Cursors.Hand;
            this.btnIssueSystemCrash.FlatAppearance.BorderColor = System.Drawing.Color.FromArgb(((int)(((byte)(203)))), ((int)(((byte)(213)))), ((int)(((byte)(225)))));
            this.btnIssueSystemCrash.FlatAppearance.BorderSize = 2;
            this.btnIssueSystemCrash.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.btnIssueSystemCrash.Font = new System.Drawing.Font("Segoe UI Semibold", 10.5F, System.Drawing.FontStyle.Bold);
            this.btnIssueSystemCrash.ForeColor = System.Drawing.Color.FromArgb(((int)(((byte)(15)))), ((int)(((byte)(23)))), ((int)(((byte)(42)))));
            this.btnIssueSystemCrash.Location = new System.Drawing.Point(20, 165);
            this.btnIssueSystemCrash.Name = "btnIssueSystemCrash";
            this.btnIssueSystemCrash.Size = new System.Drawing.Size(380, 50);
            this.btnIssueSystemCrash.TabIndex = 3;
            this.btnIssueSystemCrash.Text = "⚠️  System Freezes / โปรแกรมค้าง หลุด";
            this.btnIssueSystemCrash.TextAlign = System.Drawing.ContentAlignment.MiddleLeft;
            this.btnIssueSystemCrash.UseVisualStyleBackColor = false;
            this.btnIssueSystemCrash.Click += new System.EventHandler(this.BtnIssueOption_Click);

            // btnIssueOther
            this.btnIssueOther.BackColor = System.Drawing.Color.White;
            this.btnIssueOther.Cursor = System.Windows.Forms.Cursors.Hand;
            this.btnIssueOther.FlatAppearance.BorderColor = System.Drawing.Color.FromArgb(((int)(((byte)(203)))), ((int)(((byte)(213)))), ((int)(((byte)(225)))));
            this.btnIssueOther.FlatAppearance.BorderSize = 2;
            this.btnIssueOther.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.btnIssueOther.Font = new System.Drawing.Font("Segoe UI Semibold", 10.5F, System.Drawing.FontStyle.Bold);
            this.btnIssueOther.ForeColor = System.Drawing.Color.FromArgb(((int)(((byte)(15)))), ((int)(((byte)(23)))), ((int)(((byte)(42)))));
            this.btnIssueOther.Location = new System.Drawing.Point(20, 225);
            this.btnIssueOther.Name = "btnIssueOther";
            this.btnIssueOther.Size = new System.Drawing.Size(380, 50);
            this.btnIssueOther.TabIndex = 4;
            this.btnIssueOther.Text = "💬  Other / สอบถามหรือแจ้งปัญหาอื่นๆ";
            this.btnIssueOther.TextAlign = System.Drawing.ContentAlignment.MiddleLeft;
            this.btnIssueOther.UseVisualStyleBackColor = false;
            this.btnIssueOther.Click += new System.EventHandler(this.BtnIssueOption_Click);

            // lblSelectedIssueDisplay
            this.lblSelectedIssueDisplay.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(239)))), ((int)(((byte)(246)))), ((int)(((byte)(255)))));
            this.lblSelectedIssueDisplay.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            this.lblSelectedIssueDisplay.Font = new System.Drawing.Font("Segoe UI", 9F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.lblSelectedIssueDisplay.ForeColor = System.Drawing.Color.FromArgb(((int)(((byte)(29)))), ((int)(((byte)(78)))), ((int)(((byte)(216)))));
            this.lblSelectedIssueDisplay.Location = new System.Drawing.Point(20, 290);
            this.lblSelectedIssueDisplay.Name = "lblSelectedIssueDisplay";
            this.lblSelectedIssueDisplay.Padding = new System.Windows.Forms.Padding(6);
            this.lblSelectedIssueDisplay.Size = new System.Drawing.Size(380, 45);
            this.lblSelectedIssueDisplay.TabIndex = 5;
            this.lblSelectedIssueDisplay.Text = "เคสที่เลือก: Printer Error / เครื่องพิมพ์สลิปไม่ตอบสนอง";

            // btnStartChat
            this.btnStartChat.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(29)))), ((int)(((byte)(78)))), ((int)(((byte)(216)))));
            this.btnStartChat.Cursor = System.Windows.Forms.Cursors.Hand;
            this.btnStartChat.FlatAppearance.BorderSize = 0;
            this.btnStartChat.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.btnStartChat.Font = new System.Drawing.Font("Segoe UI", 12F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.btnStartChat.ForeColor = System.Drawing.Color.White;
            this.btnStartChat.Location = new System.Drawing.Point(20, 350);
            this.btnStartChat.Name = "btnStartChat";
            this.btnStartChat.Size = new System.Drawing.Size(380, 55);
            this.btnStartChat.TabIndex = 6;
            this.btnStartChat.Text = "⚡ Start Chat / เริ่มการสนทนา";
            this.btnStartChat.UseVisualStyleBackColor = false;
            this.btnStartChat.Click += new System.EventHandler(this.BtnStartChat_Click);

            // lblZeroLoginNotice
            this.lblZeroLoginNotice.Font = new System.Drawing.Font("Segoe UI", 8.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.lblZeroLoginNotice.ForeColor = System.Drawing.Color.FromArgb(((int)(((byte)(100)))), ((int)(((byte)(116)))), ((int)(((byte)(139)))));
            this.lblZeroLoginNotice.Location = new System.Drawing.Point(20, 415);
            this.lblZeroLoginNotice.Name = "lblZeroLoginNotice";
            this.lblZeroLoginNotice.Size = new System.Drawing.Size(380, 40);
            this.lblZeroLoginNotice.TabIndex = 7;
            this.lblZeroLoginNotice.Text = "🔒 ไม่ต้องลงชื่อเข้าใช้ (ระบบระบุตัวตนอัตโนมัติตามจุดชั่งน้ำหนักและกะทำงาน)";
            this.lblZeroLoginNotice.TextAlign = System.Drawing.ContentAlignment.TopCenter;

            // -------------------------------------------------------------
            // pnlChatState
            // -------------------------------------------------------------
            this.pnlChatState.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(248)))), ((int)(((byte)(249)))), ((int)(((byte)(255)))));
            this.pnlChatState.Controls.Add(this.rtbChatHistory);
            this.pnlChatState.Controls.Add(this.pnlInputArea);
            this.pnlChatState.Controls.Add(this.pnlChatSubHeader);
            this.pnlChatState.Dock = System.Windows.Forms.DockStyle.Fill;
            this.pnlChatState.Location = new System.Drawing.Point(0, 60);
            this.pnlChatState.Name = "pnlChatState";
            this.pnlChatState.Size = new System.Drawing.Size(420, 490);
            this.pnlChatState.TabIndex = 2;
            this.pnlChatState.Visible = false;

            // pnlChatSubHeader
            this.pnlChatSubHeader.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(239)))), ((int)(((byte)(244)))), ((int)(((byte)(255)))));
            this.pnlChatSubHeader.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            this.pnlChatSubHeader.Controls.Add(this.lblTicketBadge);
            this.pnlChatSubHeader.Controls.Add(this.btnEndChat);
            this.pnlChatSubHeader.Dock = System.Windows.Forms.DockStyle.Top;
            this.pnlChatSubHeader.Location = new System.Drawing.Point(0, 0);
            this.pnlChatSubHeader.Name = "pnlChatSubHeader";
            this.pnlChatSubHeader.Size = new System.Drawing.Size(420, 35);
            this.pnlChatSubHeader.TabIndex = 0;

            // lblTicketBadge
            this.lblTicketBadge.AutoSize = true;
            this.lblTicketBadge.Font = new System.Drawing.Font("Segoe UI", 9F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.lblTicketBadge.ForeColor = System.Drawing.Color.FromArgb(((int)(((byte)(29)))), ((int)(((byte)(78)))), ((int)(((byte)(216)))));
            this.lblTicketBadge.Location = new System.Drawing.Point(12, 9);
            this.lblTicketBadge.Name = "lblTicketBadge";
            this.lblTicketBadge.Size = new System.Drawing.Size(95, 15);
            this.lblTicketBadge.TabIndex = 0;
            this.lblTicketBadge.Text = "Ticket: #TK-8492";

            // btnEndChat (Aligned Right)
            this.btnEndChat.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(254)))), ((int)(((byte)(242)))), ((int)(((byte)(242)))));
            this.btnEndChat.Cursor = System.Windows.Forms.Cursors.Hand;
            this.btnEndChat.FlatAppearance.BorderColor = System.Drawing.Color.FromArgb(((int)(((byte)(239)))), ((int)(((byte)(68)))), ((int)(((byte)(68)))));
            this.btnEndChat.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.btnEndChat.Font = new System.Drawing.Font("Segoe UI", 8.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.btnEndChat.ForeColor = System.Drawing.Color.FromArgb(((int)(((byte)(220)))), ((int)(((byte)(38)))), ((int)(((byte)(38)))));
            this.btnEndChat.Location = new System.Drawing.Point(310, 4);
            this.btnEndChat.Name = "btnEndChat";
            this.btnEndChat.Size = new System.Drawing.Size(98, 26);
            this.btnEndChat.TabIndex = 2;
            this.btnEndChat.Text = "ปิดเคส / ปิดแชท";
            this.btnEndChat.UseVisualStyleBackColor = false;
            this.btnEndChat.Click += new System.EventHandler(this.BtnEndChat_Click);

            // rtbChatHistory
            this.rtbChatHistory.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(241)))), ((int)(((byte)(245)))), ((int)(((byte)(249)))));
            this.rtbChatHistory.BorderStyle = System.Windows.Forms.BorderStyle.None;
            this.rtbChatHistory.Dock = System.Windows.Forms.DockStyle.Fill;
            this.rtbChatHistory.Font = new System.Drawing.Font("Segoe UI", 9.5F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.rtbChatHistory.ForeColor = System.Drawing.Color.FromArgb(((int)(((byte)(15)))), ((int)(((byte)(23)))), ((int)(((byte)(42)))));
            this.rtbChatHistory.Location = new System.Drawing.Point(0, 35);
            this.rtbChatHistory.Name = "rtbChatHistory";
            this.rtbChatHistory.ReadOnly = true;
            this.rtbChatHistory.ScrollBars = System.Windows.Forms.RichTextBoxScrollBars.Vertical;
            this.rtbChatHistory.Size = new System.Drawing.Size(420, 405);
            this.rtbChatHistory.TabIndex = 1;
            this.rtbChatHistory.Text = "";

            // pnlInputArea (Bottom - 50px)
            this.pnlInputArea.BackColor = System.Drawing.Color.White;
            this.pnlInputArea.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            this.pnlInputArea.Controls.Add(this.txtMessageInput);
            this.pnlInputArea.Controls.Add(this.btnSend);
            this.pnlInputArea.Dock = System.Windows.Forms.DockStyle.Bottom;
            this.pnlInputArea.Location = new System.Drawing.Point(0, 440);
            this.pnlInputArea.Name = "pnlInputArea";
            this.pnlInputArea.Padding = new System.Windows.Forms.Padding(6);
            this.pnlInputArea.Size = new System.Drawing.Size(420, 50);
            this.pnlInputArea.TabIndex = 2;

            // txtMessageInput
            this.txtMessageInput.Anchor = ((System.Windows.Forms.AnchorStyles)(((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.txtMessageInput.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            this.txtMessageInput.Font = new System.Drawing.Font("Segoe UI", 10F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.txtMessageInput.Location = new System.Drawing.Point(8, 11);
            this.txtMessageInput.Name = "txtMessageInput";
            this.txtMessageInput.Size = new System.Drawing.Size(326, 25);
            this.txtMessageInput.TabIndex = 0;
            this.txtMessageInput.KeyDown += new System.Windows.Forms.KeyEventHandler(this.TxtMessageInput_KeyDown);

            // btnSend
            this.btnSend.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Right)));
            this.btnSend.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(29)))), ((int)(((byte)(78)))), ((int)(((byte)(216)))));
            this.btnSend.Cursor = System.Windows.Forms.Cursors.Hand;
            this.btnSend.FlatAppearance.BorderSize = 0;
            this.btnSend.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.btnSend.Font = new System.Drawing.Font("Segoe UI", 9.75F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.btnSend.ForeColor = System.Drawing.Color.White;
            this.btnSend.Location = new System.Drawing.Point(340, 9);
            this.btnSend.Name = "btnSend";
            this.btnSend.Size = new System.Drawing.Size(68, 29);
            this.btnSend.TabIndex = 1;
            this.btnSend.Text = "ส่ง ✈";
            this.btnSend.UseVisualStyleBackColor = false;
            this.btnSend.Click += new System.EventHandler(this.BtnSend_Click);

            // -------------------------------------------------------------
            // System Tray & Context Menu
            // -------------------------------------------------------------
            this.notifyIcon1.ContextMenuStrip = this.trayContextMenu;
            this.notifyIcon1.Icon = System.Drawing.SystemIcons.Application;
            this.notifyIcon1.Text = "ETS Support Chat (Online)";
            this.notifyIcon1.Visible = true;
            this.notifyIcon1.DoubleClick += new System.EventHandler(this.NotifyIcon1_DoubleClick);

            this.trayContextMenu.Items.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.menuOpen,
            this.menuExit});
            this.trayContextMenu.Name = "trayContextMenu";
            this.trayContextMenu.Size = new System.Drawing.Size(181, 48);

            this.menuOpen.Text = "เปิดหน้าต่างแชท";
            this.menuOpen.Click += new System.EventHandler(this.MenuOpen_Click);

            this.menuExit.Text = "ออกจากโปรแกรม";
            this.menuExit.Click += new System.EventHandler(this.MenuExit_Click);

            // -------------------------------------------------------------
            // Form1 Main Container (420x550)
            // -------------------------------------------------------------
            this.AutoScaleDimensions = new System.Drawing.SizeF(7F, 15F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(420, 550);
            this.Controls.Add(this.pnlIdleState);
            this.Controls.Add(this.pnlChatState);
            this.Controls.Add(this.pnlHeader);
            this.Font = new System.Drawing.Font("Segoe UI", 9F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.None;
            this.MaximizeBox = false;
            this.MinimizeBox = false;
            this.MaximumSize = new System.Drawing.Size(420, 550);
            this.MinimumSize = new System.Drawing.Size(420, 550);
            this.Name = "Form1";
            this.ShowInTaskbar = false;
            this.StartPosition = System.Windows.Forms.FormStartPosition.Manual;
            this.Text = "ETS Support Chat";
            this.TopMost = true;
            this.Load += new System.EventHandler(this.Form1_Load);

            this.pnlHeader.ResumeLayout(false);
            this.pnlHeader.PerformLayout();
            this.pnlIdleState.ResumeLayout(false);
            this.pnlIdleState.PerformLayout();
            this.pnlChatState.ResumeLayout(false);
            this.pnlChatSubHeader.ResumeLayout(false);
            this.pnlChatSubHeader.PerformLayout();
            this.pnlInputArea.ResumeLayout(false);
            this.pnlInputArea.PerformLayout();
            this.trayContextMenu.ResumeLayout(false);
            this.ResumeLayout(false);
        }

        #endregion

        // Controls definitions
        private System.Windows.Forms.Panel pnlHeader;
        private System.Windows.Forms.Label lblAppName;
        private System.Windows.Forms.Label lblLocationTitle;
        private System.Windows.Forms.Label lblStatusDot;
        private System.Windows.Forms.Label lblStatusText;
        private System.Windows.Forms.Button btnMinimize;
        private System.Windows.Forms.Button btnCloseWindow;

        private System.Windows.Forms.Panel pnlIdleState;
        private System.Windows.Forms.Label lblSelectPrompt;
        private System.Windows.Forms.Button btnIssuePrinter;
        private System.Windows.Forms.Button btnIssueScanner;
        private System.Windows.Forms.Button btnIssueSystemCrash;
        private System.Windows.Forms.Button btnIssueOther;
        private System.Windows.Forms.Label lblSelectedIssueDisplay;
        private System.Windows.Forms.Button btnStartChat;
        private System.Windows.Forms.Label lblZeroLoginNotice;

        private System.Windows.Forms.Panel pnlChatState;
        private System.Windows.Forms.Panel pnlChatSubHeader;
        private System.Windows.Forms.Label lblTicketBadge;
        private System.Windows.Forms.Button btnEndChat;
        private System.Windows.Forms.RichTextBox rtbChatHistory;
        private System.Windows.Forms.Panel pnlInputArea;
        private System.Windows.Forms.TextBox txtMessageInput;
        private System.Windows.Forms.Button btnSend;

        private System.Windows.Forms.NotifyIcon notifyIcon1;
        private System.Windows.Forms.ContextMenuStrip trayContextMenu;
        private System.Windows.Forms.ToolStripMenuItem menuOpen;
        private System.Windows.Forms.ToolStripMenuItem menuExit;
    }
}
