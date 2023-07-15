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
    console.log(res.status);
    if (res.status == 200) {
      window.alert("User Logged In Successfully");
    }

    event.target.email.value = '';
    event.target.password.value = '';

  }
  catch (err) {
    console.log(err.message);
    if (err.response.status == 401) {
      window.alert("Password is Incorrect");
    } else {
      window.alert("User Not Registered");
    }
  }
}