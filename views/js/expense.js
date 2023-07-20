const token = localStorage.getItem("token");
async function saveToDatabase(event) {  
 
    const msg = document.querySelector('.msg');
  
    try{
         event.preventDefault();
      const expenseAmount = event.target.expenseAmount.value;
      const description = event.target.description.value;
      const category = event.target.category.value;
  
      const obj = {
        expenseAmount,
        description,
        category
      }
  
    const res =  await axios.post("http://localhost:4000/expense/add-expense",obj,{headers:{'Authorization':token}});
  
        showNewExpenseOnScreen(res.data);
  
        msg.innerHTML = 'Expense Added Successfully';
        setTimeout(() => msg.innerHTML = '', 4000);
    
    }catch(err){
        console.log(err);
      }
    
  
    }
  
    function showNewExpenseOnScreen(expense) {
  
      document.getElementById('description').value = '';
     document.getElementById('category').value = '';
     document.getElementById('expenseAmount').value = '';
  
  
     const parentNode = document.getElementById('expenses');
     const childHTML = ` <li id=${expense.id}> ${expense.description} - ${expense.expenseAmount}
     <div class="expense-buttons">
     <input class="btn btn-outline-danger" onclick=deleteExpense('${expense.id}') value ="Delete" >
     <input class="btn btn-outline-primary" onclick=editExpenseDetails('${expense.description}','${expense.expenseAmount}','${expense.category}','${expense.id}') value ="Edit"> 
                                   </div> </li>`;
  
     parentNode.innerHTML = parentNode.innerHTML + childHTML;
   }

   function showLeaderboard() {
    const inputElement = document.createElement('button');
    inputElement.classList = 'btn leaderboard';
    inputElement.textContent = 'Show Leaderboard';
    document.getElementById('leaderboard').appendChild(inputElement);

    inputElement.onclick = async () => {
        try {
            const token = localStorage.getItem('token');
            const userLeaderBoardArray = await axios.get('http://localhost:4000/premium/showLeaderboard', {
                headers: { Authorization: token }
            });

            const leaderboardElem = document.getElementById('leaderboard');
            leaderboardElem.innerHTML = '<h1>Leader Board</h1>';
            
            // Create the table and table header
            const tableElem = document.createElement('table');
            tableElem.innerHTML = '<tr><th>Name</th><th>Total Expense</th></tr>';

            userLeaderBoardArray.data.forEach((userDetails) => {
                // Create a new row for each user
                const rowElem = document.createElement('tr');
                // Add the user's name and total expense as columns in the row
                rowElem.innerHTML = `<td>${userDetails.name}</td><td>${userDetails.total_expense}</td>`;
                // Append the row to the table
                tableElem.appendChild(rowElem);
            });

            // Append the table to the leaderboard element
            leaderboardElem.appendChild(tableElem);
        } catch (err) {
            console.log(err);
        }
    };
}



   function showPremiumMessage() {
    const goPremiumBtn = document.getElementById("goPremiumBtn");
    goPremiumBtn.remove();
    document.getElementById("message").innerHTML =  `<svg class="logoIcon" height="1em" viewBox="0 0 576 512"><path d="M309 106c11.4-7 19-19.7 19-34c0-22.1-17.9-40-40-40s-40 17.9-40 40c0 14.4 7.6 27 19 34L209.7 220.6c-9.1 18.2-32.7 23.4-48.6 10.7L72 160c5-6.7 8-15 8-24c0-22.1-17.9-40-40-40S0 113.9 0 136s17.9 40 40 40c.2 0 .5 0 .7 0L86.4 427.4c5.5 30.4 32 52.6 63 52.6H426.6c30.9 0 57.4-22.1 63-52.6L535.3 176c.2 0 .5 0 .7 0c22.1 0 40-17.9 40-40s-17.9-40-40-40s-40 17.9-40 40c0 9 3 17.3 8 24l-89.1 71.3c-15.9 12.7-39.5 7.5-48.6-10.7L309 106z"></path></svg>`;
   }

   function parseJwt (token) {
       var base64Url = token.split('.')[1];
       var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
       var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
           return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
       }).join(''));
   
       return JSON.parse(jsonPayload);
   }
   
  
   window.addEventListener("DOMContentLoaded", async () => {
    try{

      const isadmin = localStorage.getItem('isadmin')
      const decodeToken = parseJwt(token)
    
     // console.log('decodeToken-->',decodeToken)
    
      const ispremiumuser = decodeToken.ispremiumuser;
      // console.log(ispremiumuser);
      if(ispremiumuser){
        showPremiumMessage();
        showLeaderboard();
    
      }

     const res = await axios.get("http://localhost:4000/expense/get-expense",{headers:{'Authorization':token}});
  
      for(var i=0;i<res.data.length; i++){
      showNewExpenseOnScreen(res.data[i]);
      }
    } 
     catch(err){
  
      console.log(err);
    }
  })
  
  function editExpenseDetails(description,expenseAmount,category,expenseId){
  
    document.getElementById('category').value = category;
   document.getElementById('description').value = description;
   document.getElementById('expenseAmount').value = expenseAmount;
  
  
   deleteExpense(expenseId);
  
  }
  
  async function deleteExpense(expenseId) {
    try{
         await axios.delete(`http://localhost:4000/expense/delete-expense/${expenseId}`,{headers:{'Authorization':token}});
  
          removeExpenseFromScreen(expenseId);
  
      } 
        catch(err) {
        console.log(err);
      }
  
    }
  
    function removeExpenseFromScreen(expenseId) {
      const parentNode = document.getElementById('expenses');
      const childNodeToBeDeleted = document.getElementById(expenseId);
  
        parentNode.removeChild(childNodeToBeDeleted);
  
  
    }

    document.getElementById("goPremiumBtn").onclick = async function(e) {
      response = await axios.get('http://localhost:4000/purchase/premiumMembership', {headers:{'Authorization':token}})
      console.log(response)
      var options = {
        "key": response.data.key_id, // Enter the key id generated from dashboard
        "order_id": response.data.order.id, //for one timef payment
        "prefill": {
          "name": "Test User",
          "email": "test.user@example.com",
          "contact": "9999999999",
        },
    
        "handler": 
        async function (response) { 
          await axios.post("http://localhost:4000/purchase/updateTransactonStatus",{
                order_id: options.order_id,
                payment_id: response.razorpay_payment_id,
              },
              { headers: { Authorization: token } }
            )
              alert("You are a Premiem User Now Please Login Again To Enjoy Premium Features");

              window.location.href="../login/login.html";
        },
      };
    
      const rzp1 = new Razorpay(options);
      rzp1.open();
    
      e.preventDefault();
    
      rzp1.on("paynemet.failed", function (response) {
        console.log(response);
        alert("something went wrong");
      });
    
    };