const client_login = require('../models/client_account')
const books=require('../models/books')
const {multipleMongooseToObject} = require('../util/mongoose.js')
const {mongooseToObject} = require('../util/mongoose.js')
const client_account = require('../models/client_account')
const khuyenmai = require('../models/khuyenmai')
const giohang = require('../models/giohang')
const donhang = require('../models/donhang')


class Client_Control
{
    main(req,res,next)

        {
    
            if(req.session.isAuth) {
    
                books.find({'giamgia': {$gte: 22}},
    
                function (err,flash_sales){
    
                    if(!err)
    
                    {
    
                        flash_sales=flash_sales.map(course => course.toObject())
    
                       books.find({}).limit(50).skip(50*1)
    
                        .then(books => 
    
                            {
    
                                books=books.map(course => course.toObject())
    
                                res.send(200, {flash_sales, books});     
    
                            })
    
                        .catch(next)
    
                    } else {
    
                        next(err)
    
                    }
    
                })   
    
            }else{
    
                books.find({'giamgia': {$gte: 22}},
    
                function (err,flash_sales){
    
                    if(!err)
    
                    {
    
                        flash_sales=flash_sales.map(course => course.toObject())
    
                        books.find({}).limit(50).skip(50*1)
    
                        .then(books => 
    
                            {
    
                                books=books.map(course => course.toObject())
    
                                res.send(200, {books, flash_sales})    
    
                            })
    
                        .catch(next)            
    
                    } else {
                     res.locals.error = err;
                     const err = new Error('Not Found');
                     err.status = 404;
                        next(err)
    
                    }
    
                })
    
            }
    
        }

      
    // POST signup
    signup(req, res, next){
        console.log(req.body)
        client_account.findOne({matk: req.body.username})
            .then(client_accounts =>
                {
                console.log(client_accounts)
                if(Boolean(client_accounts) === true)
                {
                    res.send({status: 'Existed'})
                }
                else
                {
                    console.log('Lưu thoi')
                    var formData ={
                        matk: req.body.username,
                        sodt: req.body.phonenumber,
                        hoten: req.body.name,
                        matkhau: req.body.password,
                        //email: 'Chưa cập nhật',
                        tinhtrang: "Đang sử dụng",
                        diem: 0,
                        danhsach_km:[],
                        //diachigoc: 'Chưa cập nhật',
                        gioitinh: 'Chưa cập nhật',
                        giohang: [],
                        }
                    const Client_account = new client_account(formData);
                    Client_account.save(formData)
                    .then(() => res.send({status: 'Success', user_session: {username: req.body.username}}))
                    .catch(error => {});
                }
            })
        

        // const Client_account = new client_account(formData);
        // Client_account.save()
        //     .then(() => res.redirect('/'))
        //     .catch(error => {});
        
    }

    // Logout account
    logout(req,res,next)
    {
        req.session.destroy()
        res.redirect('/')
    }

    // Login account
    post_client(req,res,next)
    {
        client_login.findOne({$or: [{matk: req.body.username},{email: req.body.username}], matkhau: req.body.password}, 
            function (err,client_account){
                if(!err)
                {
                    if(Boolean(client_account)==false) {
                        res.send({status: 'Failed'})
                    }
                    else 
                    {    
                        req.session.username=client_account.matk;
                        req.session.isAuth=true;
                        res.send({status: 'Success', user_session: req.session})            
                    }
                } else {
                    next(err)
                }
            })
    }

    // Login with facebook
    auth_facebook_callback(req,res)
    {
        console.log(req.session.passport);
        req.session.username=req.session.passport.user.id
        req.session.isAuth=true
        client_account.findOne({matk: req.session.username}, 
            function (err, Client_account)
            {
                if(Boolean(Client_account)==false)
                {
                    const new_client=
                    {
                        // matk: req.session.username,
                        // email: "none",
                        // diem: 0,
                        // tinhtrang: "Đang sử dụng",
                        // sodt: "none",
                        matk: req.session.username,
                        email: "",
                        matkhau: "",
                        diem: 0,
                        tinhtrang: "Đang sử dụng",
                        diachigoc: "",
                        gioitinh: "",
                        sodt: "",
                        sl_giohang: 0,
                    }

                    const Client_account = new client_account(new_client);
                    Client_account.save()
                    .then(() => res.redirect('/'))
                    .catch(error => {});
                }
            })
        res.redirect('/')
    }

    get_client(req,res,next)
    {
        res.redirect('/')
    }

    // Tìm kiếm theo tên sách, tác giả
    search(req,res,next)
    {   
         // lấy giá trị của key name trong query parameters gửi lên
         console.log(req.params.name);
            books.find({ $or :[
                { 'tensach' : {'$regex' : req.params.name , '$options' : 'i'}},
                    { 'tacgia' :  {'$regex' : req.params.name , '$options' : 'i'}}
            ]})
            .then(books => 
                {
                    books=books.map(course => course.toObject())
                    console.log(books);
                    res.send({books});
                })
            .catch(next)
    }

    // Tìm kiếm theo danh sách các thể loại
    searchTL(req,res,next)
    {   
        console.log(req.params.value)
            if(req.session.isAuth) {
                client_login.findOne({'matk': req.session.username}).then((thongtintk => {
                    thongtintk=mongooseToObject(thongtintk);
                    books.find(
                        {'theloai':{'$regex' : req.params.value , '$options' : 'i'}}
                    )
                    .then(books => 
                        {
                            books=books.map(course => course.toObject())
                            res.send(200, {books,thongtintk});
                        })
                    .catch(next)}))     
             }else{
                books.find(
                    {'theloai':{'$regex' : req.params.value , '$options' : 'i'}}
                )
                .then(books => 
                    {

                        books=books.map(course => course.toObject())
                        console.log(books)
                        res.status(200).send({books});
                    })
                .catch(next)
             }
    }
    
    // Tìm kiếm theo bộ lọc
    searchBL(req,res,next)
    {
        if(req.query.giaban && req.query.nxb && req.query.ngonngu){
            if(req.query.giaban === "50000") {
             books.find({$and :[
                 { giaban : {
                     $lt: 50
                 }},
                { nxb :  { $in: req.query.nxb}},
                { ngonngu :  { $in: req.query.ngonngu}}
                 ]}).limit(30).skip(30*1)
              .then(books => 
             {
                 books=books.map(course => course.toObject())
                 res.render('search_client.handlebars',{layout:'client.handlebars',books: books, CurrentPage: 1});
             }).limit(30).skip(30*1)
             .catch(next)
             } else if(req.query.giaban === "100000") {
                     books.find({$and :[
                          { giaban : {
                              $gte:"50",
                              $lt: "100"
                          }},
                         { nxb :  { $in: req.query.nxb}},
                         { ngonngu :  { $in: req.query.ngonngu}}
                     ]}).limit(30).skip(30*1)
             .then(books => 
             {
                 books=books.map(course => course.toObject())
                 res.render('search_client.handlebars',{layout:'client.handlebars',books: books, CurrentPage: 1});
             }).limit(30).skip(30*1)
                 .catch(next)
             } else if (req.query.giaban === "150000") {
                 books.find({$and :[
                  { giaban : {
                      $gte:"100",
                      $lt: "150"
                  }},
                   { nxb :  { $in: req.query.nxb}},
                   { ngonngu :  { $in: req.query.ngonngu}}
              ]}).limit(30).skip(30*1)
                 .then(books => 
                  {
                         books=books.map(course => course.toObject())
                         res.render('search_client.handlebars',{layout:'client.handlebars',books: books, CurrentPage: 1});
                     })
                 .catch(next)
             } else if (req.query.giaban === "200000") {
                 books.find({$and :[
                 { giaban : {
                      $gte:"150",
                      $lt: "200"
                  }},
             { nxb :  { $in: req.query.nxb}},
             { ngonngu :  { $in: req.query.ngonngu}}
              ]}).limit(30).skip(30*1)
              .then(books => 
                  {
                      books=books.map(course => course.toObject())
                      res.render('search_client.handlebars',{layout:'client.handlebars',books: books, CurrentPage: 1});
                   })
                 .catch(next)
             } else {
                 books.find({$and :[
                  { giaban : {
                        $gte: "200"
                      }},
                      { nxb :  { $in: req.query.nxb}},
                      { ngonngu :  { $in: req.query.ngonngu}}
                  ]}).limit(30).skip(30*1)
                  .then(books => 
                     {
                        books=books.map(course => course.toObject())
                        res.render('search_client.handlebars',{layout:'client.handlebars',books: books, CurrentPage: 1});
                      })
                 .catch(next)
                 }
        } else if(!req.query.giaban && req.query.nxb && req.query.ngonngu){
            books.find({$and :[
                    { nxb :  { $in: req.query.nxb}},
                    { ngonngu :  { $in: req.query.ngonngu}}
                ]}).limit(30).skip(30*1)
                .then(books => 
                   {
                      books=books.map(course => course.toObject())
                      res.render('search_client.handlebars',{layout:'client.handlebars',books: books, CurrentPage: 1});
                    })
               .catch(next)
            }
            else if(!req.query.giaban && !req.query.nxb && req.query.ngonngu){
                books.find(
                        { ngonngu :  { $in: req.query.ngonngu}}
                    ).limit(30).skip(30*1)
                    .then(books => 
                       {
                          books=books.map(course => course.toObject())
                          res.render('search_client.handlebars',{layout:'client.handlebars',books: books, CurrentPage: 1});
                        })
                   .catch(next)
                }
                else if(!req.query.giaban && req.query.nxb && !req.query.ngonngu){
                    books.find(
                            { nxb :  { $in: req.query.nxb}}
                        ).limit(30).skip(30*1)
                        .then(books => 
                           {
                              books=books.map(course => course.toObject())
                              res.render('search_client.handlebars',{layout:'client.handlebars',books: books, CurrentPage: 1});
                            })
                       .catch(next)
                    }
                else if(req.query.giaban && req.query.nxb && !req.query.ngonngu){
                    if(req.query.giaban === "50000") {
                        books.find({$and :[
                            { giaban : {
                                $lt: "50"
                            }},
                            { nxb :  { $in: req.query.nxb}},
                            ]}).limit(30).skip(30*1)
                            .then(books => 
                        {
                            books=books.map(course => course.toObject())
                            res.render('search_client.handlebars',{layout:'client.handlebars',books: books, CurrentPage: 1});
                        })
                        .catch(next)
                } else if(req.query.giaban === "100000") {
                        books.find({$and :[
                                { giaban : {
                                    $gte:"50",
                                    $lt: "100"
                                }},
                            { nxb :  { $in: req.query.nxb}}
                        ]}).limit(30).skip(30*1)
                .then(books => 
                {
                    books=books.map(course => course.toObject())
                    res.render('search_client.handlebars',{layout:'client.handlebars',books: books, CurrentPage: 1});
                })
                    .catch(next)
                } else if (req.query.giaban === "150000") {
                    books.find({$and :[
                        { giaban : {
                            $gte:"100",
                            $lt: "150"
                        }},
                        { nxb :  { $in: req.query.nxb}}
                    ]}).limit(30).skip(30*1)
                    .then(books => 
                        {
                            books=books.map(course => course.toObject())
                            res.render('search_client.handlebars',{layout:'client.handlebars',books: books, CurrentPage: 1});
                        })
                    .catch(next)
                } else if (req.query.giaban === "200000") {
                    books.find({$and :[
                    { giaban : {
                            $gte:"150",
                            $lt: "200"
                        }},
                { nxb :  { $in: req.query.nxb}}
                    ]}).limit(30).skip(30*1)
                    .then(books => 
                        {
                            books=books.map(course => course.toObject())
                            res.render('search_client.handlebars',{layout:'client.handlebars',books: books, CurrentPage: 1});
                        })
                    .catch(next)
                } else {
                    books.find({$and :[
                        { giaban : {
                            $gte: "200"
                            }},
                            { nxb :  { $in: req.query.nxb}}
                        ]}).limit(30).skip(30*1)
                        .then(books => 
                        {
                            books=books.map(course => course.toObject())
                            res.render('search_client.handlebars',{layout:'client.handlebars',books: books, CurrentPage: 1});
                            })
                    .catch(next)
                    }
            }
            else if(req.query.giaban && !req.query.nxb && req.query.ngonngu){
                if(req.query.giaban === "50000") {
                    books.find({$and :[
                        { giaban : {
                            $lt: "50"
                        }},
                        { ngonngu :  { $in: req.query.ngonngu}}
                        ]}).limit(30).skip(30*1)
                        .then(books => 
                    {
                        books=books.map(course => course.toObject())
                        res.render('search_client.handlebars',{layout:'client.handlebars',books: books, CurrentPage: 1});
                    })
                    .catch(next)
                    } else if(req.query.giaban === "100000") {
                            books.find({$and :[
                                    { giaban : {
                                        $gte:"50",
                                        $lt: "100"
                                    }},
                                { ngonngu :  { $in: req.query.ngonngu}}
                            ]}).limit(30).skip(30*1)
                    .then(books => 
                    {
                        books=books.map(course => course.toObject())
                        res.render('search_client.handlebars',{layout:'client.handlebars',books: books, CurrentPage: 1});
                    })
                        .catch(next)
                    } else if (req.query.giaban === "150000") {
                        books.find({$and :[
                            { giaban : {
                                $gte:"100",
                                $lt: "150"
                            }},
                            { ngonngu :  { $in: req.query.ngonngu}}
                        ]}).limit(30).skip(30*1)
                        .then(books => 
                            {
                                books=books.map(course => course.toObject())
                                res.render('search_client.handlebars',{layout:'client.handlebars',books: books, CurrentPage: 1});
                            })
                        .catch(next)
                    } else if (req.query.giaban === "200000") {
                        books.find({$and :[
                        { giaban : {
                                $gte:"150",
                                $lt: "200"
                            }},
                    { ngonngu :  { $in: req.query.ngonngu}}
                        ]}).limit(30).skip(30*1)
                        .then(books => 
                            {
                                books=books.map(course => course.toObject())
                                res.render('search_client.handlebars',{layout:'client.handlebars',books: books, CurrentPage: 1});
                            })
                        .catch(next)
                    } else {
                        books.find({$and :[
                            { giaban : {
                                $gte: "200"
                                }},
                                { ngonngu :  { $in: req.query.ngonngu}}
                            ]}).limit(30).skip(30*1)
                            .then(books => 
                            {
                                books=books.map(course => course.toObject())
                                res.render('search_client.handlebars',{layout:'client.handlebars',books: books, CurrentPage: 1});
                                })
                        .catch(next)
                        }
            }
            else if(req.query.giaban && !req.query.nxb && !req.query.ngonngu){
                if(req.query.giaban === "50000") {
                    books.find({giaban : {
                        $lt: 50
                    }}    
                ).limit(30).skip(30*1)
                    .then(books => 
                    {
                            books=books.map(course => course.toObject())
                            res.render('search_client.handlebars',{layout:'client.handlebars',books: books, CurrentPage: 1});
                        })
                    .catch(next)
                    } else if(req.query.giaban === "100000") {
                        books.find({giaban : {
                            $gte: 50,
                            $lt: 100
                        }}    
                    ).limit(30).skip(30*1)
                        .then(books => 
                        {
                                books=books.map(course => course.toObject())
                                res.render('search_client.handlebars',{layout:'client.handlebars',books: books, CurrentPage: 1});
                            })
                        .catch(next)
                    } else if (req.query.giaban === "150000") {
                        books.find({giaban : {
                                $gte:"100",
                                $lt: "150"
                            }}    
                        ).limit(30).skip(30*1)
                        .then(books => 
                            {
                                books=books.map(course => course.toObject())
                                res.render('search_client.handlebars',{layout:'client.handlebars',books: books, CurrentPage: 1});
                            })
                        .catch(next)
                    } else if (req.query.giaban === "200000") {
                        books.find({ giaban : {
                                $gte:"150",
                                $lt: "200"
                            }
                    }).limit(30).skip(30*1)
                        .then(books => 
                            {
                                books=books.map(course => course.toObject())
                                res.render('search_client.handlebars',{layout:'client.handlebars',books: books, CurrentPage: 1});
                            })
                        .catch(next)
                    } else {
                        books.find({ giaban : {
                                $gte: "200"
                                }
                            }).limit(30).skip(30*1)
                            .then(books => 
                            {
                                books=books.map(course => course.toObject())
                                res.render('search_client.handlebars',{layout:'client.handlebars',books: books, CurrentPage: 1});
                                })
                        .catch(next)
                        }
            }
    }

    // Khuyến mãi
    dskhuyenmai(req,res,next)
    {
        if(req.session.isAuth) {
            client_login.findOne({'matk': req.session.username}).then((thongtintk => {
                thongtintk=mongooseToObject(thongtintk);
                khuyenmai.find({})
        .then(khuyenmai => 
            {
                khuyenmai=khuyenmai.map(course => course.toObject())
                res.render('khuyenmai_client.handlebars',{layout:'client.handlebars',khuyenmai: khuyenmai, client_accounts: thongtintk});
            })
        .catch(next)}))     
         }else{
            khuyenmai.find({})
        .then(khuyenmai => 
            {
                khuyenmai=khuyenmai.map(course => course.toObject())
                res.render('khuyenmai_client.handlebars',{layout:'client.handlebars',khuyenmai: khuyenmai});
            })
        .catch(next)
         }
    }

    // Chi tiết sách
    chitietsach(req,res,next)
    {
        const query = books.findOne({ 'tensach': req.params.tensach });
        query.exec(function (err, book) {
            if(!err)
                {
                    if(Boolean(book)==false) {
                        res.redirect('/')
                    }
                    else 
                    {    
                    book = mongooseToObject(book);
                    let date = new Date(book.namxb);
                    let dateString;
                   
                    // chuyển về đúng định dạng ngày tháng năm
                    if(date.getDate() != 0 && date.getMonth() != 0 &&date.getFullYear() != 0){
                        dateString = date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear()
                    } else if(date.getDate() === 0) {
                        dateString =  date.getMonth() + "-" + date.getFullYear()
                    }else if(date.getMonth() === 0){
                        dateString =  date.getFullYear()
                    } else dateString = "2021"
                    
                    if(req.session.isAuth) {
                        client_login.findOne({'matk': req.session.username}).then((thongtintk => {
                            thongtintk=mongooseToObject(thongtintk);
                            books.find({theloai: book.theloai}).limit(10).skip(10*1)
                    .then(list_book => 
                    {
                        list_book=list_book.map(course => course.toObject())
                        res.send(200, {book, list_book});
                    })
                    .catch(next)
                   }))     
                     }else{
                        books.find({theloai: book.theloai}).limit(10).skip(10*1)
                    .then(list_book => 
                    {
                        list_book=list_book.map(course => course.toObject())
                        res.send(200, {book, list_book});
                    })
                    .catch(next)   
                     }          
                    }
                } else {
                    res.locals.error = err;
                    const err = new Error('Not Found');
                    err.status = 404;
                    next(err)
                }
            })
    }
    //phân trang cũ
    get_pagination(req, res, next){
    var perPage = 30; // số lượng sản phẩm xuất hiện trên 1 page
    var page2, page3, page4;
    let page = Number(req.params.page);
    var number = req.params.number;
    
    if(number == 2){
        page2 = page + 1;
        page3 = page + 2;
        page4 = page + 3;
    }else if(number == 3){
        page3 = page;
        page2 = page - 1;
        page4 = page + 1;
    }else if(number == 4){
        page3 = page -1;
        page2 = page - 2;
        page4 = page;
    }else if(page == 28){
        page4 = page;
        page2 = page - 2;
        page3 = page - 1;
    }
    if(number == 6){
        page2 = page - 1;
        page3 = page;
        page4 = page + 1;
    }
    if(number == -6){
        page2 = page - 2;
        page3 = page - 1;
        page4 = page;
    }
    
    books.find({'giamgia': {$gte: 22}},
    function (err,flash_sales){
        if(!err)
        {
            flash_sales=flash_sales.map(course => course.toObject());
           
                    books.find({}).limit(perPage).skip((perPage * page) - perPage)
                    .then(books => 
                        {
                            books=books.map(course => course.toObject())
                            res.render('home_client.handlebars',{layout:'client.handlebars', flash_sales: flash_sales, books: books, CurrentPage: req.params.page, CountPage: 28, Number2:page2, Number3: page3, Number4: page4});     
                        })
                    .catch(next) 
           
                
        } else {
            next(err)
        }
    })   
    }

    //lưu khuyến mãi
    luukhuyenmai(req,res,next){
        // client_login.updateOne({"matk": req.query.username}, 
        //     { $push: { "danhsach_km": req.query.makm }
        // })
        // .then(() => 
        // {
        //     khuyenmai.updateOne({"makm": req.params.value},
        //     { $inc: {"sl": -1, "daluu": + 1}}).then(()=>{
        //         res.send(200, 'OK');
        //     })    
        // })

        console.log(req.query.username, req.query.manhap, req.query.ngaykt)
        //req.body = JSON.parse(req.body)
       //console.log(req.body)
       client_account.findOne({'matk': req.query.username})
        .then(() =>
            {
                    client_account.updateOne({"matk": req.query.username},
                    { $push: { "danhsach_km": {"makm": req.query.makm, "manhap": req.query.manhap, "phantram": req.query.phantram, "ngaykt": req.query.ngaykt}}
                    })
                        .then(() => 
                        {
                            console.log("THÊM KHUYẾN MÃI")
                            khuyenmai.updateOne({"makm": req.query.makm},
                            { $inc: {"sl": -1, "daluu": + 1}}).then(()=>{
                                res.send(200, 'OK');
                            })    
                        })
            
        });
    }
    //xem chi tiết tài khoản
    // chitiettk(req,res,next){
    //     client_login.findOne({'matk': req.session.username})
    //     .then(thongtintk => 
    //         {
    //             thongtintk=mongooseToObject(thongtintk);
    //             client_login('danhsach_makm').aggregate([
    //                 { $lookup:
    //                    {
    //                      from: 'khuyenmai',
    //                      localField: 'makh_id',
    //                      foreignField: 'makm',
    //                      as: 'chitietkm'
    //                    }
    //                  }
    //                 ]).toArray(function(err, res) {
    //                 if (err) throw err;
    //                 console(res);
    //                 res.render('taikhoan.handlebars',{layout: 'client.handlebars', client_accounts: thongtintk, thongtin: thongtintk})
    //                 client_login.close();
    //               });
    //         })
    //     .catch(next)
    // }
    chitiettk(req,res,next)
    {
        console.log(req.query)
        client_login.findOne({'matk': req.query.matk})
        .then(thongtintk =>

            {
                console.log(thongtintk)
                //thongtintk=thongtintk.map(course => course.toObject())
                res.send(thongtintk)

            })

        .catch(next)

    }

    TaoDonHang(req,res,next)
    {
        //console.log('Hello')
        //console.log(req.body)
        var ThanhToan = ''
        var TinhTrangThanhToan =''
        if(req.body.value==='first')
        {
            ThanhToan = "Trực tiếp"
            TinhTrangThanhToan = "Chưa thanh toán"
        } 
        else
        {
            ThanhToan = "Trực tuyến"
            TinhTrangThanhToan = "Đã thanh toán"
        }
        var FormData={
            ds_sach: req.body.listbuyed,
            matk: req.body.matk,
            hinhthucthanhtoan: ThanhToan,
            tinhtrangthanhtoan: TinhTrangThanhToan,
            tinhtrangdonhang: 'chờ xác nhận',
            tongtien: req.body.tongtien,
        }

        FormData = new donhang(FormData)
        donhang.find({})
            .then(donhang_x =>{
                //console.log(donhang)
                 var n = donhang_x.length
                 if(n!=0)
                 {
                    var code = donhang_x[n-1].madh
                    code = code.substring(2,5)
                    var madh="dh00"+(parseInt(code)+1).toString()
                    var ThanhToan = ''
                    var TinhTrangThanhToan =''
                    if(req.body.value==='first')
                    {
                        ThanhToan = "Trực tiếp"
                        TinhTrangThanhToan = "Chưa thanh toán"
                    } 
                    else
                    {
                        ThanhToan = "Trực tuyến"
                        TinhTrangThanhToan = "Đã thanh toán"
                    }
                    var FormData={
                        ds_sach: req.body.listbuyed,
                        matk: req.body.matk,
                        madh: madh,
                        hinhthucthanhtoan: ThanhToan,
                        tinhtrangthanhtoan: TinhTrangThanhToan,
                        tinhtrangdonhang: 'chờ xác nhận',
                        tongtien: req.body.tongtien
                    }

                    FormData = new donhang(FormData)
                    FormData.save()
                    client_account.updateOne({'matk': req.body.matk},{danhsach_km: req.body.danhsach_km})
                        .then(res.send({status: 'Success', madh: madh}))
                 } else
                 {
                    var madh="dh00"+(1).toString()
                    var ThanhToan = ''
                    var TinhTrangThanhToan =''
                    if(req.body.value==='first')
                    {
                        ThanhToan = "Trực tiếp"
                        TinhTrangThanhToan = "Chưa thanh toán"
                    } 
                    else
                    {
                        ThanhToan = "Trực tuyến"
                        TinhTrangThanhToan = "Đã thanh toán"
                    }
                    var FormData={
                        ds_sach: req.body.listbuyed,
                        matk: req.body.matk,
                        madh: madh,
                        hinhthucthanhtoan: ThanhToan,
                        tinhtrangthanhtoan: TinhTrangThanhToan,
                        tinhtrangdonhang: 'chờ xác nhận',
                        tongtien: req.body.tongtien
                    }

                    FormData = new donhang(FormData)
                    FormData.save()
                    client_account.updateOne({'matk': req.body.matk},{danhsach_km: req.body.danhsach_km})
                        .then(res.send({status: 'Success', madh: madh}))
                 }
                

            })
        
    }

    // thêm vào giỏ hàng
    themgiohang(req,res,next){
        // client_account.updateOne({"matk": req.params.username},
        // { $push: { "giohang": {"tensach": req.params.tensach, "giaban": req.params.giaban, "hinhanh": req.params.hinhanh, "soluong": req.params.soluong}}})
        //     .then(() =>{
        //         console.log('OK')
        //         res.send('OK')
        //     })
        // req.session.username=req.params.username
        // req.session.isAuth = true
       console.log(req.query.username, req.query.theloai, req.query.soluong)
       let soluong = Number(req.query.soluong);
       client_account.findOne({'matk': req.query.username})
        .then(thongtintk =>
            {
                //console.log(thongtintk)
                var cart = thongtintk.giohang
                var flag=false
                for(var i=0; i<cart.length;i++)
                {
                    if(cart[i].tensach===req.query.tensach)
                    {
                        flag=true
                        cart[i].soluong+=soluong
                    }
                }
                if(flag===true)
                {
                    client_account.updateOne({'matk': req.query.username},{'giohang': cart})
                        .then(res.send('Update'))
                }
                else
                {
                    client_account.updateOne({"matk": req.query.username},
                    { $push: { "giohang": {"tensach": req.query.tensach, "giaban": req.query.giaban, "hinhanh": req.query.hinhanh, "soluong": req.query.soluong, "theloai": req.query.theloai}}, 
                    $inc: {"sl_giohang": +1}
                    })
                        .then(res.send('Add'))
                }
            })
    }

    //Xóa khỏi giỏ hàng

    xoasanpham(req,res,next){
        client_account.updateOne({"matk": req.params.username},
        { $pull: { "giohang": {
           "tensach": req.params.tensach
        }}, 
            $inc: {"sl_giohang": -1}
        })
        .then(() => 
        {
            console.log("Haha")
            res.send("OK")
        })
        .catch(next)
    }

    //xem chi tiết giỏ hàng
    chitietgiohang(req,res,next){
                client_login.findOne({'matk': req.params.username})
                .then(thongtintk => 
                    {
                        thongtintk=mongooseToObject(thongtintk);
                        giohang.findOne({'matk': req.params.username}).then(gh =>{
                            gh=mongooseToObject(gh);
                            res.send(200, {thongtintk, gh})         
                        })
                    })
                    .catch(next)
    }

    // áp dụng khuyến mãi
    nhapkhuyenmai(req,res,next){
        client_login.find({"danhsach_km": {"makm": req.query.makm}})
        .then(() => 
            {
                client_login.updateOne({"matk": req.session.username}, 
                { $pull: { "danhsach_km": {"makm": req.query.makm }}
                })
                .then(() => 
                {
                client_login.findOne({'matk': req.session.username})
                .then(thongtintk => 
                    {
                        thongtintk=mongooseToObject(thongtintk);
                        khuyenmai.findOne({'makm': req.query.makm})
                        .then(makm =>
                        {
                            makm=mongooseToObject(makm);
                            res.render('cart_client.handlebars',{layout: 'client.handlebars', client_accounts: thongtintk, makhuyenmai: makm})           
                        })
                        .catch(next)       
                    })
                    .catch(next)               
                })  
            })
            .catch(next)
        
    }

    // thanh toán đơn hàng
    thanhtoan(req,res,next){
        client_login.findOne({'matk': req.session.username})
        .then(thongtintk => 
            {
                thongtintk=mongooseToObject(thongtintk);
                res.render('payment.handlebars',{layout: 'client.handlebars', client_accounts: thongtintk})})
            .catch(next)
    }

    // list all---------------------
    listvoucher_all(req,res,next)
    {
        //console.log(req.query)
        //console.log('hello')
        khuyenmai.find({})
            .then(khuyenmai => {
                console.log(khuyenmai)
                //console.log(client_account)
                //console.log(listcode)
                //khuyenmai.find({makm: {$in: client_account.danhsach_km }})
                  //  .then(khuyenmai => 
                  //  {
                       // console.log(khuyenmai)
                        res.send(khuyenmai)
                   // })
            })
    }

    //list user---------------------

    listdonhang(req,res,next)

    {
        console.log(req.params.matk) 
        donhang.find({'matk':req.params.matk, 'tinhtrangdonhang': req.params.tinhtrang})
            .then(donhang => {
                console.log(donhang)
                res.send({donhang})
            })
    }

    listvoucher(req,res,next)
    {
        client_account.findOne({'matk': req.params.username})
            .then(client_account =>{
               
                const khuyenmai = client_account.danhsach_km;
                res.send({khuyenmai})
            })
    }

    chitietdonhang(req,res,next)
    {
        console.log(req.params.matk, req.params.madh)
        donhang.findOne({'matk':req.params.matk, 'madh': req.params.madh})
            .then(donhang => {
                console.log(donhang)
                const books = donhang.ds_sach;
                client_account.findOne({'matk': req.params.matk})
                .then(client_account =>{
                
                    res.send({taikhoan: client_account, books: books, donhang: donhang})
                })
            })
    }
    //-------------------------------------------------------------------------------

    updatethongtin(req, res,next)
    {
        const FormData= req.body.data
        client_account.updateOne({"matk":FormData.matk},{
            "hoten": FormData.hoten,
            "sodt": FormData.sodt,
            "email": FormData.email,
            "diachigoc": FormData.diachigoc,
            "diachi": FormData.diachi
        })
            .then(() =>
            {
                res.send({message: "Cập nhật thông tin thành công"})
            })
    }

    //-----------------------------------
    laybovoucher(req, res,next)
    {
        client_account.findOne({'matk': req.query.matk})
            .then(client_account =>{
                const khuyenmai = client_account.danhsach_km;
                res.send({taikhoan: client_account, khuyenmai: khuyenmai})
            })
    }

    capnhatmatkhau(req,res,next)
    {
        console.log(req.query.matkhau)
        client_account.updateOne({"matk": req.query.username},
            { "matkhau": req.query.matkhau,
        })
        .then(() => 
        {
            res.send('OK')
        });
    }

    sachdaxem(req, res, next){
        console.log(req.query.username, req.query.tensach, ' SÁCH ĐÃ XEMMMMMMMMMM')
         client_account.updateOne({"matk": req.query.username},
        { $push: { "daxem": {"tensach": req.query.tensach, "giaban": req.query.giaban, "hinhanh": req.query.hinhanh}}})
            .then(() =>{
                console.log('OK')
                res.send('OK')
            })
    }

    ds_sachdaxem(req,res,next)
    {
        client_account.findOne({'matk': req.query.username})
            .then(client_account =>{
               
                const books = client_account.daxem;
                res.send({books})
            })
    }
}

module.exports = new Client_Control