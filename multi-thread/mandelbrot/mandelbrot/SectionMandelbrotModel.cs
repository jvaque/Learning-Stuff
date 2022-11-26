using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace mandelbrot
{
    public class SectionMandelbrotModel
    {
        public Bitmap SectionBitmap { get; set; }
        public int PointStartX { get; set; }
        public int PointStartY { get; set; }
        public int Iterations { get; set; }
        public double WindowWidth { get; set; }
        public double WindowHeight { get; set; }
        public double ScaleX { get; set; }
        public double ScaleY { get; set; }
        public double AOffset { get; set; }
        public double BOffset { get; set; }
    }
}