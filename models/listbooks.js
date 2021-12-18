const mogoose = require('mongoose')
const Schema = mogoose.Schema;
const ObjectId=Schema.ObjectId

const Listbook = new Schema({
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
  giamgia:Number,
  sodanhgia:String,
  sobinhchon:String,
  soluongton:String,
  ngonngu:String,
  giagoc:String,
  });

module.exports = mogoose.model('Listbook',Listbook)