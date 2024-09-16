import multer from 'multer';
import sharp from 'sharp';

const upload = multer({
  storage: multer.memoryStorage(),
});

// Disable Next.js's body parser
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    upload.single('image')(req, res, async (err) => {
      if (err) {
        return res.status(500).json({ message: 'File upload failed.' });
      }

      const { format } = req.body;
      const imageBuffer = req.file.buffer;

      try {
        let convertedImage;

        switch (format) {
          case 'jpg':
            convertedImage = await sharp(imageBuffer).jpeg().toBuffer();
            break;
          case 'png':
            convertedImage = await sharp(imageBuffer).png().toBuffer();
            break;
          case 'webp':
            convertedImage = await sharp(imageBuffer).webp().toBuffer();
            break;
          case 'gif':
            convertedImage = await sharp(imageBuffer).gif().toBuffer();
            break;
          case 'tiff':
            convertedImage = await sharp(imageBuffer).tiff().toBuffer();
            break;
          default:
            return res.status(400).json({ message: 'Unsupported format' });
        }

        res.setHeader('Content-Type', `image/${format}`);
        res.send(convertedImage);
      } catch (error) {
        res.status(500).json({ message: 'Image conversion failed.', error });
      }
    });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
