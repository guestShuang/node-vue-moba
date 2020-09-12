module.exports = app => {
	const express = require('express')
	const jwt = require('jsonwebtoken')
	const assert = require('http-assert')
	const AdminUser = require('../../models/AdminUser')
	const router = express.Router({
		mergeParams: true //具体路由使用客户端传递过来的参数
	})

	// 创建资源
	router.post('/', async (req, res) => {
		 const model =  await req.Model.create(req.body)
		 
		 res.send(model)
	})
	// 更新资源
	router.put('/:id', async (req, res) => {
		const model =  await req.Model.findByIdAndUpdate(req.params.id, req.body)
		res.send(model)
 })
 // 删除资源
 router.delete('/:id', async (req, res) => {
	await req.Model.findByIdAndDelete(req.params.id, req.body)
	res.send({
		success: true
	})
})
 // 资源列表
	router.get('/',  async (req, res) => {
		const queryOptions = {}
		if (req.Model.modelName === 'Category') {
			// queryOptions.populate = 'parent'
			const parents = await req.Model.find().where({
        parent: null
			}).lean()
			for (let i = 0; i < parents.length; i++) {

        parents[i].children = await req.Model.aggregate([
          { $match: { parent: parents[i]._id } },
          {
            $lookup: {
              from: 'Category',
              localField: '_id',
              foreignField: 'parent',
              as: 'children'
            }
          }
        ])

        const lenth = parents[i].children.length

        for (let j = 0; j < lenth; j++) {
          // console.log((parents[i].children)[j]);

          (parents[i].children)[j].children = await req.Model.aggregate([
            { $match: { parent: (parents[i].children)[j]._id } },
            {
              $lookup: {
                from: 'Category',
                localField: '_id',
                foreignField: 'parent',
                as: 'children'
              }
            }
          ])
        }

      }

      return res.send(parents)
		}
		if (req.Model.modelName === 'Hero' || req.Model.modelName === 'Article' || req.Model.modelName === 'Item') {
			console.log(req.Model.modelName)
			let perpage = Number(req.query.perpage);
			let page = req.query.page || 1;
			let cat = req.query.cat;
			let name = req.query.name;
			let start = (page - 1) * perpage;
			console.log(cat)
			if (cat) {
				queryOptions.all = [cat]
			}
			if (name && req.Model.modelName === 'Hero' || req.Model.modelName === 'Item') {
				var query = new RegExp(name)
				name = {'name':query}
			} else if (name && req.Model.modelName === 'Article') {
				var query = new RegExp(name)
				name = {'title':query}
			} else {
				name = {}
			}
			console.log(perpage)
			const items =  await req.Model.find(name).populate('categories').where('categories').setOptions(queryOptions).skip(start).limit(perpage)
			const counts = await req.Model.find(name).where('categories').setOptions(queryOptions).countDocuments()
			return	res.send({
				counts,
				items
			})
    }
		const items =  await req.Model.find().setOptions(queryOptions).limit(100)
		res.send(items)
	})
	// 资源详情
	router.get('/:id', async (req, res) => {
		const model =  await req.Model.findById(req.params.id)
		res.send(model)
	})
	// 登录校验中间件
  const authMiddleware = require('../../middleware/auth')
  const resourceMiddleware = require('../../middleware/resource')
	app.use('/admin/api/rest/:resource', authMiddleware(), resourceMiddleware(), router)
	
	//图片上传
	const multer = require('multer')
	const upload = multer({dest: __dirname + '/../../uploads'})
	app.post('/admin/api/upload', authMiddleware(), upload.single('file') ,async (req, res) => {
		const file = req.file
		file.url = `http://localhost:3000/uploads/${file.filename}`
		res.send(file)
	})
	
	// 登录验证
	app.post('/admin/api/login', async(req ,res) => {
		const { username, password } = req.body
		// 1.根据用户名找用户

		const user = await AdminUser.findOne({username}).select('+password')

		assert(user, 422, '用户不存在')
		// if (!user) {
		// 	return res.status(422).send({
		// 		message: '用户名不存在'
		// 	})
		// }

		// 2.校验密码
		const isValid = require('bcryptjs').compareSync(password, user.password)
		assert(isValid, 422, '密码错误')
		// if (!isValid) {
		// 	return res.status(422).send({
		// 		message: '密码错误'
		// 	})
		// }

		// 3.返回token
		const token = jwt.sign({ id: user._id}, app.get('secret'),{expiresIn: 60 * 60 })
		res.send({token,username})
	})


  // 错误处理函数
	app.use(async (err, req, res, next) => {
		res.status(err.statusCode || 500).send({
			message: err.message
		})
	})
}