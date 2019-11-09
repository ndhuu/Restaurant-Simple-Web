var express = require('express');
var router = express.Router();
var sql_query = require('../db/index');
var notifier = require('node-notifier');

const { Pool } = require('pg')
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

const post_err_mess = "Error: cannot make the edit. Check your input!"
const get_err_mess  = "Error: Cannot go to this edit page. Something went wrong!"


//libs
function encodeHashtag(str) {
  return str.replace("#", "hashtag");
}

function decodeHashtag(str) {
  return str.replace("hashtag", "#");
}


router.get('/', function (req, res, next) {
  console.log("Go to full my restaurant page")
  pool.query(sql_query.query.view_rest, [req.user.username], (err, data) => {
    if (err) {
      console.error("Error in my restaurants");
      console.error(err)
      notifier.notify("Error: Cannot go to your restaurant page! Contact admin for help!");
      res.redirect('/');
    } else {
      for (let i = 0; i < data.rows.length; i++) {
        data.rows[i]["edit_link"] = "/my_restaurants/edit:" + encodeURI(encodeHashtag(data.rows[i].rname)) + "&:" + encodeURI(encodeHashtag(data.rows[i].address));
        data.rows[i]["reservation"] = "/my_restaurants/reservation/pending:" + encodeURI(encodeHashtag(data.rows[i].rname)) + "&:" + encodeURI(encodeHashtag(data.rows[i].address));
      }
      res.render('my_restaurants', { title: 'My Restaurants', data: data.rows, sample_link: "/lalasample" });
    }
  });
});

// add new res
// need edit
router.post('/add', function (req, res, next) {
  var rname = req.body.rname
  var address = req.body.address
  var uname = req.user.username
  console.log(`Add restaurant to my restaurant ${rname} at ${address}`)
  pool.query(sql_query.query.add_rest, [rname, address], (err, data) => {
    if (err) {
      console.error("Error in adding restaurant");
      console.error(err)
      res.redirect('/my_restaurants')
      notifier.notify("Error: Cannot add this restaurant. It may already exist");
    }
    pool.query(sql_query.query.add_ownrest, [rname, uname, address], (err, data) => {
      if (err) {
        console.error("Error in adding default owner to restaurant");
        console.error(err)
        res.redirect('/my_restaurants')
      }
      res.redirect('/my_restaurants')
    })
  });
});

// // add new rest my implementation
// router.post('/add', function (req, res, next) {
//   var rname = req.body.rname
//   var address = req.body.address
//   var uname = req.user.username
//   console.log(`Add restaurant to my restaurant ${rname} at ${address}`)
//   pool.query(sql_query.query.add_rest, [rname, address, uname], (err, data) => {
//     if (err) {
//       console.error("Error in adding restaurant");
//       console.error(err)
//       throw err;
//     }
//     res.redirect('/my_restaurants')
//   });
// });

//main edit page
router.get('/edit:rname&:address', function (req, res, next) {
  var rname = decodeURI(decodeHashtag(req.params.rname)).substr(1)
  var address = decodeURI(decodeHashtag(req.params.address)).substr(1)
  pool.query(sql_query.query.view_rest_specific_name, [rname, address], (err, data) => {
    if (err) {
      console.error("Error in view restaurant");
      console.error(err)
      notifier.notify("Error: Cannot go to this edit page. Something went wrong!");
      res.redirect('/my_restaurants');
    } else {
      if (data.rows.length == 0) {
        console.error("In my restaurant edit: No such restautant exists");
        console.error(err)
        res.render('my_restaurants_edit/my_restaurants_edit', { title: 'My Restaurant' });
        //res.redirect('/my_restaurants')
      }
      else {
        var base_query = ":" + encodeURI(encodeHashtag(data.rows[0].rname)) + "&:" + encodeURI(encodeHashtag(data.rows[0].address))
        var sample_link = {
          edit_fnb: "/my_restaurants/edit/fnb" + base_query,
          edit_avail: "/my_restaurants/edit/avail" + base_query,
          edit_op_hrs: "/my_restaurants/edit/ophr" + base_query,
          edit_prom: "/my_restaurants/edit/prom" + base_query,
          edit_owners: "/my_restaurants/edit/owners" + base_query,
          edit_workers: "/my_restaurants/edit/cuisine" + base_query,
        }
        pool.query(sql_query.query.view_loc, [], (err, area_list) => {
          if (err) {
            console.error("Error in view restaurant");
            console.error(err)
            res.redirect('/my_restaurants');
          }
          res.render('my_restaurants_edit/my_restaurants_edit', { title: 'My Restaurant', data: data.rows, sample_link: sample_link, area_list: area_list.rows });
        })
      }
    }
  });
});


//main edit
router.post('/edit', function (req, res, next) {
  var rname_old = req.body.rnameold
  var address_old = req.body.addressold
  var rname_new = req.body.rnamenew
  var address_new = req.body.addressnew

  console.log(`Edit my restaurant ${rname_old} at ${address_old}`)
  pool.query(sql_query.query.edit_rest_sepecific_name, [rname_new, address_new, rname_old, address_old], (err, data) => {
    if (err) {
      console.error("Error in edit restaurant");
      console.error(err)
      notifier.notify("Error: Error editting! Restaurant may alr exist!");
    }
    res.redirect(`/my_restaurants/edit:${encodeURI(encodeHashtag(rname))}&:${encodeURI(encodeHashtag(address))}`)
  });
});




//edit loc
router.post('/edit_loc', function (req, res, next) {
  var area_old = req.body.areaold
  var area_new = req.body.areanew
  var rname = req.body.rname
  var address = req.body.address

  console.log(`Edit location my restaurant ${rname} at ${address}`)
  if (area_old == '') {
    pool.query(sql_query.query.add_restloc, [rname, address, area_new], (err, data) => {
      if (err) {
        console.error("Error in edit restaurant location");
        console.error(err)
        notifier.notify("Error: Cannot edit location. Something went wrong!");
      }
      res.redirect(`/my_restaurants/edit:${encodeURI(encodeHashtag(rname))}&:${encodeURI(encodeHashtag(address))}`)
    });
  }
  else {
    pool.query(sql_query.query.edit_restloc, [area_new, rname, address], (err, data) => {
      if (err) {
        console.error("Error in edit restaurant location");
        console.error(err)
      }
      res.redirect(`/my_restaurants/edit:${encodeURI(encodeHashtag(rname))}&:${encodeURI(encodeHashtag(address))}`)
    });
  }
});

//edit fnb page
router.get('/edit/fnb:rname&:address', function (req, res, next) {
  var rname = decodeURI(decodeHashtag(req.params.rname)).substr(1)
  var address = decodeURI(decodeHashtag(req.params.address)).substr(1)
  console.log(`Go to my restaurant ${rname} at ${address} to edit fnb`)
  pool.query(sql_query.query.view_fnb, [rname, address], (err, data) => {
    if (err) {
      console.error("Error in view restaurant fnb");
      console.error(err)
      notifier.notify("Error: Cannot go to this edit page. Something went wrong!");
      res.redirect('/my_restaurants');
    }
    else {
      for (let i = 0; i < data.rows.length; i++) {
        var sample_link = "/my_restaurants/edit/fnb/delete"
        data.rows[i]['delete'] = sample_link
      }
      res.render('my_restaurants_edit/fnb', { title: 'My Restaurant', rname: rname, address: address, data: data.rows });
    }
  });
});

router.post('/edit/fnb/add', function (req, res, next) {
  var rname = req.body.rname
  var address = req.body.address
  var fname = req.body.fname
  var price = req.body.price

  console.log(`Add fnb my restaurant ${rname} at ${address}`)
  pool.query(sql_query.query.add_fnb, [rname, address, fname, price], (err, data) => {
    if (err) {
      console.error("Error in add restaurant fnb");
      notifier.notify("Error: Cannot make the edit. Check your input!");
      console.error(err)
    }
    res.redirect(`/my_restaurants/edit/fnb:${encodeURI(encodeHashtag(rname))}&:${encodeURI(encodeHashtag(address))}`)
  });
});


router.post('/edit/fnb/delete', function (req, res, next) {
  var rname = req.body.rname
  var address = req.body.address
  var fname = req.body.fname

  console.log(`Delete fnb my restaurant ${rname} at ${address}`)
  pool.query(sql_query.query.del_fnb, [rname, address, fname], (err, data) => {
    if (err) {
      console.error("Error in delete restaurant fnb");
      notifier.notify("Error: cannot make the edit. Check your input!");
      console.error(err)
    }
    res.redirect(`/my_restaurants/edit/fnb:${encodeURI(encodeHashtag(rname))}&:${encodeURI(encodeHashtag(address))}`)
  });
});


//edit cuisine page
router.get('/edit/cuisine:rname&:address', function (req, res, next) {
  var rname = decodeURI(decodeHashtag(req.params.rname)).substr(1)
  var address = decodeURI(decodeHashtag(req.params.address)).substr(1)
  console.log(`Go to my restaurant ${rname} at ${address} to edit cuisine`)
  pool.query(sql_query.query.view_restcui, [rname, address], (err, data) => {
    if (err) {
      console.error("Error in view restaurant cuisine");
      console.error(err)
      notifier.notify(get_err_mess)
      res.redirect('/my_restaurants');
    }
    else {
      for (let i = 0; i < data.rows.length; i++) {
        var sample_link = "/my_restaurants/edit/cuisine/delete"
        data.rows[i]['delete'] = sample_link
      }
      res.render('my_restaurants_edit/cuisine', { title: 'My Restaurant', rname: rname, address: address, data: data.rows });
    }
  });
});

router.post('/edit/cuisine/add', function (req, res, next) {
  var rname = req.body.rname
  var address = req.body.address
  var cname = req.body.cname

  console.log(`Add cuisine to my restaurant ${rname} at ${address}`)
  pool.query(sql_query.query.add_restcui, [rname, address, cname], (err, data) => {
    if (err) {
      notifier.notify(post_err_mess)
      console.error("Error in add restaurant cuisine");
      console.error(err)
    }
    res.redirect(`/my_restaurants/edit/cuisine:${encodeURI(encodeHashtag(rname))}&:${encodeURI(encodeHashtag(address))}`)
  });
});


router.post('/edit/cuisine/delete', function (req, res, next) {
  var rname = req.body.rname
  var address = req.body.address
  var cname = req.body.cname

  console.log(`Delete fnb my restaurant ${rname} at ${address}`)
  pool.query(sql_query.query.del_restcui, [rname, address, cname], (err, data) => {
    if (err) {
      notifier.notify(post_err_mess)
      console.error("Error in delete restaurant cuisine");
      console.error(err)
    }
    res.redirect(`/my_restaurants/edit/cuisine:${encodeURI(encodeHashtag(rname))}&:${encodeURI(encodeHashtag(address))}`)
  });
});



// edit edit avail
router.get('/edit/avail:rname&:address', function (req, res, next) {
  var rname = decodeURI(decodeHashtag(req.params.rname)).substr(1)
  var address = decodeURI(decodeHashtag(req.params.address)).substr(1)
  console.log(`Go to my restaurant ${rname} at ${address} to edit avail`)
  pool.query(sql_query.query.view_av, [rname, address], (err, data) => {
    if (err) {
      notifier.notify(get_err_mess)
      console.error("Error in view restaurant availability");
      console.error(err)
      res.redirect('/my_restaurants');
    }
    else {
      for (let i = 0; i < data.rows.length; i++) {
        var sample_link = "/my_restaurants/edit/avail/delete"
        data.rows[i]['delete'] = sample_link
        data.rows[i].time = data.rows[i].time.substring(0, data.rows[i].time.length - 3)
        let str = data.rows[i].date
      }
      res.render('my_restaurants_edit/availability', { title: 'My Restaurant', data: data.rows, rname: rname, address: address });
    }
  });
});

router.post('/edit/avail/add', function (req, res, next) {
  var rname = req.body.rname
  var address = req.body.address
  var time = req.body.time
  var date = req.body.date
  var maxpax = req.body.maxpax
  console.log(date)
  console.log(`Add avail my restaurant ${rname} at ${address}`)
  pool.query(sql_query.query.add_av, [rname, address, date, time, maxpax], (err, data) => {
    if (err) {
      notifier.notify(post_err_mess)
      console.error("Error in add restaurant availability");
      console.error(err)
    }
    res.redirect(`/my_restaurants/edit/avail:${encodeURI(encodeHashtag(rname))}&:${encodeURI(encodeHashtag(address))}`)
  });
});


router.post('/edit/avail/delete', function (req, res, next) {
  var rname = req.body.rname
  var address = req.body.address
  var time = req.body.time
  var date = req.body.date
  console.log(time)
  console.log(`Delete avail my restaurant ${rname} at ${address}`)
  pool.query(sql_query.query.del_av, [rname, address, date, time], (err, data) => {
    if (err) {
      notifier.notify(post_err_mess)
      console.error("Error in delete restaurant availability");
      console.error(err)
    }
    res.redirect(`/my_restaurants/edit/avail:${encodeURI(encodeHashtag(rname))}&:${encodeURI(encodeHashtag(address))}`)
  });
});

// edit op_hrs
// need editting
router.get('/edit/ophr:rname&:address', function (req, res, next) {
  var rname = decodeURI(decodeHashtag(req.params.rname)).substr(1)
  var address = decodeURI(decodeHashtag(req.params.address)).substr(1)
  console.log(`Go to my restaurant ${rname} at ${address} to edit op hrs`)
  pool.query(sql_query.query.view_restoh, [rname, address], (err, data) => {
    if (err) {
      notifier.notify(get_err_mess)
      console.error("Error in view restaurant op hr");
      console.error(err)
      res.redirect('/my_restaurants');
    }
    else {
      for (let i = 0; i < data.rows.length; i++) {
        var sample_link = "/my_restaurants/edit/ophr/delete"
        data.rows[i]['delete'] = sample_link
        let e_time = data.rows[i].hours + parseInt(data.rows[i].s_time);
        if (e_time >= 24) {
          e_time = e_time - 24;
        }
        data.rows[i]['e_time'] = String(e_time) + data.rows[i].s_time.substring(2);
      }
      res.render('my_restaurants_edit/ophr', { title: 'My Restaurant', data: data.rows, rname: rname, address: address });
    }
  });
});

router.post('/edit/ophr/add', function (req, res, next) {
  var rname = req.body.rname
  var address = req.body.address
  var day = req.body.day
  var s_time = req.body.s_time
  var hours = req.body.hours

  console.log(`Add ophr my restaurant ${rname} at ${address}`)
  pool.query(sql_query.query.add_oh, [rname, address, day, s_time, hours], (err, data) => {
    if (err) {
      notifier.notify(post_err_mess)
      console.error("Error in add restaurant op hrs");
      console.error(err)
    }
    res.redirect(`/my_restaurants/edit/ophr:${encodeURI(encodeHashtag(rname))}&:${encodeURI(encodeHashtag(address))}`)
  });
});


router.post('/edit/ophr/delete', function (req, res, next) {
  var rname = req.body.rname
  var address = req.body.address
  var day = req.body.day
  var s_time = req.body.s_time

  console.log(`Delete fnb my restaurant ${rname} at ${address}`)
  pool.query(sql_query.query.del_oh, [rname, address, day, s_time], (err, data) => {
    if (err) {
      notifier.notify(post_err_mess)
      console.error("Error in delete restaurant ophr");
      console.error(err)
    }
    res.redirect(`/my_restaurants/edit/ophr:${encodeURI(encodeHashtag(rname))}&:${encodeURI(encodeHashtag(address))}`)
  });
});

// edit prom
router.get('/edit/prom:rname&:address', function (req, res, next) {
  var rname = decodeURI(decodeHashtag(req.params.rname)).substr(1)
  var address = decodeURI(decodeHashtag(req.params.address)).substr(1)
  console.log(`Go to my restaurant ${rname} at ${address} to edit op promotion`)
  pool.query(sql_query.query.view_prom, [rname, address], (err, data) => {
    if (err) {
      notifier.notify(get_err_mess)
      console.error("Error in view restaurant prom");
      console.error(err)
      res.redirect('/my_restaurants');
    }
    else {
      for (let i = 0; i < data.rows.length; i++) {
        var sample_link = "/my_restaurants/edit/prom/delete"
        data.rows[i]['delete'] = sample_link
      }
      res.render('my_restaurants_edit/prom', { title: 'My Restaurant', data: data.rows, rname: rname, address: address });
    }
  });
});

router.post('/edit/prom/add', function (req, res, next) {
  var rname = req.body.rname
  var address = req.body.address
  var time = req.body.time
  var discount = req.body.discount

  console.log(`Add prom my restaurant ${rname} at ${address} with ${discount} at ${time}`)
  pool.query(sql_query.query.add_prom, [rname, address, time, discount], (err, data) => {
    if (err) {
      notifier.notify(post_err_mess)
      console.error("Error in add restaurant promotion");
      console.error(err)
    }
    res.redirect(`/my_restaurants/edit/prom:${encodeURI(encodeHashtag(rname))}&:${encodeURI(encodeHashtag(address))}`)
  });
});


router.post('/edit/prom/delete', function (req, res, next) {
  var rname = req.body.rname
  var address = (req.body.address)
  var time = req.body.time
  var discount = req.body.discount

  console.log(`Delete prom my restaurant ${rname} at ${address} with ${discount} at ${time}`)
  pool.query(sql_query.query.del_prom, [rname, address, time, discount], (err, data) => {
    if (err) {
      notifier.notify(post_err_mess)
      console.error("Error in delete restaurant promotion");
      console.error(err)
    }
    res.redirect("/my_restaurants/edit/prom" + ":" + encodeURI(encodeHashtag(rname)) + "&:" + address)
  });
});


// edit owners
router.get('/edit/owners:rname&:address', function (req, res, next) {
  var rname = decodeURI(decodeHashtag(req.params.rname)).substr(1)
  var address = decodeURI(decodeHashtag(req.params.address)).substr(1)
  console.log(`Go to my restaurant ${rname} at ${address} to edit op owner`)
  pool.query(sql_query.query.view_owner_to_rest, [rname, address], (err, data) => {
    if (err) {
      notifier.notify(get_err_mess)
      console.error("Error in view restaurant owner");
      console.error(err)
      res.redirect('/my_restaurants');
    }
    else {
      for (let i = 0; i < data.rows.length; i++) {
        var sample_link = "/my_restaurants/edit/owners/delete"
        data.rows[i]['delete'] = sample_link
      }
      res.render('my_restaurants_edit/owners', { title: 'My Restaurant', data: data.rows, rname: rname, address: address });
    }
  });
});

router.post('/edit/owners/add', function (req, res, next) {
  var rname = req.body.rname
  var address = req.body.address
  var uname = req.body.uname

  console.log(`Add owner my restaurant ${rname} at ${address}`)
  pool.query(sql_query.query.check_owner, [uname], (err, data) => {
    if (err) {
      notifier.notify(post_err_mess)
      console.error("Error in owners");
      console.error(err)
    }
    if (data.rows.length == 0) {
      console.log("No such owner account");
      res.redirect(`/my_restaurants/edit/owners:${encodeURI(encodeHashtag(rname))}&:${encodeURI(encodeHashtag(address))}`)
    } else {
      pool.query(sql_query.query.add_owner_to_rest, [rname, address, uname], (err, data) => {
        if (err) {
          console.error("Error in add restaurant owner");
          console.error(err)
        }
        res.redirect(`/my_restaurants/edit/owners:${encodeURI(encodeHashtag(rname))}&:${encodeURI(encodeHashtag(address))}`)
      });
    }
  });

});

router.post('/edit/owners/delete', function (req, res, next) {
  var rname = req.body.rname
  var address = req.body.address
  var uname = req.body.uname

  console.log(`Delete ${req.body.uname} my restaurant ${req.body.rname} at ${req.body.address}`)
  pool.query(sql_query.query.del_owner_to_rest, [rname, address, uname], (err, data) => {
    if (err) {
      notifier.notify(post_err_mess)
      console.error("Error in delete restaurant owners");
      console.error(err)
    }
    res.redirect(`/my_restaurants/edit/owners:${encodeURI(encodeHashtag(rname))}&:${encodeURI(encodeHashtag(address))}`)
  });
});


module.exports = router;
