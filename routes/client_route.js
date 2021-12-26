const express = require('express')
const route = express.Router()

const client_Control = require('../controllers/client_control')


route.get('/capnhatmatkhau', client_Control.capnhatmatkhau)
route.get('/xoasanpham/:username/:tensach', client_Control.xoasanpham)
route.get('/nhapkhuyenmai', client_Control.nhapkhuyenmai)
route.get('/themgiohang', client_Control.themgiohang)
route.get('/chitietgiohang/:username', client_Control.chitietgiohang)
route.get('/chitiettk', client_Control.chitiettk)
route.get('/luukhuyenmai', client_Control.luukhuyenmai)
route.get('/chitietsach/:tensach', client_Control.chitietsach)
route.post('/signup', client_Control.signup)
route.get('/khuyenmai', client_Control.dskhuyenmai)
route.get('/boloc',client_Control.searchBL)
route.get('/search/:name', client_Control.search)
route.get('/theloai/:value', client_Control.searchTL)
route.get('/logout', client_Control.logout)
route.get('/payment', client_Control.thanhtoan)
route.get('/danhsachdonhang/:matk/:tinhtrang', client_Control.listdonhang)
route.get('/danhsachvoucher/:username', client_Control.listvoucher)
route.get('/chitietdonhang/:matk/:madh', client_Control.chitietdonhang)
route.get('/danhsachvoucher_all', client_Control.listvoucher_all)
route.post('/updatethongtintk', client_Control.updatethongtin)
route.get('/', client_Control.main)
route.get('/chitiettk_voucher', client_Control.laybovoucher)

route.post('/taodonhang', client_Control.TaoDonHang)



route.get('/',client_Control.get_client)
route.post('/',client_Control.post_client)

module.exports = route