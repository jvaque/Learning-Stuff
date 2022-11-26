using System;
using System.Drawing;
using System.Numerics;

namespace mandelbrot
{
    // Delegate that defines the signature for the callback method.
    public delegate void CallbackDelegate(SectionMandelbrotModel section);

    public class ThreadWithState
    {
        // State information used in the task.
        private SectionMandelbrotModel _section;

        // Delegate used to execute the callback method when the
        // task is complete.
        private CallbackDelegate _callbackDelegate;

        // The constructor obtains the state information.
        public ThreadWithState(
            SectionMandelbrotModel section,
            CallbackDelegate callbackDelegate)
        {
            _section = section;
            _callbackDelegate = callbackDelegate;
        }

        // The thread procedure performs the task, and then
        // invokes the callback delegate to get the results back
        // to the main thread.
        // private void SectionMandelbrot()
        public void ThreadProc()
        {
            int pointX;
            int pointY;

            for (int x = 0; x < _section.SectionBitmap.Width; x++)
            {
                pointX = _section.PointStartX + x;

                for (int y = 0; y < _section.SectionBitmap.Height; y++)
                {
                    pointY = _section.PointStartY + y;

                    double a = (((pointX / _section.WindowWidth) - 0.5) * 4 * _section.ScaleX) + _section.AOffset;
                    double b = (((-pointY / _section.WindowHeight) + 0.5) * 4 * _section.ScaleY) + _section.BOffset;

                    Complex c = new(a, b);
                    Complex z = new(0, 0);

                    int iterationsRun = CalculateMandelbrot(z, c, _section.Iterations);

                    _section.SectionBitmap.SetPixel(x, y, GetColor(iterationsRun, _section.Iterations));
                }
            }

            if (_callbackDelegate != null)
            {
                _callbackDelegate(_section);
            }
        }

        private static int CalculateMandelbrot(Complex z, Complex c, int maxIterations)
        {
            int iteration;

            for (iteration = 0; iteration < maxIterations; iteration++)
            {
                z = Complex.Pow(z, 2) + c;

                if (z.Magnitude > 2)
                {
                    break;
                }
            }

            return iteration;
        }

        private static Color GetColor(int iterationsRun, int maxIterations)
        {
            if (iterationsRun == maxIterations)
            {
                return Color.Black;
            }
            else
            {
                double normalizedIterations = (double)(iterationsRun) / maxIterations;

                int blueness = (int)(255 * normalizedIterations);

                return Color.FromArgb(40, 10, blueness);
                //return Color.FromArgb(blueness);
                //return Color.White;
            }
        }
    }
}
