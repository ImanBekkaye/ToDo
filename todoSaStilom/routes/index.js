var express = require('express');
var router = express.Router();
var users=[{id:3 ,username: 'iman',pass: 'i',todoList:['iman','iman']},{id:1,username: 'safaa',pass:'s',todoList:['safa','safaa']},{id:2,username: 'tarik',pass:'t',todoList:['tarik','tarik']}];
var currentUsers=[];
var id=0;//podatak za kolacic
var user=undefined;

/* GET home page. */
router.get('/', (req, res)=>{
    if(req.cookies.kolac){
        deleteUserById(req.cookies.kolac);
        res.clearCookie("kolac");
    }

    res.render('index');

});

/*GET register page-forma, a ako postoji kolacic znaci da je vec ulogovan i ponudim dugme za logout i redirec na register*/
router.get('/register', (req, res)=>{
  if(req.cookies.kolac){
    res.render('allreadyLoged');
  }else{
    res.render('register');
  }

});
/*POST register page- kad se pravilno popuni forma kreiram kolacic i redirect na wellcome page*/

router.post('/register', (req, res)=>{
    id= Math.random();
    var obj={
        id: users.length+1,
        username: req.body.username,
        pass: req.body.pass,
        todoList: []
    }
    //
    if(authenticationRegister(obj)){

        res.cookie('kolac',id);

        users.push(obj);

        currentUsers.push({id:id,userId: obj.id});

        console.log('dodan u usere u bazu i u curentUser dodan novi obj i kreiran kolacic');


        res.render('wellcome');
    }else{
        res.render('allreadyExist');
    }

});
/*GET login page-forma, a ako ima kolacic izbaci da ste vec ulogovani i ponudi dugme logout i redirect na home*/
router.get('/login', (req, res)=>{
    console.log('provjera dal ima kolac',req.cookies.kolac)
    if(req.cookies.kolac){
        res.render('allreadyLoged');
    }else{
        res.render('login');
    }

});
/*POST login page- kad se pravilno popuni forma kreiram kolacic i otvara se profil(todolista) od korisnika ciji je id u kolacicu*/
router.post('/login', (req, res)=>{
    //todo: provjera dal je prazno i ostalo sta treba uz to
    id= Math.random();
    var obj={

        username: req.body.username,
        pass: req.body.pass,
        todoList: []
    }
    var userId=authenticationLogin(obj);
    if(userId){

      res.cookie('kolac',id);
      console.log('kreirao se kolac');
      currentUsers.push({id: id, userId: userId});
      res.redirect('/profile');
    }else{
      res.render('dontExist');
    }


});
//prima id kolacica i vraca id usera  koji je vezan za taj kolacic
function getUserIdById(id){
  var obj=currentUsers.find(el=>{
    if( el.id == id ) {
        return true;
    }
    else {
        return false;
    }
  })
    if(obj!=undefined){return obj.userId }else{
        console.log('Nije pronaden userid ');
    }
}


/*GET profile page- ako ima kolacic prikazuje profil od usera ciji je id u kolacicu ako nema kolacic poruka da niste prijavljeni + button na home page*/
router.get('/profile', (req, res)=>{
    console.log('provjerimo dal ima kolac->',req.cookies.kolac);
    if(req.cookies.kolac){
      userId= getUserIdById(req.cookies.kolac);
      user= getUserByUserId(userId);
      console.log('korisnikkk',user);
      res.render('profile',{data: user});
    }else{
        res.render('noProfile');
    }

});
/*POST profile page- dodajemo podatke u listu korisnika ciji je id u kolacicu*/
router.post('/profile', (req, res)=>{
    task = req.body.task;
    if(task!=''){
      userId=getUserIdById(req.cookies.kolac);
      user=getUserByUserId(userId);
      user.todoList.push(task);
    }
    res.redirect('profile');

});






//prima id usera i vraca korisnika iz baze
function getUserByUserId(userId){
    var existingUser = users.find(el => {
        if( el.id == userId  ) {
        return true;
    }
else {
        return false;
    }
})
    if (existingUser!=undefined){
        return existingUser;
    }return false;//nije pronaden user s userId

}
//prima id kolacica i brise usera uz currentUsers
function deleteUserById(id){
    var obj = currentUsers.find(el => {
        if( el.id == id ) {
        return true;
    }
else {
        return false;
    }
})
    if (obj!=undefined){
        console.log('curent users prije brisanja',currentUsers);
        var index = currentUsers.indexOf(obj);
        currentUsers.splice(index,1);
        console.log('curent users poslije brisanja',currentUsers);
        return true;
    }return false;


}

function authenticationRegister(obj){
    var existingUser = users.find(el => {
        if( el.username == obj.username && el.pass == obj.pass ) {
        return true;
    }
else {
        return false;
    }
})
    if (existingUser!=undefined){
        return false;
    }return true ;
}
//na osnovu username i pass vrati userId
function authenticationLogin(obj){
    var existingUser = users.find(el => {
        if( el.username == obj.username && el.pass == obj.pass ) {
        return true;
    }
else {
        return false;
    }
})
    if (existingUser!=undefined){

        return existingUser.id;
    }return false;
}
module.exports = router;
