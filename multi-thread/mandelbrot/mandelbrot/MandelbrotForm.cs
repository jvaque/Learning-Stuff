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

            for (int x = 0; x < pictureBoxMandelbrot.Width; x++)
            {
                for (int y = 0; y < pictureBoxMandelbrot.Height; y++)
                {
                    double a = (double)(x - (pictureBoxMandelbrot.Width / 2)) / (double)(pictureBoxMandelbrot.Width / 4);
                    double b = (double)(y - (pictureBoxMandelbrot.Height / 2)) / (double)(pictureBoxMandelbrot.Height / 4);
                    Complex c = new Complex(a, b);
                    Complex z = new Complex(0, 0);

                    int iterationsRun = CalculateMandelbrot(z, c, 255);

                    bm.SetPixel(x, y, iterationsRun < 100 ? Color.Black : Color.White);
                }
            }

            pictureBoxMandelbrot.Image = bm;
        }

        private int CalculateMandelbrot(Complex z, Complex c, int maxIterations)
        {
            int iteration = 0;

            while (z.Magnitude <= 2 && iteration <= maxIterations)
            {
                iteration++;
                z = Complex.Pow(z, 2);
                z += c;
            }

            return iteration;
        }
    }
}
