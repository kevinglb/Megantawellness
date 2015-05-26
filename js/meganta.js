/*store email in a html local database*/

var meganta = {};
meganta.webdb = {};
meganta.webdb.db = null;

meganta.webdb.open = function() {
  var dbSize = 5 * 1024 * 1024; // 5MB
  meganta.webdb.db = openDatabase("Email", "1.0", "Email List", dbSize);
}

meganta.webdb.createTable = function() {
  var db = meganta.webdb.db;
  db.transaction(function(tx) {
    tx.executeSql("CREATE TABLE IF NOT EXISTS email(ID INTEGER PRIMARY KEY ASC, email TEXT, added_on DATETIME)", []);
  });
}

meganta.webdb.addEmail = function(email) {
  var db = meganta.webdb.db;
  db.transaction(function(tx){
    var addedOn = new Date();
    tx.executeSql("INSERT INTO Email(email, added_on) VALUES (?,?)",
        [email, addedOn],
        meganta.webdb.onSuccess,
        meganta.webdb.onError);
   });
}

meganta.webdb.onError = function(tx, e) {
  alert("There has been an error: " + e.message);
}

meganta.webdb.onSuccess = function(tx, r) {
  // re-render the data.
  meganta.webdb.getAllEmail(loadEmailList);
}


meganta.webdb.getAllEmail = function(renderFunc) {
  var db = meganta.webdb.db;
  db.transaction(function(tx) {
    tx.executeSql("SELECT * FROM email", [], renderFunc,
        meganta.webdb.onError);
  });
}

meganta.webdb.deleteEmail = function(id) {
  var db = meganta.webdb.db;
  db.transaction(function(tx){
    tx.executeSql("DELETE FROM email WHERE ID=?", [id],
        meganta.webdb.onSuccess,
        meganta.webdb.onError);
    });
}

function loadEmailList(tx, rs) {
  var rowOutput = "";
  var emailItems = document.getElementById("emailItems");
  for (var i=0; i < rs.rows.length; i++) {
    rowOutput += renderEmail(rs.rows.item(i));
  }
  console(rowOutput);
  //emailItems.innerHTML = rowOutput;
}

function renderEmail(row) {
  return "<li>" + row.email  + " [<a href='javascript:void(0);'  onclick='meganta.webdb.deleteEmail(" + row.ID +");'>Delete</a>]</li>";
}

function init() {
  meganta.webdb.open();
  meganta.webdb.createTable();
  meganta.webdb.getAllEmail(loadEmailList);
}

function addEmail() {
  var email = $('#sub_email').val();
  console.log(email);
  meganta.webdb.addEmail(email);
  email.val('');
}