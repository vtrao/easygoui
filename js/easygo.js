
function changeUrl(url) {
      jQuery("#mainiframe").attr('src','components/'+url);
    }
var serverurl = "http://localhost:8090/";
/*******Sales**************/
var salesurl = "sale";
var cartypesurl ="car/types";
var customertypesurl ="customer/types";
var salecomplexurl = "sale/complex";
var salesSelectedCarType = "ALL CAR TYPES";
var salesSelectedCustomerType = "ALL CUSTOMER TYPES";
var salesSelectedOutstationtrip = -1;
var initialSalesTable = "";
var initialTripsTable = "";
var saleTripsMap = new Object();
function onsalesbodyload() {
  initialSalesTable = $('#salestable').html();
  initialTripsTable = $('#triptable').html();
  $('#triptable').html("");
  $('#outstationtripselector').append($('<option>').text("All trips").attr('value', -1));
  $('#outstationtripselector').append($('<option>').text("Out station trips").attr('value', 1));
  $('#outstationtripselector').append($('<option>').text("local trips").attr('value', 0));
  //load cartype
  $.ajax({
    url: serverurl+cartypesurl,
    type:'GET',
    dataType: 'json',
    success: function( types ) {
      console.log("here I am "+types);

      $('#cartypeselector').append($('<option>').text(salesSelectedCarType).attr('value', ""));
      for(index in types) {
        console.log(types[index]);
        $('#cartypeselector').append($('<option>').text(types[index]).attr('value', types[index]));
      }
    }
  });
  $.ajax({
    url: serverurl+customertypesurl,
    type:'GET',
    dataType: 'json',
    success: function( types ) {
      console.log("here I am "+types);
      $('#customertypeselector').append($('<option>').text(salesSelectedCustomerType).attr('value', ""));
      for(index in types) {
        console.log(types[index]);
        $('#customertypeselector').append($('<option>').text(types[index]).attr('value', types[index]));
      }
    }
  });
  //load customer type

}

function getSales() {
    $('#triptable').html("");
    salesSelectedCarType = $('#cartypeselector').find(":selected").val();
    salesSelectedCustomerType = $('#customertypeselector').find(":selected").val();
    salesSelectedOutstationtrip = $('#outstationtripselector').find(":selected").val();
    console.log("  cartype: "+salesSelectedCarType+"  customerType:"+salesSelectedCustomerType+"  outstation: "+salesSelectedOutstationtrip);
    $.ajax({
      url: serverurl+salecomplexurl+"?outstation="+salesSelectedOutstationtrip+"&cartype="+salesSelectedCarType+"&customertype="+salesSelectedCustomerType,
      type:'GET',
      dataType: 'json',
      success: function( sales ) {
              var trHTML ="";
              for(index in sales) {
                trHTML += '<tr>'
                        + '<td>'+sales[index].id+'</td>'
                        + '<td>'+sales[index].price+' $</td>'
                        + '<td>'+sales[index].booking.description+'</td>'
                        + '<td>'+sales[index].booking.bookingtime+'</td>'
                        + '<td>'+sales[index].customer.name+'</td>'
                        + '<td>'+sales[index].customer.type+'</td>'
                        + '<td><a class="btn btn-success" onclick="loadSaleTripsDetails('+index+')">trips</a></td>'
                        + '</tr>';
                saleTripsMap[index] = sales[index].trips;
                //console.log(json[index].bookingid+" "+json[index].customerid+" "+json[index].id+" "+json[index].price);
                //console.log(json[index].booking.id+" "+json[index].booking.description+" "+json[index].booking.bookingtime+" "+json[index].booking.price+" "+json[index].booking.id);
                //console.log(json[index].customer.id+" "+json[index].customer.name+" "+json[index].customer.type);
                //for(tripindex in json[index].trips) {
                //  console.log("TRIP data: "+json[index].trips[tripindex].id+" "+json[index].trips[tripindex].car.name+"@"+json[index].trips[tripindex].car.reg+" "+json[index].trips[tripindex].from+" "+json[index].trips[tripindex].to);
                //}
              }
              $('#salestable').html(initialSalesTable+trHTML);
      }
  });
}

function loadSaleTripsDetails(saleindex) {
  console.log(saleindex);
  var trips = saleTripsMap[saleindex];
  var trHTML ="";
  var outstationdesc="";
  for(tripindex in trips) {
    if(trips[tripindex].outsstationtrip==1){
      outstationdesc = "OUT STATION TRIP";
    } else {
      outstationdesc = "IN CITY TRIP";
    }
    trHTML += '<tr>'
            + '<td>'+trips[tripindex].from+'</td>'
            + '<td>'+trips[tripindex].to+'</td>'
            + '<td>'+trips[tripindex].totaldays+'</td>'
            + '<td>'+outstationdesc+'</td>'
            + '<td>'+trips[tripindex].status+'</td>'
            + '<td>'+trips[tripindex].car.name+'</td>'
            + '<td>'+trips[tripindex].car.homebranch.name+'</td>'
            + '<td>'+trips[tripindex].car.reg+'</td>'
            + '<td>'+trips[tripindex].car.type+'</td>'
            + '</tr>';
  }
  $('#triptable').html(initialTripsTable+trHTML);
}

/********Customers********/
var customerurl = "customer";
var initialCustomerTable = "";
var customerBookingMap = new Object();
var customerTripMap = new Object();
var customerSaleMap = new Object();
function oncustomerbodyload() {
    initialCustomerTable=$('#customerstable').html();
    getCustomerProfiles();
}

function getCustomerProfiles() {
  $.ajax({
    url: serverurl+customerurl,
    type:'GET',
    dataType: 'json',
    success: function( json ) {
        var trHTML ="";
        var outstation = "NO";
        $('#customerstable').html("");
        $.each(json, function(i, customer) {
            if(trip.outsstationtrip==1){
              outstation = "YES";
            } else {
              outstation = "NO";
            }
            var buttonClass = "btn-default";
            var buttondisabled = "disabled";
            if(customer.bookings.length>0) {
              buttonClass= "btn-success";
              buttondisabled="";
            }
            trHTML += '<tr>'
                    + '<td>'+customer.id+'</td>'
                    + '<td>'+customer.name+'</td>'
                    + '<td>'+customer.type+'</td>'
                    + '<td><a '+buttondisabled+' class="btn '+buttonClass+'" onclick="loadCustomerDetails('+customer.id+',1)">sales</a></td>'
                    + '<td><a '+buttondisabled+' class="btn '+buttonClass+'" onclick="loadCustomerDetails('+customer.id+',2)">bookings</a></td>'
                    + '<td><a '+buttondisabled+' class="btn '+buttonClass+'" onclick="loadCustomerDetails('+customer.id+',3)">trips</a></td>'
                    + '</tr>';
                    console.log(" do this now "+customer.bookings.length);
            customerSaleMap[customer.id] = customer.sales;
            customerBookingMap[customer.id] = customer.bookings;
            customerTripMap[customer.id] = customer.trips;
        });
        console.log(JSON.stringify(customerSaleMap));
        console.log(JSON.stringify(customerBookingMap));
        console.log(JSON.stringify(customerTripMap));
        $('#customerstable').html(initialCustomerTable+trHTML);
    }
});
}

function loadCustomerDetails(custid,type) {
  var description = "";
  console.log(custid + " "+ type);
  if(type==1) { //sales
    var sales = customerSaleMap[custid];
    console.log(JSON.stringify(sales));
    description = "<table class='table'><tr><th>id</th><th>price</th></tr>"
    for(index in sales) {
      description = description + "<tr>"
              + "<td>"+sales[index].id+"</td>"
              + "<td>"+sales[index].price+" $</td>"
              +"</tr>";
    }
    description = description + "</table>";
  } else if(type==2) { //bookings
    var bookings = customerBookingMap[custid];
    console.log(JSON.stringify(bookings));
    description = "<table class='table'><tr><th>id</th><th>description</th><th>booked on</th></tr>"
    for(index in bookings) {
      console.log(bookings[index]);
      description = description + "<tr>"
              + "<td>"+bookings[index].id+"</td>"
              + "<td>"+bookings[index].description+"</td>"
              + "<td>"+bookings[index].bookingtime+"</td>"
              +"</tr>";
    }
    description = description + "</table>";
  } else if(type==3) { // trips
    var trips = customerTripMap[custid];
    console.log(JSON.stringify(trips));
    description = "<table class='table'><tr><th>id</th><th>car</th><th>from</th><th>to</th><th>status</th><th>total days</th><th>outsstationtrip</th></tr>"
    for(index in trips) {
      description = description + "<tr>"
              + "<td>"+trips[index].id+"</td>"
              + "<td>"+trips[index].car.name+" @ "+ trips[index].car.reg+"</td>"
              + "<td>"+trips[index].from+"</td>"
              + "<td>"+trips[index].to+"</td>"
              + "<td>"+trips[index].status+"</td>"
              + "<td>"+trips[index].totaldays+"</td>"
              + "<td>"+trips[index].outsstationtrip+"</td>"
              +"</tr>";
    }
    description = description + "</table>";
  }
  $('#customerdescription').html(description);
}

/********Trips********/
var trip = "trip";
var initialTripScheduledTable = "";
var tripBookingMap = new Object();
var tripCarMap = new Object();
var tripSaleMap = new Object();
var tripCustomerMap = new Object();
function onTripbodyload(flag) {
  initialTripScheduledTable=$('#tripscheduledtable').html();
  getTripsScheduled(flag);
}

function getTripsScheduled(flag) {
  $.ajax({
    url: serverurl+trip+"?before="+flag,
    type:'GET',
    dataType: 'json',
    success: function( json ) {
        var trHTML ="";
        var outstation = "NO";
        $('#tripscheduledtable').html("");
        $.each(json, function(i, trip) {
            if(trip.outsstationtrip==1){
              outstation = "YES";
            } else {
              outstation = "NO";
            }
            trHTML += '<tr><td><a class="btn btn-default" onclick="loadTripDetails('+trip.id+',1)">'+trip.bookingid+'</a></td>'
                    + '<td><a class="btn btn-default" onclick="loadTripDetails('+trip.id+',2)">'+trip.customer.name+'</a></td>'
                    + '<td><a class="btn btn-default" onclick="loadTripDetails('+trip.id+',3)">'+trip.car.name+' @ '+trip.car.reg+'</a></td>'
                    + '<td><a class="btn btn-default" onclick="loadTripDetails('+trip.id+',4)">'+trip.sale.price+' $ </a></td>'
                    + '<td>'+trip.from+'</td>'
                    + '<td>'+trip.to+'</td>'
                    + '<td>'+trip.status+'</td>'
                    + '<td>'+trip.totaldays+'</td>'
                    + '<td>'+outstation+'</td></tr>';
            tripBookingMap[trip.id] = trip.booking;
            tripCarMap[trip.id] = trip.car;
            tripSaleMap[trip.id] = trip.sale;
            tripCustomerMap[trip.id] = trip.customer;
        });
        console.log(JSON.stringify(tripBookingMap));
        console.log(JSON.stringify(tripCarMap));
        console.log(JSON.stringify(tripSaleMap));
        console.log(JSON.stringify(tripCustomerMap));
        $('#tripscheduledtable').html(initialTripScheduledTable+trHTML);
    }
});
}
function loadTripDetails(tripid, type) {
  var description = "";
  console.log(tripid + " "+ type);
  if(type==1) { //booking
    var booking = tripBookingMap[tripid];
    description = "<table class='table'><tr><td>Booking</td><td>"+booking.description+"</td></tr></table>";
    console.log(description);
  } else if(type==2) { //customer
    var customer = tripCustomerMap[tripid];
    console.log(JSON.stringify(customer));
    description = "<table class='table'><tr><td>Customer</td><td>"+customer.name+"</td></tr>"
                  +"<tr><td>Type</td><td>"+customer.type+"</td></tr>"
                  +"</table>";
  } else if(type==3) { // car
    var car = tripCarMap[tripid];
    console.log(JSON.stringify(car));
    description = "<table class='table'><tr><td>Car</td><td>"+car.name+"</td></tr>"
                  +"<tr><td>Reg</td><td>"+car.reg+"</td></tr>"
                  +"<tr><td>Type</td><td>"+car.type+"</td></tr>"
                  +"<tr><td>Home branch</td><td>"+car.homebranch.name+"</td></tr>"
                  +"<tr><td>Current branch</td><td>"+car.currentbranch.name+"</td></tr>"
                  +"</table>";
  } else if(type==4) { // sale
    var sale = tripSaleMap[tripid];
    console.log(JSON.stringify(sale));
    description = "<table class='table'><tr><td>Sale price</td><td>"+sale.price+"</td></tr></table>";
  }
  $('#tripdescription').html(description);
}
/*****BOOKING PAGE ****/
var branch = "branch/";
var customer = "customer";
var carhomebranch ="car/homebranch/";
var firstTime = true;
var customerId = 0;
var selectedBranch = 0;
var selectedCustomer = 0;
var selectedCustomerType = "";
var selectedCustomerName = "";
var customerMap = new Object();
var customerNameMap = new Object();
var initialCarTable = "";
var selectedCars = [];
var selectedCarsMap = new Object();
var totalCars =0;
var costperday = 0;
var totalDays = 0;
var totalCost = 0;
function onbookbodyload() {
  getBranches();
  getCustomers();
  initialCarTable=$('#carbooktable').html();
  $('#pickyDateto').datepicker({
      format: "dd/mm/yyyy"
  });
  $('#pickyDatefrom').datepicker({
      format: "dd/mm/yyyy"
  });
  var date = new Date();
  $("#pickyDatefrom").datepicker().datepicker("setDate", date);
  date.setDate(date.getDate()+1);
  $("#pickyDateto").datepicker().datepicker("setDate", date);
  //datepickerDo();
  //getBranchDetails(1);
  //console.log("I am here "+ $('#branchselector').find(":selected").val());
}
function getCustomers() {
  $.ajax({
    url: serverurl+customer,
    type:'GET',
    dataType: 'json',
    success: function( json ) {
        $.each(json, function(i, value) {
            $('#customerselector').append($('<option>').text(value.name).attr('value', value.id).attr('name', value.type));
            customerMap[value.id] = value.type;
            customerNameMap[value.id] = value.name;
        });
        getCustomerDetails();
    }
  });
}
function getCustomerDetails() {
  selectedCustomer = $('#customerselector').find(":selected").val();
  selectedCustomerType = customerMap[selectedCustomer];
  selectedCustomerName = customerNameMap[selectedCustomer];
  $("#loggeduser").html(selectedCustomerName);
}
function getBranches() {
  $.ajax({
    url: serverurl+branch,
    type:'GET',
    dataType: 'json',
    success: function( json ) {
        $.each(json, function(i, value) {
            $('#branchselector').append($('<option>').text(value.name).attr('value', value.id));
            $('#dropoffbranch').append($('<option>').text(value.name).attr('value', value.id));
        });
        if(firstTime==true) {
          selectedBranch = $('#branchselector').find(":selected").val();
          firstTime=false;
          getBranchDetails(1);
        }
    }
});
}

function getBranchDetails(option) {
  if(option==0) {
    console.log("I am here "+ $('#branchselector').find(":selected").val());
    var selectedBranchId = $('#branchselector').find(":selected").val();
    selectedBranch = selectedBranchId;
  } else {
    selectedBranchId = selectedBranch;
  }
  $.ajax({
    url: serverurl+carhomebranch+selectedBranchId,
    type:'GET',
    dataType: 'json',
    success: function( json ) {
        var trHTML ="";
        $('#carbooktable').html("");
        $.each(json, function(i, car) {
            trHTML += '<tr><td>' + '<input type="checkbox" name="carselect" id="cb'+car.id+'" onchange="addCarToBilling('+car.id+',\''+car.type+'\')" value="'+car.costperday+'"> </td><td>' + car.name + '</td><td>' + car.type + '</td><td>' + car.reg  + '</td><td>' + car.costperday + '/$ </td></tr>';
        });
        $('#carbooktable').html(initialCarTable+trHTML);
    }
});
}

function addCarToBilling(carid,cartype) {
  if($('#cb'+carid).prop('checked')==true) {
    console.log("add to bag");
    selectedCars.push(carid);
    selectedCarsMap[carid] = cartype;
    console.log("cost is "+$('#cb'+carid).val());
    costperday = costperday + parseFloat($('#cb'+carid).val());
    //selectedCarsCost.push(carid+)
  }
  else {
    var index = selectedCars.indexOf(carid);
    console.log("remove from bag "+index);
    if (index > -1) {
      selectedCars.splice(index, 1);
      delete selectedCarsMap[''+carid];
      costperday = costperday - parseFloat($('#cb'+carid).val());
    }
  }
  totalCars = selectedCars.length;
  $('#totalcars').html(totalCars);
  $('#costperday').html(costperday);
  console.log(selectedCars);
}

function computeCost() {
      var d1 = $('#pickyDatefrom').datepicker('getDate');
      var d2 = $('#pickyDateto').datepicker('getDate');
      if (d1 && d2) {
            totalDays = Math.floor((d2.getTime() - d1.getTime()) / 86400000); // ms per day
      }
      console.log("here " + totalDays);
      $('#totaldays').html(totalDays);
      if(totalDays>0) {
        totalCost = costperday * totalDays;
        $('#totalcost').html(totalCost);
        $('#checkoutbutton').prop('disabled', false);
      } else {
        $('#totalcost').html("Invalid date selection");
        $('#checkoutbutton').prop('disabled', true);
      }
}
var booking = "booking";
function checkout() {
  if(totalCost<=0) return;
  console.log("uff checkout");
  var outsstationtrip = 0;
  if($('#outstation').prop('checked')==true) outsstationtrip = 1;
  //console.log(JSON.stringify(selectedCars));
  //console.log(JSON.stringify(selectedCarsMap));
  var inputArray = [];
  for(var car in selectedCars) {
    console.log(selectedCars[car] + " "+ selectedCarsMap[selectedCars[car]]);
    var bookingObject = {
        "customerid": selectedCustomer,
        "carid": selectedCars[car],
        "branchid": selectedBranch,
        "from": $('#pickyDatefrom').datepicker('getDate'),
        "to": $('#pickyDateto').datepicker('getDate'),
        "price": totalCost,
        "totaldays": totalDays,
        "customertype": selectedCustomerType,
        "cartype": selectedCarsMap[selectedCars[car]],
        "outsstationtrip": outsstationtrip
    };
    inputArray.push(bookingObject);
  }
  console.log(JSON.stringify(inputArray));
  $.ajax({
      type: "POST",
      url: serverurl+booking,
      data: JSON.stringify(inputArray),
      contentType: "application/json; charset=utf-8",
      traditional: true,
      success: function(resultData){
          alert("Booking successful "+ resultData);
          location.reload();
      }
});
}
