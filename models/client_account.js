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


const client_account = new Schema({
    matk: String,
    hoten: String,
    email: {type: String, default: ""},
    matkhau: String,
    ngaytao: {type: Date, default: Date.now,  transform: v => v.getDate() + "/" + v.getMonth() + "/" + v.getFullYear()},
    diem: Number,
    tinhtrang: String,
    danhsach_km: [{
      phantram: Number,
      manhap: String,
      ngaykt: {type: Date,
        transform: v => v.getDate() + "/" + (v.getMonth()+1) + "/" + v.getFullYear()
      },
      makm: String,
      dieukien: Number,
      img: String,
    }],
    diachigh: {
      diachi: String,
    },
    diachigoc:{
      type: Array ,  default: ["","","",""]
    },
    gioitinh: String,
    sodt: String,
    giohang: [{
      masach: String,
      tensach: String,
      giaban: Number,
      hinhanh: String,
      soluong: Number,
      theloai: String,
    }],
    daxem: [{
      masach: String,
      tensach: String,
      giaban: Number,
      hinhanh: String,
      ngayxem: {type: Date, default: Date.now,  transform: v => v.getDate() + "/" + v.getMonth() + "/" + v.getFullYear()},
    }],
    sl_giohang: Number,
    diachi: {type: String, default: ""}
  });
  
module.exports = mogoose.model('client_accounts',client_account)