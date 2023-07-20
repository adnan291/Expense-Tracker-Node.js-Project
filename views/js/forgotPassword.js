async function forgotPassword(event) {
    event.preventDefault();
 
    const email = event.target.email.value;
 
    const userDetails = {
      email,
    };
 
    //console.log(userDetails);
 
    try {
      const res = await axios.post("http://localhost:4000/password/forgotpassword", userDetails);
      console.log("running");
      console.log(res);
    } catch (err) {
      console.log(err);
      window.alert("User not Registerd");
    //   document.body.innerHTML += `<div style="color:red;">${err} <div>`;
    }
  }