using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Numerics;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace mandelbrot
{
    public partial class MandelbrotForm : Form
    {
        public MandelbrotForm()
        {
            InitializeComponent();
        }

        private void MandelbrotForm_Shown(object sender, EventArgs e)
        {
            Bitmap bm = new Bitmap(pictureBoxMandelbrot.Width, pictureBoxMandelbrot.Height);

            double aOffset = -0.75;
            double bOffset = 0.015;
            //double aOffset = -1.315180982097868;
            //double bOffset = 0.073481649996795;
            double zoom = 0.00001;
            int iterations = 10000;

            for (int x = 0; x < pictureBoxMandelbrot.Width; x++)
            {
                for (int y = 0; y < pictureBoxMandelbrot.Height; y++)
                {
                    double a = (((double)(x - (pictureBoxMandelbrot.Width / 2)) / (double)(pictureBoxMandelbrot.Width / 4)) * zoom) + aOffset;
                    double b = -(((double)(y - (pictureBoxMandelbrot.Height / 2)) / (double)(pictureBoxMandelbrot.Height / 4)) * zoom) + bOffset;
                    Complex c = new Complex(a, b);
                    Complex z = new Complex(0, 0);

                    int iterationsRun = CalculateMandelbrot(z, c, iterations);

                    bm.SetPixel(x, y, GetColor(iterationsRun, iterations));
                }
            }

            // Place Pixel at center of screen
            // bm.SetPixel(pictureBoxMandelbrot.Width / 2, pictureBoxMandelbrot.Height / 2, Color.White);
            pictureBoxMandelbrot.Image = bm;
        }

        private int CalculateMandelbrot(Complex z, Complex c, int maxIterations)
        {
            int iteration = 0;

            while (z.Magnitude <= 2 && iteration < maxIterations)
            {
                iteration++;
                z = Complex.Pow(z, 2);
                z += c;
            }

            return iteration;
        }

        private Color GetColor(int iterationsRun, int maxIterations)
        {
            if (iterationsRun == maxIterations)
            {
                return Color.Black;
            }
            else
            {
                double ttttttttttt = (double)(iterationsRun) / maxIterations;

                int blueness = (int)(255 * ttttttttttt);

                return Color.FromArgb(40, 10, blueness);
            }
        }
    }
}
