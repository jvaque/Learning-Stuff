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
        private Bitmap _image;
        public Bitmap Image
        {
            get { return _image; }
        }

        private double _widthDouble;
        private double _heightDouble;

        private double _aOffset; // Centre point for the real component (X coordinate)
        private double _bOffset; // Centre point for the imaginary component (Y coordinate)

        private double _scale; // Zoom level
        private double _scaleX;
        private double _scaleY;
        public int Iterations { get; set; }

        public MandelbrotGenerator(int width, int height)
        {
            _image = new Bitmap(width, height);

            _widthDouble = width;
            _heightDouble = height;

            // _aOffset = 0;
            // _bOffset = 0;
            // _scale = 1;

            // _aOffset = 0.2599;
            // _bOffset = 0.0015;
            // _scale = 0.0001;

            // _aOffset = -0.75;
            // _bOffset = 0.015;
            // _scale = 0.01;

            // _aOffset = -1.315180982097868;
            // _bOffset = 0.073481649996795;
            // _scale = 0.0036;

            _aOffset = -0.761574;
            _bOffset = -0.0847596;
            _scale = 0.001;

            // _aOffset = -0.235125;
            // _bOffset = 0.827215;
            // _scale = 4.0E-5;

            CalculateScaleXY();

            Iterations = 255;
        }

        private void CalculateScaleXY()
        {
            _scaleX = _scale;
            _scaleY = _scale;

            double aspectRatio = _widthDouble / _heightDouble;

            if (aspectRatio > 1d)
            {
                _scaleY /= aspectRatio;
            }
            else
            {
                _scaleX *= aspectRatio;
            }
        }

        public Bitmap CalculateMultiThreaded()
        {
            // Divide x, y coordinates into squares
            List<SectionMandelbrotModel> subsections = GenerateListOfSubsections();

            List<Thread> threads = new();

            // Generate threads for each square
            foreach (var section in subsections)
            {
                // Mention that for this use case the use of a delegate is not neccesary
                ThreadWithState tws = new(section, new CallbackDelegate(ResultCallback));
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

        private List<SectionMandelbrotModel> GenerateListOfSubsections()
        {
            int maxWidth = 200;
            int maxHeight = 200;
            List<SectionMandelbrotModel> subsections = new();

            int bitmapWidth = maxWidth;
            int bitmapHeight = maxHeight;

            int posX = 0;
            int posY = 0;

            while (posY < Image.Height)
            {
                // test if out of bounds
                if (posY + maxHeight > Image.Height)
                {
                    bitmapHeight = Image.Height - posY;
                }
                while (posX < Image.Width)
                {
                    // test if out of bounds
                    if (posX + maxWidth > Image.Width)
                    {
                        bitmapWidth = Image.Width - posX;
                    }

                    // add model to list
                    subsections.Add(new SectionMandelbrotModel
                    {
                        SectionBitmap = new Bitmap(bitmapWidth, bitmapHeight),
                        PointStartX = posX,
                        PointStartY = posY,
                        Iterations = Iterations,
                        WindowWidth = _widthDouble,
                        WindowHeight = _heightDouble,
                        ScaleX = _scaleX,
                        ScaleY = _scaleY,
                        AOffset = _aOffset,
                        BOffset = _bOffset
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
