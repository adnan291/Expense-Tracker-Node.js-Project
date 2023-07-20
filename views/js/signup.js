async function signup(event) {
  const msg = document.querySelector('.msg');
  
    try {
      event.preventDefault();
      const name = event.target.name.value;
      const email = event.target.email.value;
      const password = event.target.password.value;
  
      const obj = {
        name,
        email,
        password
      }
  
      const res = await axios.post("http://localhost:4000/user/signup", obj);

      if(res.data.alreadyexisting == true){
        msg.innerHTML = '<h4>User Already Exist<h4>';

          setTimeout(() => {
            msg.innerHTML = '';
          }, 2000);
          
      }
      else{

        msg.innerHTML = '<h4>Registration Successfull<h4>';
        event.target.name.value = '';
        event.target.email.value = '';
        event.target.password.value = '';
        setTimeout(() => {
          msg.innerHTML = '';
        }, 2000).then(window.location.href="./login.html"); 
        
      }
  
  
    } catch (err) {
      console.log(err);
    }
  }