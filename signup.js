async function saveToDatabase(event) {
  
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
  
  
    } catch (err) {
      console.log(err);
    }
  }