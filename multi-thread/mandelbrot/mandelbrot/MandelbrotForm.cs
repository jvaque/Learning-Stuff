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
        private Bitmap _bm;

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

                pictureBoxMandelbrot.Image = CalculateMandelbrot();

                buttonStart.Text = "Clear";
            }
            else
            {
                pictureBoxMandelbrot.Image = null;

                buttonStart.Text = "Start";
            }
            
            buttonStart.Enabled = true;
        }

        private Bitmap CalculateMandelbrot()
        {
            _bm = new Bitmap(pictureBoxMandelbrot.Width, pictureBoxMandelbrot.Height);

            double widthDouble = pictureBoxMandelbrot.Width;
            double heightDouble = pictureBoxMandelbrot.Height;

            // double aOffset = 0;
            // double bOffset = 0;
            // double aOffset = 0.2599;
            // double bOffset = 0.0015;
            // double aOffset = -0.75;
            // double bOffset = 0.015;
            // double aOffset = -1.315180982097868;
            // double bOffset = 0.073481649996795;
            double aOffset = -0.761574;
            double bOffset = -0.0847596;

            double scale = 0.001;
            double scaleX = scale;
            double scaleY = scale;

            int iterations = 255;

            double aspectRatio = widthDouble / heightDouble;

            if (aspectRatio > 1d)
            {
                scaleY /= aspectRatio;
            }
            else
            {
                scaleX *= aspectRatio;
            }

            // Divide x, y coordinates into squares
            List<SectionMandelbrotModel> subsections = GenerateListOfSubsections(pictureBoxMandelbrot.Width, pictureBoxMandelbrot.Height);

            List<Thread> threads = new();

            // Generate threads for each square
            foreach (var section in subsections)
            {
                // Mention that for this use case the use of a delegate is not neccesary
                ThreadWithState tws = new ThreadWithState(section, iterations, widthDouble, heightDouble, scaleX, scaleY, aOffset, bOffset, new CallbackDelegate(ResultCallback));
                threads.Add(new Thread(new ThreadStart(tws.ThreadProc)));
            }

            foreach (var thread in threads)
            {
                thread.Start();
            }

            // Wait for all threads to complete
            foreach (var thread in threads)
            {
                thread.Join();
            }

            // Iterate through data to generate final picture
            foreach (var section in subsections)
            {
                AddResultsToImage(section);
            }

            return _bm;
        }

        private List<SectionMandelbrotModel> GenerateListOfSubsections(int width, int height)
        {
            int maxWidth = 200;
            int maxHeight = 200;
            List<SectionMandelbrotModel> subsections = new List<SectionMandelbrotModel>();

            int bitmapWidth = maxWidth;
            int bitmapHeight = maxHeight;

            int posX = 0;
            int posY = 0;

            while (posY < height)
            {
                // test if out of bounds
                if (posY + maxHeight > height)
                {
                    bitmapHeight = height - posY;
                }
                while (posX < width)
                {
                    // test if out of bounds
                    if (posX + maxWidth > width)
                    {
                        bitmapWidth = width - posX;
                    }

                    // add model to list
                    subsections.Add(new SectionMandelbrotModel
                    {
                        SectionBitmap = new Bitmap(bitmapWidth, bitmapHeight),
                        PointStartX = posX,
                        PointStartY = posY
                    });

                    posX += maxWidth;
                }
                bitmapWidth = maxWidth;
                posX = 0;
                posY += maxHeight;
            }

            return subsections;
        }

        int threadCount = Environment.ProcessorCount;


        public static void ResultCallback(SectionMandelbrotModel section)
        {
            // For now we aren't doing anything in the callback method, and it could be removed
        }

        public void AddResultsToImage(SectionMandelbrotModel section)
        {
            int pointX;
            int pointY;

            for (int x = 0; x < section.SectionBitmap.Width; x++) 
            {
                pointX = x + section.PointStartX;

                for (int y = 0; y < section.SectionBitmap.Height; y++)
                {
                    pointY = y + section.PointStartY;

                    _bm.SetPixel(pointX, pointY, section.SectionBitmap.GetPixel(x, y));
                }
            }
        }

        private void buttonSaveImage_Click(object sender, EventArgs e)
        {
            SaveFileDialog sfd = new SaveFileDialog();
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
                pictureBoxMandelbrot.Image.Save(sfd.FileName, format);
            }
        }
    }
}
