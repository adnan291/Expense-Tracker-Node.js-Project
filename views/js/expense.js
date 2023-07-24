const token = localStorage.getItem("token");
const pagination = document.getElementById("pagination");
const parentNode = document.getElementById("expenses");
let expPerPage = localStorage.getItem("expPerPage");
if (expPerPage == null || expPerPage == undefined) {
  localStorage.setItem("expPerPage", 2);
 }

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

    async function fetchFilteredData(timePeriod) {
      try {

    
        const token = localStorage.getItem('token');
        const currentDate = new Date();
        let startDate, endDate;
    
        if (timePeriod === 'daily') {
          startDate = new Date(currentDate);
           startDate.setHours(0, 0, 0, 0);
          endDate = new Date(currentDate);
        } else if (timePeriod === 'weekly') {
          startDate = new Date(currentDate);
          startDate.setDate(currentDate.getDate() - 7);
          endDate = new Date(currentDate);
        } else if (timePeriod === 'monthly') {
          startDate = new Date(currentDate);
          startDate.setDate(1);
          endDate = new Date(currentDate);
          endDate.setMonth(currentDate.getMonth() + 1);
          endDate.setDate(0);
        }
    
        const data = {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        };
    
        const res = await axios.post(
          'http://localhost:4000/expense/get-filtered-expenses',
          data,
          { headers: { Authorization: token } }
        );
    
        return res.data;
      } catch (err) {
        console.log(err);
      }
    }
    
    // Function to show filtered expenses and incomes on the screen
    function showFilteredData(filteredData, timePeriod) {
      const parentNode = document.getElementById('dmy_expenses');
      const heading = document.createElement('h2');
      heading.textContent = `${timePeriod} Expenses`;
      parentNode.appendChild(heading);

      const ul = document.createElement('ul');
      ul.id = timePeriod;
      ul.classList = 'list1';
      parentNode.appendChild(ul);

      // console.log("showFilteredData",parentNode);
    
      filteredData.forEach((expense) => {
        showDMYExpense(expense, ul.id);
      });
    }
    
   
  
    function showNewExpenseOnScreen(expense) {
  
      document.getElementById('description').value = '';
     document.getElementById('category').value = '';
     document.getElementById('expenseAmount').value = '';
  
  
     const parentNode = document.getElementById('expenses');
     const childHTML = ` <li id=${expense.id}> ${expense.description} - ${expense.expenseAmount}
     <div class="expense-buttons">
     <button class="delete" onclick=deleteExpense('${expense.id}')><span class="text">Delete</span><span class="icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"></path></svg></span></button>
     <button class="edit" onclick=editExpenseDetails('${expense.description}','${expense.expenseAmount}','${expense.category}','${expense.id}')><span class="text">Edit</span><span class="icon"><svg class="svg" viewBox="0 0 512 512"><path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path></svg></span></button>
                                   </div></li>`;
  
                                   parentNode.innerHTML = parentNode.innerHTML + childHTML;
                                   console.log("showNewExpenseOnScreen",parentNode.parentNode);
   }

    function showDMYExpense(expense, ulid) {
  
      document.getElementById('description').value = '';
     document.getElementById('category').value = '';
     document.getElementById('expenseAmount').value = '';
  
  
     const parentNode = document.getElementById(ulid);
     const childHTML = ` <li id=${expense.id}> ${expense.description} - ${expense.expenseAmount}
     </li>`;
  
    //  <div class="expense-buttons">
    //  <button class="delete" onclick=deleteExpense('${expense.id}')><span class="text">Delete</span><span class="icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"></path></svg></span></button>
    //  <button class="edit" onclick=editExpenseDetails('${expense.description}','${expense.expenseAmount}','${expense.category}','${expense.id}')><span class="text">Edit</span><span class="icon"><svg class="svg" viewBox="0 0 512 512"><path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path></svg></button>
    //                                </div>
    
     parentNode.innerHTML = parentNode.innerHTML + childHTML;
    //  console.log(parentNode);
   }



   function showLeaderboard() {
    const inputElement = document.createElement('button');
    inputElement.classList = 'btn btn-primary';
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
   function showDownloaded() {
    const inputElement = document.createElement('button');
    inputElement.classList = 'btn btn-primary';
    inputElement.textContent = 'Show Downloaded List';
    document.getElementById('downloaded').appendChild(inputElement);

    inputElement.onclick = async () => {
        try {
            const token = localStorage.getItem('token');
            const userDownloadedArray = await axios.get('http://localhost:4000/premium/showDownloaded', {
                headers: { Authorization: token }
            });

            const downloadedElem = document.getElementById('downloaded');
            downloadedElem.innerHTML = '<h1>Downloaded List</h1>';
            
            // Create the table and table header
            const tableElem = document.createElement('table');
            tableElem.innerHTML = '<tr><th>No</th><th>URL</th><th>Downloaded At</th></tr>';

            let j = 1;
            userDownloadedArray.data.forEach((urlDetails) => {
                // Create a new row for each user
                const rowElem = document.createElement('tr');
                // Add the user's name and total expense as columns in the row
                rowElem.innerHTML = `<td>${j}</td><td><a href = "${urlDetails.url}">Click Here</a></td><td>${urlDetails.createdAt}</td>`;
                // Append the row to the table
                tableElem.appendChild(rowElem);
                j++;
            });

            // Append the table to the downloaded element
            downloadedElem.appendChild(tableElem);
        } catch (err) {
            console.log(err);
        }
    };
}

   function showDownloadBtn(){
    const downloadBtn = document.createElement('button');
    downloadBtn.classList = 'btn btn-primary';
    downloadBtn.id = 'downloadBtn';
    downloadBtn.innerHTML = '<svg class="svgIcon" viewBox="0 0 384 512" height="1em" xmlns="http://www.w3.org/2000/svg"><path d="M169.4 470.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 370.8 224 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 306.7L54.6 265.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"></path></svg>';
  document.getElementById('downloadbtn').appendChild(downloadBtn);

  document.getElementById('downloadBtn').onclick = async function () {
    await axios.get('http://localhost:4000/expense/download', {
      headers: { Authorization: token }
  }).then((response) => {
    if (response.status === 200) {
      console.log(response);
      var a = document.createElement('a');
      a.href = response.data.fileURL;
      a.download = 'myexpense.csv';
      a.click(); 
    } else {
      throw new Error("Something went wrong");
    }
  })
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

      let page = 1;

       getExpense(page, expPerPage);


    
      const ispremiumuser = decodeToken.ispremiumuser;

      if(ispremiumuser){
        showPremiumMessage();
        showLeaderboard();
        showDownloadBtn();
        showDownloaded();

        const dailyExpenses = await fetchFilteredData('daily');
        showFilteredData(dailyExpenses, 'Daily');

        const weeklyExpenses = await fetchFilteredData('weekly');
        showFilteredData(weeklyExpenses, 'Weekly');

        const monthlyExpenses = await fetchFilteredData('monthly');
        showFilteredData(monthlyExpenses, 'Monthly');
    
      }

    } 
     catch(err){
  
      console.log(err);
    }
  });

  async function getExpense(page, expPerPage) {
    try {
      console.log("expPerPage",expPerPage);
      console.log("page",page);
      const res = await axios.get(`http://localhost:4000/expense/get-expense?page=${page}&expPerPage=${expPerPage}`,{ headers: { Authorization: token } });

      parentNode.innerHTML = "";
  
      for (var i = 0; i < res.data.val.length; i++) {
        showNewExpenseOnScreen(res.data.val[i]);
      }


      showPagination( res.data.currentPage, res.data.hasNextPage, res.data.nextPage, res.data.hasPreviousPage, res.data.previousPage, res.data.lastPage)
  
    } catch (err) {
      console.log(err);
    }
  }

  function showPagination(currentPage,hasNextPage, nextPage, hasPreviousPage,  previousPage, lastPage) {

    pagination.innerHTML = " ";
    // let expPerPage = localStorage.getItem("expPerPage");

    if (hasPreviousPage) {
      const button2 = document.createElement("button");
      button2.classList.add("active");
      button2.innerHTML = previousPage;
      button2.addEventListener("click", () => getExpense(previousPage,expPerPage));
      pagination.appendChild(button2);
    }
  
    const button1 = document.createElement("button");
    button1.classList.add("active");
    button1.innerHTML = `<h3>${currentPage}<h3>`;
  
    button1.addEventListener("click", () => getExpense(currentPage,expPerPage));
    pagination.appendChild(button1);
  
    if (hasNextPage) {
      const button3 = document.createElement("button");
     // button3.classList.add("active");
      button3.innerHTML = nextPage;
      button3.addEventListener("click", () => getExpense(nextPage,expPerPage));
      pagination.appendChild(button3);
    }

    const selectPerPage = document.getElementById("selectPerPage");
      selectPerPage.innerHTML =  `<div id="pagelist">
      <label for="price">Rows Per Page</label>
      <select name="price" id="price" onchange="rowChange(event)">
        <option value='2'>2</option>
        <option value='4'>4</option>
        <option value='6'>6</option>
      </select>
    </div>`

  }

  function rowChange(event) {
    event.preventDefault()
   const rowValue = Number(event.target.value);
   localStorage.setItem("expPerPage", rowValue);
   location.reload();
 }
  
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