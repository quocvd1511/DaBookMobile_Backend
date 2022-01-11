const mogoose = require('mongoose');
const Schema = mogoose.Schema;

function format_price(price){
  let formatter = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  })
  new_price = formatter.format(price);
 return new_price;
}

const donhang = new Schema({
    madh: String,
    ngaylap: {type: Date, 
      default: Date.now, transform: v => v.getDate() + "/" + (v.getMonth()+1) + "/" + v.getFullYear()},
    matk: String,
    hinhthucthanhtoan: String,
    vanchuyen: String,
    makm: String,
    tongtien: Number,
    tiengiam: Number,
    thongtinnguoinhan: String,
    tinhtrangthanhtoan: String,
    tinhtrangdonhang: String,
    ds_sach: Array,
    tienship: Number,
  });
  
module.exports = mogoose.model('donhangs',donhang)