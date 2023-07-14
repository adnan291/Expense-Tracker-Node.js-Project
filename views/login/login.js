async function login(event) {
    const msg = document.querySelector('.msg');
    
      try {
        event.preventDefault();
        const email = event.target.email.value;
        const password = event.target.password.value;
    
        const obj = {
          email,
          password
        }
    
        const res = await axios.post("http://localhost:4000/user/login", obj)

       if (res.data.success == true) {
         window.alert("User Logged In Successfully");
        } else if (res.data.password == "incorrect") {
          window.alert("Password is Incorrect");
        } else {
          window.alert("User Not Registered");
        } 
    
    
      } catch (err) {
        console.log(err);
      }
    }