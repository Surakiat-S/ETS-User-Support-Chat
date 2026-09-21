// ============================================================================
// File: Form1.cs
// Target: .NET 6.0+ (Windows 10 / 11 Optimized)
// Project: ETS Local Support Chat - ClientApp (Zero-Login Factory Workstation)
// ============================================================================

using System;
using System.Drawing;
using System.Windows.Forms;
using System.Runtime.InteropServices;
using System.IO;
using System.Net.Http;
using System.Net.Http.Json;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR.Client;
using SharedModels;

namespace ETSClientApp
{
    public partial class Form1 : Form
    {
        // -------------------------------------------------------------
        // Win32 API for Draggable Frameless Header (Mouse Drag)
        // -------------------------------------------------------------
        public const int WM_NCLBUTTONDOWN = 0xA1;
        public const int HT_CAPTION = 0x2;

        [DllImport("user32.dll")]
        public static extern int SendMessage(IntPtr hWnd, int Msg, int wParam, int lParam);

        [DllImport("user32.dll")]
        public static extern bool ReleaseCapture();

        // -------------------------------------------------------------
        // Application State & Configuration
        // -------------------------------------------------------------
        private string _stationLocation = "Bay 04 - Weighbridge (WB-04)";
        private string _selectedIssue = "Printer Error / เครื่องพิมพ์สลิปไม่ตอบสนอง";
        private string _activeTicketId = "";
        private bool _isConnected = true;

        private int _locationId = 1;
        private string _apiUrl = "http://localhost:5000";
        private HubConnection? _hubConnection;
        private readonly HttpClient _httpClient = new HttpClient();

        public Form1()
        {
            InitializeComponent();
        }

        // -------------------------------------------------------------
        // Form Lifecycle & Positioning (Bottom-Right Tray Placement)
        // -------------------------------------------------------------
        private void Form1_Load(object sender, EventArgs e)
        {
            // Position at bottom-right near system tray, respecting taskbar height
            PositionWindowNearTray();

            try
            {
                if (File.Exists("appsettings.json"))
                {
                    string json = File.ReadAllText("appsettings.json");
                    using JsonDocument doc = JsonDocument.Parse(json);
                    if (doc.RootElement.TryGetProperty("LocationId", out JsonElement locElem))
                        _locationId = locElem.GetInt32();
                    if (doc.RootElement.TryGetProperty("ApiUrl", out JsonElement apiElem))
                        _apiUrl = apiElem.GetString() ?? _apiUrl;
                }
                _httpClient.BaseAddress = new Uri(_apiUrl);
            }
            catch (Exception ex)
            {
                lblLocationTitle.Text = "Config Error: " + ex.Message;
            }

            // Load station config (In production, read from App.config or Registry)
            lblLocationTitle.Text = "Station: " + _stationLocation;
            UpdateConnectionStatus("Online");

            // Default selection
            HighlightSelectedIssue(btnIssuePrinter, "Printer Error / เครื่องพิมพ์สลิปไม่ตอบสนอง");
            
            // Ensure Idle state is active initially
            pnlIdleState.Visible = true;
            pnlChatState.Visible = false;
        }

        private void PositionWindowNearTray()
        {
            Rectangle workingArea = Screen.PrimaryScreen.WorkingArea;
            int margin = 12;
            int x = workingArea.Right - this.Width - margin;
            int y = workingArea.Bottom - this.Height - margin;
            this.Location = new Point(x, y);
        }

        public void UpdateConnectionStatus(string state)
        {
            switch (state)
            {
                case "Online":
                    _isConnected = true;
                    lblStatusDot.BackColor = Color.FromArgb(34, 197, 94); // #22c55e green
                    lblStatusText.Text = "Online";
                    lblStatusText.ForeColor = Color.White;
                    break;
                case "Retrying":
                    _isConnected = false;
                    lblStatusDot.BackColor = Color.FromArgb(245, 158, 11); // #f59e0b amber
                    lblStatusText.Text = "Network error: Retrying...";
                    lblStatusText.ForeColor = Color.FromArgb(254, 243, 199);
                    break;
                case "Offline":
                default:
                    _isConnected = false;
                    lblStatusDot.BackColor = Color.FromArgb(239, 68, 68); // #ef4444 red
                    lblStatusText.Text = "Offline - No connection";
                    lblStatusText.ForeColor = Color.FromArgb(254, 202, 202);
                    break;
            }
        }

        // -------------------------------------------------------------
        // Header & Dragging Events
        // -------------------------------------------------------------
        private void PnlHeader_MouseDown(object sender, MouseEventArgs e)
        {
            if (e.Button == MouseButtons.Left)
            {
                ReleaseCapture();
                SendMessage(this.Handle, WM_NCLBUTTONDOWN, HT_CAPTION, 0);
            }
        }

        private void BtnMinimize_Click(object sender, EventArgs e)
        {
            this.Hide(); // Minimize to system tray
        }

        private void BtnCloseWindow_Click(object sender, EventArgs e)
        {
            this.Hide(); // Zero disruption: do not kill background telemetry; minimize to tray
        }

        // -------------------------------------------------------------
        // Panel 1: Issue Selection Logic (Zero-Login)
        // -------------------------------------------------------------
        private void BtnIssueOption_Click(object sender, EventArgs e)
        {
            Button? clicked = sender as Button;
            if (clicked == null) return;

            // Reset borders on all buttons
            ResetIssueButtonStyles();

            // Set selected issue description
            if (clicked == btnIssuePrinter)
            {
                HighlightSelectedIssue(btnIssuePrinter, "Printer Error / เครื่องพิมพ์สลิปไม่ตอบสนอง");
            }
            else if (clicked == btnIssueScanner)
            {
                HighlightSelectedIssue(btnIssueScanner, "Scanner Issue / เครื่องอ่านบัตร RFID ค้าง");
            }
            else if (clicked == btnIssueSystemCrash)
            {
                HighlightSelectedIssue(btnIssueSystemCrash, "System Freezes / โปรแกรมค้าง หลุดบ่อย");
            }
            else if (clicked == btnIssueOther)
            {
                HighlightSelectedIssue(btnIssueOther, "Other / สอบถามหรือแจ้งปัญหาอื่นๆ");
            }
        }

        private void ResetIssueButtonStyles()
        {
            Color defaultBg = Color.White;
            Color defaultBorder = Color.FromArgb(203, 213, 225); // slate-300

            btnIssuePrinter.BackColor = defaultBg;
            btnIssuePrinter.FlatAppearance.BorderColor = defaultBorder;

            btnIssueScanner.BackColor = defaultBg;
            btnIssueScanner.FlatAppearance.BorderColor = defaultBorder;

            btnIssueSystemCrash.BackColor = defaultBg;
            btnIssueSystemCrash.FlatAppearance.BorderColor = defaultBorder;

            btnIssueOther.BackColor = defaultBg;
            btnIssueOther.FlatAppearance.BorderColor = defaultBorder;
        }

        private void HighlightSelectedIssue(Button btn, string issueText)
        {
            _selectedIssue = issueText;
            btn.BackColor = Color.FromArgb(239, 246, 255); // light blue tint
            btn.FlatAppearance.BorderColor = Color.FromArgb(29, 78, 216); // Blue brand color
            lblSelectedIssueDisplay.Text = "เคสที่เลือก: " + issueText;
        }

        // -------------------------------------------------------------
        // Transition: Open Ticket (Idle -> Active Chat)
        // -------------------------------------------------------------
        private async void BtnStartChat_Click(object sender, EventArgs e)
        {
            btnStartChat.Enabled = false;
            try
            {
                var ticket = new TicketModel 
                { 
                    LocationId = _locationId, 
                    Category = _selectedIssue, 
                    ShiftName = "Day Shift" 
                };

                var response = await _httpClient.PostAsJsonAsync("/api/Tickets", ticket);
                response.EnsureSuccessStatusCode();
                
                var result = await response.Content.ReadFromJsonAsync<TicketModel>();
                if (result != null)
                {
                    _activeTicketId = result.Id.ToString();
                    lblTicketBadge.Text = "Ticket: #" + _activeTicketId;

                    // Toggle Panel Visibility
                    pnlIdleState.Visible = false;
                    pnlChatState.Visible = true;
                    pnlChatState.BringToFront();

                    // Initialize chat stream
                    rtbChatHistory.Clear();
                    AppendSystemMessage("ระบบเชื่อมต่อเครือข่าย Intranet สำเร็จ - ส่งสัญญาณขอความช่วยเหลือ...");
                    AppendSystemMessage("สถานี: " + _stationLocation + " | ปัญหา: " + _selectedIssue);
                    AppendChatMessage("Operator (คุณ)", "แจ้งปัญหา: " + _selectedIssue, true);

                    // SignalR Connection
                    _hubConnection = new HubConnectionBuilder()
                        .WithUrl($"{_apiUrl}/chatHub")
                        .WithAutomaticReconnect()
                        .Build();

                    _hubConnection.On<int, string, string>("ReceiveMessage", (tid, user, message) =>
                    {
                        if (tid.ToString() == _activeTicketId && user != "Operator")
                        {
                            Invoke((Action)(() => AppendChatMessage(user, message, false)));
                        }
                    });

                    // Network Error Handling: Hook reconnection events
                    _hubConnection.Reconnecting += (error) =>
                    {
                        Invoke((Action)(() => {
                            UpdateConnectionStatus("Retrying");
                            AppendSystemMessage("⚠️ เครือข่ายขัดข้อง กำลังพยายามเชื่อมต่อใหม่...");
                        }));
                        return Task.CompletedTask;
                    };

                    _hubConnection.Reconnected += (connectionId) =>
                    {
                        Invoke((Action)(() => {
                            UpdateConnectionStatus("Online");
                            AppendSystemMessage("✅ เชื่อมต่อเครือข่ายสำเร็จ");
                        }));
                        return Task.CompletedTask;
                    };

                    _hubConnection.Closed += (error) =>
                    {
                        Invoke((Action)(() => {
                            UpdateConnectionStatus("Offline");
                            AppendSystemMessage("❌ การเชื่อมต่อถูกตัดขาด: " + (error?.Message ?? "Unknown error"));
                        }));
                        return Task.CompletedTask;
                    };

                    await _hubConnection.StartAsync();
                    await _hubConnection.InvokeAsync("JoinTicketGroup", _activeTicketId);

                    AppendSystemMessage("เชื่อมต่อระบบแชทสำเร็จ รอเจ้าหน้าที่...");
                    txtMessageInput.Focus();
                    UpdateConnectionStatus("Online");
                }
            }
            catch (Exception ex)
            {
                UpdateConnectionStatus("Offline");
                lblZeroLoginNotice.Text = "❌ Network error: " + ex.Message;
            }
            finally
            {
                btnStartChat.Enabled = true;
            }
        }

        // -------------------------------------------------------------
        // Transition: End Chat / Close Ticket (Active Chat -> Idle)
        // -------------------------------------------------------------
        private async void BtnEndChat_Click(object sender, EventArgs e)
        {
            DialogResult confirm = MessageBox.Show(
                "ต้องการปิดเคสการแจ้งปัญหาและจบการสนทนานี้หรือไม่?\n(Ticket: " + _activeTicketId + ")",
                "ยืนยันการปิดเคส (Close Ticket)",
                MessageBoxButtons.YesNo,
                MessageBoxIcon.Question);

            if (confirm == DialogResult.Yes)
            {
                if (_hubConnection != null)
                {
                    await _hubConnection.StopAsync();
                    await _hubConnection.DisposeAsync();
                    _hubConnection = null;
                }

                pnlChatState.Visible = false;
                pnlIdleState.Visible = true;
                pnlIdleState.BringToFront();

                _activeTicketId = "";
                txtMessageInput.Clear();
            }
        }

        // -------------------------------------------------------------
        // Messaging Logic
        // -------------------------------------------------------------
        private void BtnSend_Click(object sender, EventArgs e)
        {
            SendMessageFromInput();
        }

        private void TxtMessageInput_KeyDown(object sender, KeyEventArgs e)
        {
            if (e.KeyCode == Keys.Enter)
            {
                e.SuppressKeyPress = true; // Prevent beep sound
                SendMessageFromInput();
            }
        }

        private async void SendMessageFromInput()
        {
            string message = txtMessageInput.Text.Trim();
            if (string.IsNullOrEmpty(message) || _hubConnection == null) return;

            AppendChatMessage("Operator (คุณ)", message, true);
            txtMessageInput.Clear();
            txtMessageInput.Focus();

            try
            {
                await _hubConnection.InvokeAsync("SendMessage", int.Parse(_activeTicketId), "Operator", message);
            }
            catch (Exception ex)
            {
                UpdateConnectionStatus("Offline");
                AppendSystemMessage("❌ ส่งข้อความไม่สำเร็จ: " + ex.Message);
            }
        }

        private void AppendChatMessage(string senderName, string message, bool isSelf)
        {
            string timeStr = DateTime.Now.ToString("HH:mm");
            
            rtbChatHistory.SelectionStart = rtbChatHistory.TextLength;
            rtbChatHistory.SelectionLength = 0;

            // Sender header formatting
            rtbChatHistory.SelectionFont = new Font("Segoe UI", 9F, FontStyle.Bold);
            rtbChatHistory.SelectionColor = isSelf ? Color.FromArgb(29, 78, 216) : Color.FromArgb(15, 23, 42);
            rtbChatHistory.AppendText("\n" + senderName + "  [" + timeStr + "]\n");

            // Body text formatting
            rtbChatHistory.SelectionFont = new Font("Segoe UI", 9.5F, FontStyle.Regular);
            rtbChatHistory.SelectionColor = Color.FromArgb(30, 41, 59);
            rtbChatHistory.AppendText("  " + message + "\n");

            // Auto-scroll to bottom
            rtbChatHistory.ScrollToCaret();
        }

        private void AppendSystemMessage(string systemNotice)
        {
            rtbChatHistory.SelectionStart = rtbChatHistory.TextLength;
            rtbChatHistory.SelectionLength = 0;
            rtbChatHistory.SelectionFont = new Font("Segoe UI", 8F, FontStyle.Italic);
            rtbChatHistory.SelectionColor = Color.FromArgb(100, 116, 139);
            rtbChatHistory.AppendText("\n--- " + systemNotice + " ---\n");
            rtbChatHistory.ScrollToCaret();
        }

        // -------------------------------------------------------------
        // System Tray Handlers
        // -------------------------------------------------------------
        private void NotifyIcon1_DoubleClick(object sender, EventArgs e)
        {
            ShowAndActivateForm();
        }

        private void MenuOpen_Click(object sender, EventArgs e)
        {
            ShowAndActivateForm();
        }

        private void ShowAndActivateForm()
        {
            this.Show();
            this.WindowState = FormWindowState.Normal;
            PositionWindowNearTray();
            this.BringToFront();
            this.Activate();
        }

        private void MenuExit_Click(object sender, EventArgs e)
        {
            notifyIcon1.Visible = false;
            Application.Exit();
        }
    }
}
