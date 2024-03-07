const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

exports.SignIn = async (req, res) => {
  const auth = req.body.authResult
  await fetch("https://api.minepi.com/v2/me", {
    headers: new Headers({
      Authorization: "Bearer " + auth.accessToken,
    }),
  });
  let currentUser = await prisma.users.findFirst({where: {uid: auth.user.uid}})
  if (currentUser) {
      await prisma.users.update({
        where: {
          id: currentUser.id
        }
      }, {
        data: {
          accessToken: auth.accessToken
        }
      });
    } else {
      const insertResult = await prisma.users.create({
        username: auth.user.username,
        uid: auth.user.uid,
        accessToken: auth.accessToken
      });
      
      currentUser = await prisma.users.findUnique({where: {id: insertResult.id}});
    }

    req.session.currentUser = currentUser;

    return res.status(200).json({ message: "User signed in" });
}


exports.SignOut = async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Failed to sign out" });
    }
  });
  return res.status(200).json({ message: "User signed out" });
}