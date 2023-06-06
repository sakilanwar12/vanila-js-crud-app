// select element from UI

const addForm = document.getElementById("add-form");
const reportsArea = document.getElementById("reportsArea");

const studentName = document.getElementById("studentName");
const roll = document.getElementById("roll");
const email = document.getElementById("email");
const number = document.getElementById("number");
const stClass = document.getElementById("class");
const updateForm = document.getElementById("update-form");


document.onload = generatesReports();

// show content

function show(content) {
  if (content === "add") {
    addForm.classList.remove("d-none");
    reportsArea.classList.add("d-none");
    updateForm.classList.add("d-none");
  } else if (content === "all") {
    reportsArea.classList.remove("d-none");
    addForm.classList.add("d-none");
    updateForm.classList.add("d-none");
    generatesReports();
  } else if (content === "update") {
    updateForm.classList.remove("d-none");
    reportsArea.classList.add("d-none");
    addForm.classList.add("d-none");
  }
}

// seeding here

function seed() {
  const data = [
    {
      id: 1,
      student_name: "Sakil Anwar",
      email: "sakil@gmail.com",
      class: 7,
      roll: 1,
      number: "01813424223",
    },
    {
      id: 2,
      student_name: "Sabbir",
      email: "sofik@gmail.com",
      class: 7,
      roll: 2,
      number: "01813424423",
    },
    {
      id: 3,
      student_name: "Tamim Iqbal",
      email: "tamim@gmail.com",
      class: 10,
      roll: 1,
      number: "01813424423",
    },
  ];
  localStorage.clear();
  localStorage.setItem("students", JSON.stringify(data));
  alert("Seeding has completed.");
  location.reload();
}


// generates reports

function generatesReports() {
  let students;
  if (localStorage.getItem("students") === null) {
    students = [];
  } else {
    const data = localStorage.getItem("students");
    students = JSON.parse(data);
  }
  let content = "";
  if (students.length > 0) {
    students.map((student) => {
      content += `
            <tr>
            <td>${student.student_name}</td>
            <td>${student.email}</td>
            <td>${student.class}</td>
            <td>${student.roll}</td>
            <td>${student.number}</td>
             <td>
              <button type="button" onclick="updateTheStudent(${student.id})">edit</button>
               <button  onclick="deleteTheStudent(${student.id})">delete</button>
             </td>
            </tr>
            `;
    });
  }

  const tbody = reportsArea.querySelector("tbody");
  tbody.innerHTML = content;
}


// form validation

const validateStudentName = (studentEl) => {
  let name = studentEl.value;
  if (name.length < 5) {
    showError(studentEl, "Your name is too short.");
    return false;
  } else if (name.length > 18) {
    showError(studentEl, "Your name is too long.");
    return false;
  } else {
    showSuccess(studentEl);
    return true;
  }
};

const validateEmail = (input) => {
  const email = input.value;
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (pattern.test(email)) {
    showSuccess(input);
    return true;
  } else {
    showError(input, "Your email is not valid.");
    return false;
  }
};

const validateClass = (input) => {
  const stClass = input.value;
  if (stClass > 12) {
    showError(input, "We have no students above 12.");
    return false;
  } else {
    showSuccess(input);
    return true;
  }
};

const showError = (element, message) => {
  const parentElement = element.parentNode;
  const p = parentElement.querySelector("p");
  p.classList.remove("d-none");
  p.innerText = message;
};

const showSuccess = (element) => {
  const parentNode = element.parentNode;
  const p = parentNode.querySelector("p");
  p.classList.add("d-none");
  parentNode.classList.add("success");
};

// form submit


addForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (
    validateStudentName(studentName) &&
    validateEmail(email) &&
    validateClass(stClass)
  ) {
    let students = getData();
    const newData = {
      id: newId(students),
      student_name: studentName.value,
      email: email.value,
      class: stClass.value,
      roll: roll.value,
      number: number.value,
    };
    students.push(newData);
    localStorage.setItem("students", JSON.stringify(students));
    resetForm(addForm);
    show("all");
  }
});

// delete the student

const deleteTheStudent = (id) => {
  if (confirm("Are you sure to delte the student?")) {
    const students = getData();
    const newStudents = students.filter((student) => student.id !== id);
    localStorage.setItem("students", JSON.stringify(newStudents));
    generatesReports();
  }
};

// delete all

function deleteAll() {
  localStorage.clear();
  location.reload();
}

// update the student


const updateTheStudent = (id) => {
  show("update");

  const students = getData();
  const student = students.find((st) => st.id === id);

  // data show in input form;

  updateForm["student_id"].value = id;
  updateForm["student_name"].value = student.student_name;
  updateForm["roll"].value = student.roll;
  updateForm["email"].value = student.email;
  updateForm["class"].value = student.class;
  updateForm["number"].value = student.number;
};


updateForm.addEventListener("submit", (e) => {
  e.preventDefault();
  id = updateForm["student_id"].value;
  const students = getData();
  // update data
  students[id - 1].student_name = updateForm["student_name"].value;
  students[id - 1].roll = updateForm["roll"].value;
  students[id - 1].email = updateForm["email"].value;
  students[id - 1].class = updateForm["class"].value;
  students[id - 1].number = updateForm["number"].value;

  localStorage.setItem("students", JSON.stringify(students));
  show("all");

});


// get data

const getData = () => {
  let students;
  if (localStorage.getItem("students") === null) {
    students = [];
  } else {
    students = JSON.parse(localStorage.getItem("students"));
  }
  return students;
};

// reset form


const resetForm = (form) => {
  const inputs = form.querySelectorAll("input");
  inputs.forEach((input) => {
    input.value = "";
  });
};


// new id

const newId = (students) => {
  return students.length + 1;
};