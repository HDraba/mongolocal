const { Timestamp } = require('mongodb');
const { default: mongoose } = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true
  },
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
  },
});

UserSchema.methods.addToCart = function (product) {
  // if productindex < 0 = undefined that product is not in the cart yet
  const productIndexIfExisting = this.cart.items.findIndex((cartProduct) => {
    return cartProduct.productId.toString() === product._id.toString();
  });
  // console.log(this.cart.items);
  let newQuantity = 1;
  let updatedCartItems = [...this.cart.items];
  if (productIndexIfExisting >= 0) {
    // increment quantity and setting the old quantity to the new quantity
    newQuantity = this.cart.items[productIndexIfExisting].quantity + 1;
    updatedCartItems[productIndexIfExisting].quantity = newQuantity;
    // console.log('exists');
  } else {
    // adding new item to the cart
    updatedCartItems.push({
      productId: product._id,
      quantity: newQuantity,
    });
    // console.log('new');
  }
  const updatedCart = { items: updatedCartItems };
  this.cart = updatedCart;
  return this.save();
};

UserSchema.methods.removeFromCartById = function (productId) {
  const updatedItems = this.cart.items.filter((product) => {
    return product.productId.toString() !== productId.toString();
  });
  this.cart.items = updatedItems;
  return this.save();
};

UserSchema.methods.clearCart = function () {
  this.cart = { items: [] };
  return this.save();
};

module.exports = mongoose.model('User', UserSchema);
