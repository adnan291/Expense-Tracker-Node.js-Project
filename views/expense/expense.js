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
  
   window.addEventListener("DOMContentLoaded", async () => {
    try{

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
    
        handler: async function (response) {
          await axios
            .post(
              "http://localhost:4000/purchase/updateTransactonStatus",
              {
                order_id: options.order_id,
                payment_id: response.razorpay_payment_id,
              },
              { headers: { Authorization: token } }
            )
            .then(() => {
              alert("You are a Premiem User Now");
            });
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