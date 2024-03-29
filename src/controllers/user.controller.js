const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

exports.getAllUsers = async (req, res) => {
  try {
    const users = await prisma.users.findMany();
    if (users.length === 0) {
      return res.status(404).json({ message: 'No users found' });
    }
    res.status(200).json(users);
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Something went wrong', error: err.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.users.findUnique({ where: { id } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Something went wrong', error: err.message });
  }
};

exports.createUser = async (req, res) => {
  const auth = req.body.authResult;
  try {
    let currentUser = await prisma.users.findFirst({
      where: { uid: auth.user.uid },
    });
    if (currentUser) {
      await prisma.users.update(
        {
          where: {
            id: currentUser.id,
          },
        },
        {
          data: {
            accessToken: auth.accessToken,
          },
        }
      );
    } else {
      const fileName = 'default' + fullname + '.png';
      const filePath = `./public/default.png`;
      const output = `./public/users/${fileName}`;

      const img = fs.readFileSync(filePath);
      fs.writeFileSync(output, img);

      const url = `${req.protocol}://${req.get('host')}/users/${fileName}`;
      const insertResult = await prisma.users.create({
        username: auth.user.username,
        uid: auth.user.uid,
        img: fileName,
        imgUrl: url,
        accessToken: auth.accessToken,
      });

      currentUser = await prisma.users.findUnique({
        where: { id: insertResult.id },
      });
    }

    req.session.currentUser = currentUser;

    return res.status(200).json({ message: 'User signed in' });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Something went wrong', error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  const user = await prisma.users.findFirst({
    where: {
      id: req.params.id,
    },
  });

  if (!user) {
    return res.status(404).json({ msg: 'User not found.' });
  }
  let fileName = '';
  if (req.files === null) {
    fileName = user.img;
  } else {
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

    const filePath = `./public/users/${user.img}`;
    fs.unlinkSync(filePath);

    file.mv(`./public/users/${fileName}`, (err) => {
      if (err) return res.status(500).json({ msg: err.message });
    });
  }
  const url = `${req.protocol}://${req.get('host')}/users/${fileName}`;
  try {
    await prisma.users.update({
      where: {
        id: req.params.id,
      },
      data: {
        username: req.body.username,
        imgUrl: url,
        img: fileName,
        phone: req.body.phone,
        address: req.body.address,
      },
    });
    res.status(200).json({ msg: 'Users updated!' });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  const user = await prisma.users.findFirst({
    where: {
      id: req.params.id,
    },
  });
  if (!user) {
    return res.status(404).json({ msg: 'User not found.' });
  }
  try {
    await prisma.users.delete({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ msg: 'Users deleted!' });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
