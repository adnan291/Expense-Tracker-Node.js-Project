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

    const res = await axios.post("http://localhost:4000/user/login", obj);
    
    if (res.status == 200) {
      window.alert("User Logged In Successfully");
      localStorage.setItem("token", res.data.token);
      (window.location.href="./expense.html"); 
    }

    event.target.email.value = '';
    event.target.password.value = '';

  }
  catch (err) {
    if (err.response.status == 400) {
      window.alert("Password is Incorrect");
    } 
   else if (err.response.status == 404) {
      window.alert("User Not Registered");
    } else {
      window.alert("Something went wrong");
    }
  }
}