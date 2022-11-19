using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Drawing.Drawing2D;
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
        //private MandelbrotGenerator _mbGenerator = new(1080, 1980);
        //private MandelbrotGenerator _mbGenerator = new(960, 540);
        //private MandelbrotGenerator _mbGenerator = new(540, 960);
        private MandelbrotGenerator _mbGenerator = new(1000, 1000);
        //private MandelbrotGenerator _mbGenerator = new(2000, 1000);
        //private MandelbrotGenerator _mbGenerator = new(1000, 2000);
        //private MandelbrotGenerator _mbGenerator = new(3840, 2160);
        //private MandelbrotGenerator _mbGenerator = new(2160, 3840);
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

                Bitmap bmp = _mbGenerator.CalculateMultiThreaded();

                pictureBoxMandelbrot.Image = BitmapResize(bmp, pictureBoxMandelbrot.Width, pictureBoxMandelbrot.Height);

                buttonStart.Text = "Clear";
            }
            else
            {
                pictureBoxMandelbrot.Image = null;

                buttonStart.Text = "Start";
            }

            buttonStart.Enabled = true;
        }

        /// <summary>
        /// Generate a rectangle for the image to get scaled down into the
        ///  canvas, such that the rectangle is centered relative to the canvas
        ///  and the rectangle maintains the original image aspect ratio.
        /// </summary>
        /// <param name="canvasWidth"></param>
        /// <param name="canvasHeight"></param>
        /// <param name="pictureWidth"></param>
        /// <param name="pictureHeight"></param>
        /// <returns></returns>
        private static Rectangle CalculateRectangle(int canvasWidth, int canvasHeight, int pictureWidth, int pictureHeight)
        {
            // Calculate the width, height and starting points for the scaled down rectangle to fit in the canvas
            double aspectRatioCanvas = (double)canvasWidth / (double)canvasHeight;
            double aspectRatioPicture = (double)pictureWidth / (double)pictureHeight;

            if (aspectRatioCanvas > aspectRatioPicture)
            {
                int newWidth = (int)(canvasHeight * aspectRatioPicture);
                int widthStartPoint = (canvasWidth / 2) - (newWidth / 2);
                return new Rectangle(widthStartPoint, 0, newWidth, canvasHeight);
            }
            else if (aspectRatioCanvas < aspectRatioPicture)
            {
                int newHeight = (int)(canvasWidth / aspectRatioPicture);
                int heightStartPoint = canvasHeight / 2 - newHeight / 2;
                return new Rectangle(0, heightStartPoint, canvasWidth, newHeight);
            }
            else
            {
                // aspectRatioCanvas == aspectRatioPicture
                return new Rectangle(0, 0, canvasWidth, canvasHeight);
            }
        }

        private static Bitmap BitmapResize(Bitmap image, int width, int height)
        {

            //var destRect = new Rectangle(0, 0, width, height);
            var destRect = CalculateRectangle(width, height, image.Width, image.Height);
            var destImage = new Bitmap(width, height);

            destImage.SetResolution(image.HorizontalResolution, image.VerticalResolution);

            using (var graphics = Graphics.FromImage(destImage))
            {
                graphics.CompositingMode = CompositingMode.SourceCopy;
                graphics.CompositingQuality = CompositingQuality.HighQuality;
                graphics.InterpolationMode = InterpolationMode.HighQualityBicubic;
                graphics.SmoothingMode = SmoothingMode.HighQuality;
                graphics.PixelOffsetMode = PixelOffsetMode.HighQuality;

                using (var wrapMode = new ImageAttributes())
                {
                    wrapMode.SetWrapMode(WrapMode.TileFlipXY);
                    graphics.DrawImage(image, destRect, 0, 0, image.Width, image.Height, GraphicsUnit.Pixel, wrapMode);
                    // Tiling with multiples of the image.Width and image.Height result in intresting results to maybe
                    //  explore some other time.
                    // graphics.DrawImage(image, destRect, 0, 0, image.Width * 6, image.Height * 5, GraphicsUnit.Pixel, wrapMode);
                }
            }

            return destImage;
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
