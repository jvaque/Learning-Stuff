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
    }
}