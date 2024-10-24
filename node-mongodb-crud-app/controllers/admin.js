const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

exports.postAddProduct = (req, res, next) => {
  console.log('userId :', req.user);
  
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product(title, price, imageUrl, description, undefined, req.user._id);
  product.save()
    .then(result=> {
      console.log('inserted doc succesfully',result)
      return res.redirect('/admin/products') // dont use as res.redirect('admin/products') it will go to localhost:3000/admin/admin/products
    })
    .catch(err=> {
      throw new Error('error while inserting doc into collection')
    })

};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  // console.log('entered ...', editMode)
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;

  // req.user
  //   .getProducts({ where: { id: prodId } })
    Product.findById(prodId)
    .then(
      // products => {
      // const product = products[0];
      product =>{
        if (!product) {
          return res.redirect('/');
        }
        res.render('admin/edit-product', {
          pageTitle: 'Edit Product',
          path: '/admin/edit-product',
          editing: editMode,
          product: product
        });
      })
     .catch(err => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;

  const product = new Product(updatedTitle, updatedPrice, updatedImageUrl, updatedDesc, prodId, req.user._id)
  product.save().then(result => {
    this.getProducts(req, res, next)
    // console.log('this :', this) { getAddProduct: [Function (anonymous)], postAddProduct: [Function (anonymous)], getEditProduct: [Function (anonymous)], postEditProduct: [Function (anonymous)], getProducts: [Function (anonymous)], postDeleteProduct: [Function (anonymous)]}
  }).catch(err=> console.log(err))  
};

exports.getProducts = (req, res, next) => {
   Product.fetchAll()
    .then(products => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products'
      });
    })
    .catch(err => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  return Product.deleteById(prodId)
    .then(result => {
        console.log('deleted ',result)
        return res.redirect('/admin/products')
    })
    .catch(err => console.log('error in deleting the item ', err) 
     )
};
