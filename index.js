'use strict'
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const app = express()
const port = process.env.PORT || 3000
const Product = require('./models/product.js')

app.use(bodyParser.urlencoded({ extended: false}))
app.use(bodyParser.json())

app.get('/api/product', (req, res) =>{

	Product.find({}, (err,product)=>{
		if (err) return res.status(500).send({message: 'Error al realizar la peticion'})
		if (!product) return res.status(404).send({message: 'El producto no existe'})
		res.status(200).send({ product})
	})
	
})

app.get('/api/product/:productId', (req, res) => {
	let productId = req.params.productId

	Product.findById(productId, (err, product) => {
	if (err) return res.status(500).send({message: 'Error al realizar la peticion'})
	if (!product) return res.status(404).send({message: 'El producto no existe'})

		res.status(200).send({product})
	})
})

app.post('/api/product', (req, res) => {

	console.log(`POST /api/product `)
	console.log(req.body)

	let product = new Product()
	product.name = req.body.name
	product.picture = req.body.picture
	product.price = req.body.price
	product.category = req.body.category
	product.description = req.body.description

	product.save((err, productStored) =>{

		if (err) res.status(500).send({message: 'error el guardar el dato'})
		res.status(200).send({message: productStored})
	})
})

app.put('/api/product/:productId', (req, res) => {
	let productId = req.params.productId
	let update = req.body

	Product.findByIdAndUpdate(productId, update, (err, productUpdated) =>{
		if (err) res.status(500).send({message: `Error al actualizar el producto ${err}`})

		res.status(200).send({product: productUpdated})
	})
})

app.delete('/api/product/:productId', (req, res) => {
	let productId = req.params.productId

	Product.findById(productId, (err, product)=>{
		if (err) res.status(500).send({message: `Error al borrar el producto ${err}`})

		product.remove(err => {
			if (err) res.status(500).send({message: `Error al borrar el producto ${err}`})
			res.status(200).send({message: `Se ha eliminado el producto`})
		})

	})
})

mongoose.connect('mongodb://localhost:27017/shop', (err, res) => {
	if (err) {
		return console.log('error al conectar a la bd')
	}

	console.log('conexion establecida')

	app.listen(port, () => {
	console.log(`API REST corriendo en http://localhost:${port}`)
	})

})




