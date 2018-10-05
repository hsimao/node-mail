var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var csrf = require('csurf');
var csrfProtection = csrf({ cookie: true });
require('dotenv').config();

router.get('/', csrfProtection, function(req, res) {
    res.render('contact', {
      csrfToken: req.csrfToken(),
      errors: req.flash('errors')
    });
});
router.get('/review', function(req, res) {
    res.render('contactReview');
});
router.post('/post', csrfProtection, function(req, res) {
    if(req.body.username == '') {
      req.flash('errors', '姓名不可為空');
      res.redirect('/contact');
      return
    }

    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS
        }
    });

    var mailOptions = {
        from: '"Mars"<e087754958@gmail.com>',
        to: 'e087754958@gmail.com',
        subject: req.body.username + '寄了一封信',
        text: req.body.description
    }

    transporter.sendMail(mailOptions, (error, info)=> {
        if (error) return console.log(error);
        res.redirect('review');
    })
});
module.exports = router;
