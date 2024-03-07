const {PrismaClient} = require('@prisma/client');

const prisma = new PrismaClient();

exports.getAllBanners = async (req, res) => {
  try {
    const banner = await prisma.banners.findMany();
    if(banner.length === 0) {
      return res.status(404).json({message: 'No banner found'});
    }
    res.status(200).json(banner);
  }catch(err) {
    res.status(500).json({message: 'Something went wrong', error: err.message});
  }
}

exports.getBannerById = async (req, res) => {
  try {
    const {id} = req.params;
    const banner = await prisma.banners.findUnique({where: {id}});
    if(!banner) {
      return res.status(404).json({message: 'Banner not found'});
    }
    res.status(200).json(banner);
  }catch(err) {
    res.status(500).json({message: 'Something went wrong', error: err.message});
  }
}

exports.createBanner = async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0 || !req.files.file) {
    return res.status(400).json({ message: 'Tidak ada file yang diunggah!' });
  }

  const file = req.files.file;
  const fileSize = file.data.length;
  const ext = extname(file.name);
  const fileName = Date.now() + ext;
  const url = `${req.protocol}://${req.get('host')}/banners/${fileName}`;
  const allowedType = ['.png', '.jpg', '.jpeg'];

  if (!allowedType.includes(ext.toLowerCase())) {
    res.status(422).json({ msg: 'Invalid Images' });
  }

  if (fileSize > 2000000) {
    res.status(422).json({ msg: 'Image harus kurang dari 2mb' });
  }

  file.mv(`./public/banners/${fileName}`, async (err) => {
    if (err) {
      return res.status(500).json({ msg: err.message });
    }

    try {
      await prisma.banners.create({
        data: {
          img: fileName,
          imgUrl: url,
          ...req.body,
        },
      });
      res.status(201).json({ msg: 'Banner berhasil ditambahkan!' });
    } catch (error) {
      console.log(error.message);
    }
  });
}

exports.updateBanner = async (req, res) => {
  const banner = await prisma.banners.findFirst({
    where: {
      id: req.params.id,
    },
  });

  if (!banner) {
    return res.status(404).json({ msg: 'Banner not found.' });
  }

  let fileName = banner.img;
  if (req.files === null) {
    fileName = banner.img
    }else{
    const file = req.files.file;
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    fileName = file.md5 + Date.now() + ext;
    const allowedType = ['.png', '.jpg', '.jpeg'];

    if (!allowedType.includes(ext.toLowerCase())) {
      res.status(422).json({ msg: 'Invalid Images' });
    }

    if (fileSize > 2000000)
      res.status(422).json({ msg: 'Image must be less than 2mb' });

    const filePath = `./public/banners/${banner.img}`;
    fs.unlinkSync(filePath);

    file.mv(`./public/banners/${fileName}`, (err) => {
      if (err) return res.status(500).json({ msg: err.message });
    });
  }

  const url = `${req.protocol}://${req.get('host')}/banners/${fileName}`

  try {
    await prisma.banners.update({
      where: {
        id: banner.id,
      },
      data: {
        img: fileName,
        imgUrl: url,
        ...req.body,
      },
    });
    res.status(200).json({ msg: 'Banner updated!' });
  } catch (error) {
    console.log(error.message);
  }
}

exports.deleteBanner = async (req, res) => {
  const banner = await prisma.banners.findFirst({
    where: {
      id: req.params.id,
    },
  });

  if (!banner) {
    return res.status(404).json({ msg: 'Banner not found.' });
  }

  try {
    await prisma.banners.delete({
      where: {
        id: banner.id,
      },
    });
    res.status(200).json({ msg: 'Banner deleted!' });
  } catch (error) {
    console.log(error.message);
  }
}