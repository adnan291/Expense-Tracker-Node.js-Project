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
      console.log(res.data);

      if(res.status === 200){
        msg.innerHTML = '<h4>User Already Exist<h4>';

    setTimeout(() => {
      msg.innerHTML = '';
    }, 2000);
      }
      else{
        window.location.href="../login/login.html"  
        console.log('login')

      }
  
  
    } catch (err) {
      console.log(err);
    }
  }