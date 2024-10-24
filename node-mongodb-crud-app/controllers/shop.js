const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then(products => {
      res.render('shop/product-list' // view template , here we have not imported views folder but it is automatically detected
      ,{
        prods: products,
        pageTitle: 'All Products',
        path: '/products' // seen in url link
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getProduct = (req, res, next) => {
  console.log('get product:',req.params);
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      console.log('product triggered', product)
      res.render('shop/product-detail', {
        // product: product[0],
        product: product,
        // pageTitle: product[0].title,
        pageTitle: product.title,
        path: `/products`
      });
    })
    .catch(err => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll()
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/'
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getCart = (req, res, next) => {
  req.user
    .getCart().then(products=> {
      console.log(products)
        res.render('shop/cart', {
          path:'/cart',
          pageTitle: 'Your cart',
          products: products
        })
      }).catch(err=> {
        console.log('error in shop get cart controller', err)
      })
    // .then(cart => {
    //   return cart
    //     .getProducts()
    //     .then(products => {
    //       res.render('shop/cart', {
    //         path: '/cart',
    //         pageTitle: 'Your Cart',
    //         products: products
    //       });
    //     })
    //     .catch(err => console.log(err));
    // })
    // .catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  console.log('user :', req.user)
  req.user.addToCart({prodId, quantity: 1}).then((result)=> {
    console.log('successfully added to the cart')
    return res.redirect('/cart')
  }).catch(err=> console.log('error in shop postcart controller'))
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const user = req.user;
  user.deleteCartItem(prodId)
  .then(user=> res.redirect('/cart'))
  .catch(err=> console.log('error in delete cart item controller :', err))
  // req.user
  //   .getCart()
  //   .then(cart => {
  //     return cart.getProducts({ where: { id: prodId } });
  //   })
  //   .then(products => {
  //     const product = products[0];
  //     return product.cartItem.destroy();
  //   })
  //   .then(result => {
  //     res.redirect('/cart');
  //   })
  //   .catch(err => console.log(err));
};

exports.postOrder = (req, res, next) => {
  const user = req.user;
  user.addOrder().then(result=> {
    return res.redirect('/orders')
   }).catch(err=> {
    console.log('error in post order controller :', err);
   })
  // let fetchedCart;
  // req.user
  //   .getCart()
  //   .then(cart => {
  //     fetchedCart = cart;
  //     return cart.getProducts();
  //   })
  //   .then(products => {
  //     return req.user
  //       .createOrder()
  //       .then(order => {
  //         return order.addProducts(
  //           products.map(product => {
  //             product.orderItem = { quantity: product.cartItem.quantity };
  //             return product;
  //           })
  //         );
  //       })
  //       .catch(err => console.log(err));
  //   })
  //   .then(result => {
  //     return fetchedCart.setProducts(null);
  //   })
  //   .then(result => {
  //     res.redirect('/orders');
  //   })
  //   .catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {
  const user = req.user;
  user.getOrders()
    .then(orders => {
      console.log('orders :', orders)
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: orders
      });
    })
    .catch(err => console.log(err));
};
