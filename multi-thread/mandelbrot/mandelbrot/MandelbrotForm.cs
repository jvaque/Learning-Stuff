using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
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

        private void MandelbrotForm_Shown(object sender, EventArgs e)
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



            //System.Drawing.Size(1256, 696); Copied from the Designer i think

            SectionMandelbrotModel section1 = new SectionMandelbrotModel
            {
                SectionBitmap = new Bitmap(628, 348),
                PointStartX = 0,
                PointStartY = 0
            };
            SectionMandelbrotModel section2 = new SectionMandelbrotModel
            {
                SectionBitmap = new Bitmap(628, 348),
                PointStartX = 628,
                PointStartY = 0
            };
            SectionMandelbrotModel section3 = new SectionMandelbrotModel
            {
                SectionBitmap = new Bitmap(628, 348),
                PointStartX = 0,
                PointStartY = 348
            };
            SectionMandelbrotModel section4 = new SectionMandelbrotModel
            {
                SectionBitmap = new Bitmap(628, 348),
                PointStartX = 628,
                PointStartY = 348
            };



            // Supply the state information required by the task.
            ThreadWithState tws1 = new ThreadWithState(section1, iterations, widthDouble, heightDouble, scaleX, scaleY, aOffset, bOffset, new CallbackDelegate(ResultCallback));
            ThreadWithState tws2 = new ThreadWithState(section2, iterations, widthDouble, heightDouble, scaleX, scaleY, aOffset, bOffset, new CallbackDelegate(ResultCallback));
            ThreadWithState tws3 = new ThreadWithState(section3, iterations, widthDouble, heightDouble, scaleX, scaleY, aOffset, bOffset, new CallbackDelegate(ResultCallback));
            ThreadWithState tws4 = new ThreadWithState(section4, iterations, widthDouble, heightDouble, scaleX, scaleY, aOffset, bOffset, new CallbackDelegate(ResultCallback));

            // Create a thread to execute the task, and then
            // start the thread.

            //List<Thread> threads = new List<Thread>();
            Thread thread1 = new Thread(new ThreadStart(tws1.ThreadProc));
            Thread thread2 = new Thread(new ThreadStart(tws2.ThreadProc));
            Thread thread3 = new Thread(new ThreadStart(tws3.ThreadProc));
            Thread thread4 = new Thread(new ThreadStart(tws4.ThreadProc));

            thread1.Start();
            thread2.Start();
            thread3.Start();
            thread4.Start();

            thread1.Join();
            thread2.Join();
            thread3.Join();
            thread4.Join();


            // Divide x, y coordinates into squares
            // Generate threads for each square
            // Wait for all threads to complete
            // Iterate through data to generate final picture
            AddResultsToImage(section1);
            AddResultsToImage(section2);
            AddResultsToImage(section3);
            AddResultsToImage(section4);


            // Place Pixel at center of screen
            // bm.SetPixel(pictureBoxMandelbrot.Width / 2, pictureBoxMandelbrot.Height / 2, Color.White);
            pictureBoxMandelbrot.Image = _bm;
        }



        public static void ResultCallback(SectionMandelbrotModel section)
        {
            //return new SectionModel
            //{
            //    Bm = bmSection,
            //    XCoord = xStart,
            //    YCoord = yStart
            //};
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
    }
}
