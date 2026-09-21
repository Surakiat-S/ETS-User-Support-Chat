using ETSClientApp;
using System;
using System.Windows.Forms;

namespace ClientApp;

static class Program
{
    /// <summary>
    ///  The main entry point for the application.
    /// </summary>
    [STAThread]
    static void Main()
    {
        try
        {
            // To customize application configuration such as set high DPI settings or default font,
            // see https://aka.ms/applicationconfiguration.
            ApplicationConfiguration.Initialize();
            Application.Run(new Form1());
        }
        catch (Exception ex)
        {
            MessageBox.Show($"Startup Error: {ex.Message}\n\n{ex.StackTrace}", "Application Crash", MessageBoxButtons.OK, MessageBoxIcon.Error);
        }
    }    
}