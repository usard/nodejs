const Order = require('../models/orders');
const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
  Product.find()
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
  // Product.findOne({_id: prodId}) // both works
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
  Product.find()
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
    .populate('cart.items.productId')
    .then(user=> {
      const products = user.cart.items
      // console.log('products :', products)
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
  // console.log('user :', req.user)
  req.user.addToCart({prodId, quantity: 1})
  .then((result)=> {
    console.log('successfully added to the cart')
    return res.redirect('/cart')
  })
  .catch(err=> console.log('error in shop postcart controller'))
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const user = req.user;
  const updatedCart = [...user.cart.items]?.filter(cp=> {
  //  console.log(cp.productId, prodId);
   return  cp.productId.toString() !==  prodId.toString()
  })
  // console.log('updated cart :', updatedCart)
  user.cart.items = updatedCart;
  user.save()
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
  user
  .populate('cart.items.productId').then(
    user=> {
      const products = user.cart.items.map(ci=> {
        return {quantity: ci.quantity, product: {...ci.productId._doc }} // _doc will remove all other inbuilt all unwanted menthods present on the product object and now it only contains data, by not keeping _doc while inserting there will be overload on the database
      })
      console.log('items in order :', products)
      const orderData = {
        user: {
          username: user.username,
          email: user.email,
          userId: user._id
        },
        // products:[
        //   ...user.cart.items
        // ] // [object] [object] error
        products: products
      }
      const order = new Order(orderData);
      return order.save()
    }
  ).then(result => {
    user.cart.items = [];
    return user.save()
  }).then(
    result => {
      return res.redirect('/orders')
    }
  )
  
  ;
  // const orderData  ={
  //   user: {
  //     username: user.username,
  //     email: user.email,
  //     userId: user._id
  //   },
  //   products:[
  //     ...user.cart.items
  //   ]
  // }

  // const order = new Order(orderData)
  // order.save()
  // .then(order=> {
  //   console.log('order saved successfully')
  //   user.cart.items=[]
  //   return user.save()
  // })
  // .then(result=> console.log('user cart emptied'))
  // .catch(err=> console.log(err))



  // user.addOrder()
  // .then( result=> {
  //   return res.redirect('/orders')
  // })
  // .catch(err=> {
  //   console.log('error in post order controller :', err);
  // })
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
  const orders = Order.find({'user.userId' : user._id})
  orders
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
