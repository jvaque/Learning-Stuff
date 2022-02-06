using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Drawing.Imaging;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace mandelbrot
{
    public partial class MandelbrotForm : Form
    {
        //private MandelbrotGenerator _mbGenerator = new(1920, 1080);
        private MandelbrotGenerator _mbGenerator = new(3840, 2160);
        //private MandelbrotGenerator _mbGenerator = new(16000,9000);

        int threadCount = Environment.ProcessorCount;

        public MandelbrotForm()
        {
            InitializeComponent();
        }

        private void buttonStart_Click(object sender, EventArgs e)
        {
            buttonStart.Enabled = false;

            if (buttonStart.Text == "Start")
            {
                buttonStart.Text = "Running";

                pictureBoxMandelbrot.Image = _mbGenerator.Calculate();

                buttonStart.Text = "Clear";
            }
            else
            {
                pictureBoxMandelbrot.Image = null;

                buttonStart.Text = "Start";
            }
            
            buttonStart.Enabled = true;
        }

        private void buttonSaveImage_Click(object sender, EventArgs e)
        {
            SaveFileDialog sfd = new();
            sfd.FileName = $"Mandelbrot_{DateTime.Now:yyyy-MM-dd_HHmmss}.png";
            sfd.Filter = "PNG Image(*.png)|*.png|JPG Image(*.jpg)|*.jpg|BMP Image(*.bmp)|*.bmp";
            ImageFormat format = ImageFormat.Png;
            if (sfd.ShowDialog() == System.Windows.Forms.DialogResult.OK)
            {
                string ext = System.IO.Path.GetExtension(sfd.FileName);
                switch (ext)
                {
                    case ".jpg":
                        format = ImageFormat.Jpeg;
                        break;
                    case ".bmp":
                        format = ImageFormat.Bmp;
                        break;
                }
                _mbGenerator.Image.Save(sfd.FileName, format);
            }
        }
    }
}
