var express = require('express');
var router = express.Router();
var sql_query = require('../db/index')

const { Pool } = require('pg')
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

router.get('/', function (req, res, next) {
  console.log("Go to full my restaurant page")
  pool.query(sql_query.query.view_rest, [req.user.username], (err, data) => {
    if (err) {
      console.error("Error in my restaurants");
      throw err;
    }
    //data = []
    data.rows.push({rname: 'sample rname super long', address: 'sampleaddress'})
    for (let i = 0; i < data.rows.length; i++) {
      data.rows[i]["edit_link"] = "/my_restaurants/edit:" + encodeURI(data.rows[i].rname) + "&:" + encodeURI(data.rows[i].address);
      console.log(data.rows[i].edit_link)
    }
    res.render('my_restaurants', { title: 'My Restaurants', data: data.rows, sample_link: "/lalasample" });
  });
});

// add new res
router.post('/add', function (req, res, next) {
  var rname = req.body.rname
  var address = req.body.address
  var uname = req.user.username
  console.log(`Add restaurant to my restaurant ${rname} at ${address}`)
  pool.query(sql_query.query.add_rest, [rname, address], (err, data) => {
    if (err) {
      console.error("Error in adding restaurant");
      throw err;
    }
    pool.query(sql_query.query.add_ownrest, [rname, uname, address], (err, data) => {
      if (err) {
        console.error("Error in adding default owner to restaurant");
        throw err;
      }
      res.redirect('/my_restaurants')
    })
  });
});

//main edit page
router.get('/edit:rname&:address', function (req, res, next) {
  var rname = decodeURI(req.params.rname).substr(1)
  var address = decodeURI(req.params.address).substr(1)
  pool.query(sql_query.query.view_rest_specific_name, [rname, address], (err, data) => {
    if (err) {
      console.error("Error in view restaurant");
      throw err;
    }
    if (data.rows.length == 0) {
      console.error("In my restaurant edit: No such restautant exists");
      res.render('my_restaurants_edit/my_restaurants_edit', { title: 'My Restaurant' });
      //res.redirect('/my_restaurants')
    }
    else {
      var base_query = ":" + encodeURI(data.rows[0].rname) + "&:" + encodeURI(data.rows[0].address)
      var sample_link = {
        edit_fnb: "/my_restaurants/edit/fnb" + base_query,
        edit_avail: "/my_restaurants/edit/avail" + base_query,
        edit_op_hrs: "/my_restaurants/edit/ophr" + base_query,
        edit_prom: "/my_restaurants/edit/prom" + base_query,
        edit_owners: "/my_restaurants/edit/owners" + base_query,
        edit_workers: "/my_restaurants/edit/workers" + base_query,
      }
      res.render('my_restaurants_edit/my_restaurants_edit', { title: 'My Restaurant', data: data.rows, sample_link: sample_link });
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
      throw err;
    }
    res.redirect(`/my_restaurants/edit:${encodeURI(rname)}&:${encodeURI(address)}`);
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
        throw err;
      }
      res.redirect(`/my_restaurants/edit:${encodeURI(rname)}&:${encodeURI(address)}`)
    });
  }
  else {
    pool.query(sql_query.query.edit_restloc, [area_new, rname, address], (err, data) => {
      if (err) {
        console.error("Error in edit restaurant location");
        throw err;
      }
      res.redirect(`/my_restaurants/edit:${encodeURI(rname)}&:${encodeURI(address)}`)
    });
  }
});

//edit fnb page
router.get('/edit/fnb:rname&:address', function (req, res, next) {
  var rname = decodeURI(req.params.rname).substr(1)
  var address = decodeURI(req.params.address).substr(1)
  console.log(`Go to my restaurant ${rname} at ${address} to edit fnb`)
  pool.query(sql_query.query.view_fnb, [rname, address], (err, data) => {
    if (err) {
      console.error("Error in view restaurant fnb");
      throw err;
    }
    else {
      for (let i = 0; i < data.rows.length; i++) {
        var base_query = "?rname=" + encodeURI(rname) + "&address=" + encodeURI(address) + "&fname=" + encodeURI(data.rows[i].fname)
        var sample_link = "/my_restaurants/edit/fnb/delete" //+ base_query
        data.rows[i]['delete'] = sample_link
      }
      res.render('my_restaurants_edit/fnb', { title: 'My Restaurant', rname: rname, address: address, data: data.rows});
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
      throw err;
    }
    res.redirect(`/my_restaurants/edit/fnb:${encodeURI(rname)}&:${encodeURI(address)}`)    
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
      throw err;
    }
    res.redirect(`/my_restaurants/edit/fnb:${encodeURI(rname)}&:${encodeURI(address)}`)    
  });
});

// edit edit avail
// need editting
router.get('/edit/avail:rname&:address', function (req, res, next) {
  var rname = decodeURI(req.params.rname).substr(1)
  var address = decodeURI(req.params.address).substr(1)
  console.log(`Go to my restaurant ${rname} at ${address} to edit op hrs`)
  pool.query(sql_query.query.view_fnb, [rname, address], (err, data) => {
    if (err) {
      console.error("Error in view restaurant availability");
      throw err;
    }
    else {
      for (let i = 0; i < data.rows.length; i++) {
        var base_query = "?rname=" + encodeURI(rname)+ "&address=" + encodeURI(address) + "&day=" + encodeURI(data.rows[i].day) + "&s_time=" + encodeURI(data.rows[i].s_time)
        var sample_link = "/my_restaurants/edit/avail/delete" //+ base_query
        data.rows[i]['delete'] = sample_link
      }
      res.render('my_restaurants_edit/availability', { title: 'My Restaurant', data: data.rows});
    }
  });
});

router.post('/edit/avail/add', function (req, res, next) {
  var rname = req.body.rname
  var address = req.body.address
  var day = req.body.day
  var s_time = req.body.s_time
  var hours = req.body.hours

  console.log(`Add ophr my restaurant ${rname} at ${address}`)
  pool.query(sql_query.query.add_oh, [rname, address, day, s_time, hours], (err, data) => {
    if (err) {
      console.error("Error in add restaurant op hrs");
      throw err;
    }
    res.redirect(`/my_restaurants/edit/avail:${encodeURI(rname)}&:${encodeURI(address)}`)    
  });
});


router.post('/edit/avail/delete', function (req, res, next) {
  var rname = req.body.rname
  var address = req.body.address
  var day = req.body.day
  var s_time = req.body.s_time
  
  console.log(`Delete fnb my restaurant ${rname} at ${address}`)
  pool.query(sql_query.query.del_oh, [rname, address, day, s_time], (err, data) => {
    if (err) {
      console.error("Error in delete restaurant ophr");
      throw err;
    }
    res.redirect(`/my_restaurants/edit/avail:${encodeURI(rname)}&:${encodeURI(address)}`)    
  });
});

// edit op_hrs
// need editting
router.get('/edit/ophr:rname&:address', function (req, res, next) {
  var rname = decodeURI(req.params.rname).substr(1)
  var address = decodeURI(req.params.address).substr(1)
  console.log(`Go to my restaurant ${rname} at ${address} to edit op hrs`)
  pool.query(sql_query.query.view_fnb, [rname, address], (err, data) => {
    if (err) {
      console.error("Error in view restaurant op hr");
      throw err;
    }
    else {
      for (let i = 0; i < data.rows.length; i++) {
        var base_query = "?rname=" + encodeURI(rname)+ "&address=" + encodeURI(address) + "&day=" + encodeURI(data.rows[i].day) + "&s_time=" + encodeURI(data.rows[i].s_time)
        var sample_link = "/my_restaurants/edit/ophr/delete" //+ base_query
        data.rows[i]['delete'] = sample_link
      }
      res.render('my_restaurants_edit/ophr', { title: 'My Restaurant', data: data.rows, rname: rname, address: address});
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
      console.error("Error in add restaurant op hrs");
      throw err;
    }
    res.redirect(`/my_restaurants/edit/ophr:${encodeURI(rname)}&:${encodeURI(address)}`)    
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
      console.error("Error in delete restaurant ophr");
      throw err;
    }
    res.redirect(`/my_restaurants/edit/ophr:${encodeURI(rname)}&:${encodeURI(address)}`)    
  });
});

// edit prom
router.get('/edit/prom:rname&:address', function (req, res, next) {
  var rname = decodeURI(req.params.rname).substr(1)
  var address = decodeURI(req.params.address).substr(1)
  console.log(`Go to my restaurant ${rname} at ${address} to edit op promotion`)
  pool.query(sql_query.query.view_prom, [rname, address], (err, data) => {
    if (err) {
      console.error("Error in view restaurant prom");
      throw err;
    }
    else {
      for (let i = 0; i < data.rows.length; i++) {
        var base_query = "?rname=" + encodeURI(rname)+ "&address=" + encodeURI(address) + "&time=" + data.rows[i].time + "&discount=" + data.rows[i].discount
        var sample_link = "/my_restaurants/edit/prom/delete" //+ base_query
        data.rows[i]['delete'] = sample_link
      }
      res.render('my_restaurants_edit/prom', { title: 'My Restaurant', data: data.rows, rname: rname, address: address});
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
      console.error("Error in add restaurant promotion");
      throw err;
    }
    res.redirect(`/my_restaurants/edit/prom:${encodeURI(rname)}&:${encodeURI(address)}`)    
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
      console.error("Error in delete restaurant promotion");
      throw err;
    }
    res.redirect("/my_restaurants/edit/prom" + ":" + encodeURI(rname)+ "&:" + address)    
  });
});


// edit owners
router.get('/edit/owners:rname&:address', function (req, res, next) {
  var rname = decodeURI(req.params.rname).substr(1)
  var address = decodeURI(req.params.address).substr(1)
  console.log(`Go to my restaurant ${rname} at ${address} to edit op owner`)
  pool.query(sql_query.query.view_owner_to_rest, [rname, address], (err, data) => {
    if (err) {
      console.error("Error in view restaurant owner");
      throw err;
    }
    else {
      for (let i = 0; i < data.rows.length; i++) {
        var base_query = ":" + encodeURI(rname)+ "&:" + encodeURI(address) + "&:" + encodeURI(data.rows[i].uname) 
        var sample_link = "/my_restaurants/edit/owners/delete" //+ base_query
        data.rows[i]['delete'] = sample_link
      }
      res.render('my_restaurants_edit/owners', { title: 'My Restaurant', data: data.rows, rname: rname, address: address});
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
      console.error("Error in owners");
      throw err;
    }
    if (data.rows.length == 0) {
      console.log("No such owner account");
      res.redirect(`/my_restaurants/edit/owners:${encodeURI(rname)}&:${encodeURI(address)}`)   
    } else {
      pool.query(sql_query.query.add_owner_to_rest, [rname, address, uname], (err, data) => {
        if (err) {
          console.error("Error in add restaurant owner");
          throw err;
        }
        res.redirect(`/my_restaurants/edit/owners:${encodeURI(rname)}&:${encodeURI(address)}`)    
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
      console.error("Error in delete restaurant owners");
      throw err;
    }
    res.redirect(`/my_restaurants/edit/owners:${encodeURI(rname)}&:${encodeURI(address)}`)    
  });
});


module.exports = router;
