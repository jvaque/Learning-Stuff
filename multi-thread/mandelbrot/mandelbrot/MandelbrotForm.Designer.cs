
namespace mandelbrot
{
    partial class MandelbrotForm
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.pictureBoxMandelbrot = new System.Windows.Forms.PictureBox();
            ((System.ComponentModel.ISupportInitialize)(this.pictureBoxMandelbrot)).BeginInit();
            this.SuspendLayout();
            // 
            // pictureBoxMandelbrot
            // 
            this.pictureBoxMandelbrot.Location = new System.Drawing.Point(12, 12);
            this.pictureBoxMandelbrot.Name = "pictureBoxMandelbrot";
            this.pictureBoxMandelbrot.Size = new System.Drawing.Size(776, 776);
            this.pictureBoxMandelbrot.TabIndex = 0;
            this.pictureBoxMandelbrot.TabStop = false;
            // 
            // MandelbrotForm
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(7F, 15F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(800, 800);
            this.Controls.Add(this.pictureBoxMandelbrot);
            this.Name = "MandelbrotForm";
            this.Text = "MandelbrotForm";
            this.Shown += new System.EventHandler(this.MandelbrotForm_Shown);
            ((System.ComponentModel.ISupportInitialize)(this.pictureBoxMandelbrot)).EndInit();
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.PictureBox pictureBoxMandelbrot;
    }
}