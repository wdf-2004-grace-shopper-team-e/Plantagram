const router = require('express').Router()
const {User, Order} = require('../db/models')
module.exports = router

router.get('/', async (req, res, next) => {
  try {
    if (req.user.isAdmin) {
      const users = await User.findAll({
        // explicitly select only the id and email fields - even though
        // users' passwords are encrypted, it won't help if we just
        // send everything to anyone who asks!
        attributes: ['id', 'email', 'firstName', 'lastName', 'cartId', 'imgUrl']
      })
      res.json(users)
    } else {
      const err = new Error('You do not have Administrator access!')
      err.status = 401
      return next(err)
    }
  } catch (err) {
    next(err)
  }
})

router.put('/', async (req, res, next) => {
  const userId = req.body.id
  try {
    await User.update(req.body, {
      where: {
        id: userId
      }
    })
    res.sendStatus(204)
  } catch (err) {
    next(err)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const user = await User.findOne({
      attributes: ['id', 'email', 'firstName', 'lastName', 'cartId'],
      where: {
        id: req.params.id
      }
    })
    res.json(user)
  } catch (err) {
    next(err)
  }
})
