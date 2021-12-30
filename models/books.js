const mogoose = require('mongoose')
const Schema = mogoose.Schema;
const ObjectId=Schema.ObjectId

function format_price(price){
  let formatter = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  })
  new_price = formatter.format(price);
 return new_price;
}

const Book = new Schema({
  masach:String,
  khuvuc:String,
  nhom:String,
  theloai:String,
  danhsach:String,  
  hinhanh:String,
  tensach:String,
  tacgia:String,
  nxb:String,
  namxb:Date,
  hinhthuc:String,
  mota:String,
  giaban:Number, 
  giamgia: Number,
  soluongton:String,
  ngonngu:String,
  giagoc:Number,
  danhgia: [
    {
      matk: String,
      noidung: String,
      sao: Number,
      ngaydg: {type: Date, default: Date.now,  transform: v => v.getDate() + "/" + v.getMonth() + "/" + v.getFullYear()}
    }
  ],
  danhgiatb: Number,
  tongdiem: Number,
  soluotdanhgia: { type: Number, default: 0},
  soluongdaban: {type: Number, default: 0}
  });

module.exports = mogoose.model('Book',Book)