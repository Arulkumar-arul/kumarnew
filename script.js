let allEmployees = [];
let displayedEmployees = [];

// 14. Date & Time - new Date()
function showDateTime(){
  const d = new Date();
  const day = d.getDate();
  const month = d.toLocaleString('default',{month:'long'});
  const year = d.getFullYear();
  let h = d.getHours(); let m = d.getMinutes();
  let ampm = h >=12? 'PM':'AM'; h = h%12 || 12;
  document.getElementById('dateTime').innerText = `Today: ${day} ${month} ${year} | Time: ${h}:${String(m).padStart(2,'0')} ${ampm}`;
}
showDateTime();

// 3. fetchEmployees - fetch() + Promise +.then().catch().finally()
function fetchEmployees(){
  document.getElementById('loadingMsg').innerText = "Loading employees...";
  fetch('https://dummyjson.com/users')
   .then(res => res.json()) // API -> JSON
   .then(data => {
      // Store inside array - Objects + Arrays
      allEmployees = data.users.map(u => ({
        id: u.id,
        name: `${u.firstName} ${u.lastName}`,
        age: u.age,
        email: u.email,
        phone: u.phone,
        department: mapDept(u.company.department), // normalize
        originalDept: u.company.department,
        image: u.image,
        salary: Math.floor(Math.random()*50000)+40000
      }));
      displayedEmployees = [...allEmployees];
      document.getElementById('loadingMsg').innerText = "Employee data loaded successfully.";
      displayEmployees();
      updateEmployeeCount();
      calculateSalary();
      findHighestSalary();
    })
   .catch(err => {
      document.getElementById('loadingMsg').innerText = "Unable to load employee data. Please try again.";
    })
   .finally(()=> {
      setTimeout(()=> document.getElementById('loadingMsg').style.display='none',2000);
    });
}

function mapDept(apiDept){
  if(['Engineering','Research and Development','Product Management'].includes(apiDept)) return 'IT';
  if(['Human Resources'].includes(apiDept)) return 'HR';
  if(['Accounting','Finance','Business Development'].includes(apiDept)) return 'Finance';
  if(['Marketing','Sales','Support'].includes(apiDept)) return 'Marketing';
  return apiDept;
}

// 3. displayEmployees - forEach + createElement + innerHTML
function displayEmployees(){
  const container = document.getElementById('employeeContainer');
  container.innerHTML = "";
  displayedEmployees.forEach(emp => {
    const card = document.createElement('div');
    card.className = "card";
    card.innerHTML = `
      <img src="${emp.image}">
      <h3>${emp.name}</h3>
      <p>Age: ${emp.age}</p>
      <p>Email: ${emp.email}</p>
      <p>Department: ${emp.department}</p>
      <p>Phone: ${emp.phone}</p>
      <p>Salary: ₹${emp.salary.toLocaleString()}</p>
      <button onclick="deleteEmployee(${emp.id})">Delete</button>
    `;
    container.appendChild(card);
  });
}

// 4. Search - filter() + includes()
function searchEmployees(){
  const q = document.getElementById('searchInput').value.toLowerCase();
  displayedEmployees = allEmployees.filter(emp => emp.name.toLowerCase().includes(q));
  displayEmployees();
  updateEmployeeCount();
  calculateSalary();
  findHighestSalary();
}
document.getElementById('searchInput').addEventListener('input', searchEmployees);

// 5. Department Filter - filter() + if + event listener
function filterDepartment(dept){
  if(dept === 'All'){
    displayedEmployees = [...allEmployees];
  } else {
    displayedEmployees = allEmployees.filter(emp => {
      if(emp.department === dept) return true;
      else return false;
    });
  }
  displayEmployees();
  updateEmployeeCount();
  calculateSalary();
  findHighestSalary();
}

// 6. Count - array.length
function updateEmployeeCount(){
  document.getElementById('countBox').innerText = `Employee Count: ${displayedEmployees.length}`;
}

// 11. Validation - if else + comparison + logical
function validateEmployee(name, age, email, dept){
  if(name === "") return "❌ Please enter employee name";
  else if(!age || age <= 18) return "❌ Age must be greater than 18";
  else if(email === "") return "❌ Please enter email";
  else if(dept === "") return "❌ Department must be selected";
  else return "";
}

// 7. Add
function addEmployee(){
  const name = document.getElementById('empName').value.trim();
  const age = parseInt(document.getElementById('empAge').value);
  const email = document.getElementById('empEmail').value.trim();
  const dept = document.getElementById('empDept').value;
  const salary = parseInt(document.getElementById('empSalary').value) || 50000;

  const error = validateEmployee(name, age, email, dept);
  if(error){
    document.getElementById('errorMsg').innerText = error;
    return;
  }
  document.getElementById('errorMsg').innerText = "";

  const obj = { id: Date.now(), name, age, email, department: dept, salary, phone:"XXXXXXXXXX", image:`https://i.pravatar.cc/150?u=${Date.now()}` };
  allEmployees.push(obj);
  displayedEmployees = [...allEmployees];
  displayEmployees();
  updateEmployeeCount();
  calculateSalary();
  findHighestSalary();
  clearForm();
}

function clearForm(){
  document.getElementById('empName').value="";
  document.getElementById('empAge').value="";
  document.getElementById('empEmail').value="";
  document.getElementById('empDept').value="";
  document.getElementById('empSalary').value="";
}

// 8. Delete - filter()
function deleteEmployee(id){
  allEmployees = allEmployees.filter(emp => emp.id!== id);
  displayedEmployees = displayedEmployees.filter(emp => emp.id!== id);
  displayEmployees();
  updateEmployeeCount();
  calculateSalary();
  findHighestSalary();
}

// 9. Salary - reduce()
function calculateSalary(){
  const total = displayedEmployees.reduce((sum, emp) => sum + emp.salary, 0);
  const avg = displayedEmployees.length? Math.round(total / displayedEmployees.length) : 0;
  document.getElementById('salaryBox').innerText = `Total Employees: ${displayedEmployees.length} | Total Salary: ₹${total.toLocaleString()} | Average Salary: ₹${avg.toLocaleString()}`;
}

// 10. Highest - reduce()
function findHighestSalary(){
  if(displayedEmployees.length === 0){
    document.getElementById('highestBox').innerText = "Highest Paid Employee: None";
    return;
  }
  const high = displayedEmployees.reduce((max, curr) => curr.salary > max.salary? curr : max);
  document.getElementById('highestBox').innerText = `Highest Paid Employee - Name: ${high.name} | Salary: ₹${high.salary.toLocaleString()}`;
}

// 13. Sort - sort()
function sortEmployees(type){
  if(type === 'nameAsc') displayedEmployees.sort((a,b)=> a.name.localeCompare(b.name));
  if(type === 'nameDesc') displayedEmployees.sort((a,b)=> b.name.localeCompare(a.name));
  if(type === 'age') displayedEmployees.sort((a,b)=> a.age - b.age);
  if(type === 'salary') displayedEmployees.sort((a,b)=> b.salary - a.salary);
  displayEmployees();
}

fetchEmployees();