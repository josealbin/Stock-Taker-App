const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bcrypt = require('bcrypt')
const productModel = require('./models/products')
const customerModel = require('./models/customers')
const userModel = require('./models/users')

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/stocklist')




//---------------------------------------------------//
//---------------------Products---------------------//
//-------------------------------------------------//

app.get('/getProducts', (req, res) => {
    productModel.find({})
        .then(products => res.json(products))
        .catch(err => res.json(err))
})

// Add new Product record into database
app.post('/addProduct', (req, res) => {
    const newProduct = req.body
    productModel.create(newProduct)
        .then(products => res.json(products))
        .catch(err => res.json(err))
})

// Get the Product by ID and Edit the product record
app.get('/getProduct/:id', (req, res) => {
    const id = req.params.id
    productModel.findById({ _id: id })
        .then(product => res.json(product))
        .catch(err => res.json(err))
})
app.put('/updateProduct/:id', (req, res) => {
    const id = req.params.id
    const updatedData = req.body;
    productModel.findByIdAndUpdate({ _id: id }, updatedData)
        .then(product => res.json(product))
        .catch(err => res.json(err))
})

// Delete the Product
app.delete('/deleteProduct/:id', (req, res) => {
    const id = req.params.id
    productModel.findByIdAndDelete(id)
        .then(products => res.json(products))
        .catch(err => res.json)
})


//---------------------------------------------------//
//---------------------Customers--------------------//
//-------------------------------------------------//

app.get('/getCustomers', (req, res) => {
    customerModel.find({})
        .then(customers => res.json(customers))
        .catch(err => res.json(err))
})

// Add new Customer record into database
app.post('/addCustomer', (req, res) => {
    const newCustomer = req.body
    customerModel.create(newCustomer)
        .then(customers => res.json(customers))
        .catch(err => res.json(err))
})

// Get the Customer by ID and Edit the Customer record
app.get('/getCustomer/:id', (req, res) => {
    const id = req.params.id
    customerModel.findById({ _id: id })
        .then(customer => res.json(customer))
        .catch(err => res.json(err))
})
app.put('/updateCustomer/:id', (req, res) => {
    const id = req.params.id
    const updatedData = req.body;
    customerModel.findByIdAndUpdate({ _id: id }, updatedData)
        .then(customer => res.json(customer))
        .catch(err => res.json(err))
})

// Delete the Customer
app.delete('/deleteCustomer/:id', (req, res) => {
    const id = req.params.id
    customerModel.findByIdAndDelete(id)
        .then(customer => res.json(customer))
        .catch(err => res.json)
})



//---------------------------------------------------//
//---------------------File Upload--------------------//
//-------------------------------------------------//


app.post('/updateData', async (req, res) => {
    try {
        const { updatedTableData } = req.body;
        const bulkOps = updatedTableData.map(product => ({
            updateOne: {
                filter: { id: product.id },
                update: {
                    $set: {
                        order: product.order,
                        difference: product.stock - product.order
                    }
                }
            }
        }));

        await productModel.bulkWrite(bulkOps);
        //const updatedProducts = await productModel.find({});
        res.status(200).json({ message: 'Products updated successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});



//---------------------------------------------------//
//---------------------Users--------------------//
//-------------------------------------------------//

app.get('/getUsers', (req, res) => {
    userModel.find({})
        .then(users => res.json(users))
        .catch(err => res.json(err))
})

app.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;
    const user = await userModel.findOne({ email })
    if (user) {
        return res.json({ message: "User already existed" })
    }

    const hashpassword = await bcrypt.hash(password, 10)
    const newUser = new userModel({ username, email, password: hashpassword })
    await newUser.save()
    return res.json({ status: true, message: "User Added" })
})

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email })
    if (!user) {
        return res.json({ message: "User is not registered" })
    }
    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) {
        return res.json({ message: "Incorrect Password" })
    }
    return res.json({ status: true, message: "Logged In" })
})

app.listen(3001, () => {
    console.log('Server Started');
})