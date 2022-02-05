using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace mandelbrot
{
    public class MandelbrotGenerator
    {
        public Bitmap Image { get; set; }
        public double AOffset { get; set; }
        public double BOffset { get; set; }
        public double Scale { get; set; }
        public int Iterations { get; set; }

        public MandelbrotGenerator(int width, int height)
        {
            Image = new Bitmap(width, height);
            // double aOffset = 0;
            // double bOffset = 0;
            // double aOffset = 0.2599;
            // double bOffset = 0.0015;
            // double aOffset = -0.75;
            // double bOffset = 0.015;
            // double aOffset = -1.315180982097868;
            // double bOffset = 0.073481649996795;
            AOffset = -0.761574;
            BOffset = -0.0847596;
            Scale = 0.001;
            Iterations = 255;
        }

        public Bitmap Calculate()
        {
            double width = Image.Width;
            double heigh = Image.Height;

            double scaleX = Scale;
            double scaleY = Scale;

            double aspectRatio = width / heigh;

            if (aspectRatio > 1d)
            {
                scaleY /= aspectRatio;
            }
            else
            {
                scaleX *= aspectRatio;
            }

            // Divide x, y coordinates into squares
            List<SectionMandelbrotModel> subsections = GenerateListOfSubsections(Image.Width, Image.Height);

            List<Thread> threads = new();

            // Generate threads for each square
            foreach (var section in subsections)
            {
                // Mention that for this use case the use of a delegate is not neccesary
                ThreadWithState tws = new ThreadWithState(section, Iterations, width, heigh, scaleX, scaleY, AOffset, BOffset, new CallbackDelegate(ResultCallback));
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

            return Image;
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

                    Image.SetPixel(pointX, pointY, section.SectionBitmap.GetPixel(x, y));
                }
            }
        }

        public static void ResultCallback(SectionMandelbrotModel section)
        {
            // For now we aren't doing anything in the callback method, and it could be removed
        }
    }
}
