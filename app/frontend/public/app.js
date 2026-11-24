const API = "/api";

/* DOM */
const tasksDiv = document.getElementById("tasks");
const categorySelect = document.getElementById("categorySelect");
const filterCategory = document.getElementById("filterCategory");
const filterStatus = document.getElementById("filterStatus");
const filterPriority = document.getElementById("filterPriority");

const focusBox = document.getElementById("focusBox");
const focusTaskEl = document.getElementById("focusTask");
const focusTimerEl = document.getElementById("focusTimer");

/* STATE */
let timer = null;
let seconds = 0;
let currentTask = null;

/* ================= AUTH ================= */

async function register() {

    await fetch(API + "/auth/register", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({
            username: ruser.value,
            email: remail.value,
            password: rpass.value
        })
    });

    alert("Compte créé ✔");
}

async function login() {

    const res = await fetch(API + "/auth/login", {

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify({

            email:lemail.value,

            password:lpass.value

        })

    });

    const data = await res.json();

    if(!data.token){

        alert(data.message || "Connexion impossible.");

        return;

    }

    localStorage.setItem("token",data.token);

    document.getElementById("auth").style.display="none";

    document.getElementById("app").style.display="block";

    document.getElementById("logoutZone").style.display="block";

    alert("Connexion réussie ✔");

    loadCategories();

    loadTasks();

}

/* ================= NOTIFICATIONS ================= */

async function enableNotifications() {

    if (!("Notification" in window)) {
        alert("Votre navigateur ne prend pas en charge les notifications.");
        return;
    }

    const permission = await Notification.requestPermission();

    if (permission === "granted") {

        new Notification("FocusTask", {
            body: "Les notifications sont maintenant activées."
        });

        alert("✔ Les notifications ont été activées avec succès.");

    } else if (permission === "denied") {

        alert(
            "Les notifications sont bloquées.\n\n" +
            "Cliquez sur le cadenas (ou l'icône à gauche de l'adresse du site), puis autorisez les notifications avant de recharger la page."
        );

    } else {

        alert("La demande d'autorisation a été ignorée.");

    }

}
/* ================= CATEGORIES ================= */

async function loadCategories() {

    const res = await fetch(API + "/categories", {
        headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
        }
    });

    const cats = await res.json();

    categorySelect.innerHTML = "";
    filterCategory.innerHTML = `<option value="">toutes catégories</option>`;

    cats.forEach(c => {

        categorySelect.innerHTML += `<option value="${c.name}">${c.name}</option>`;
        filterCategory.innerHTML += `<option value="${c.name}">${c.name}</option>`;
    });
}

async function createCategory() {

    if (newCategory.value.trim() === "") {

        alert("Veuillez saisir un nom de catégorie.");

        return;

    }

    await fetch(API + "/categories", {

        method: "POST",

        headers: {

            "Content-Type": "application/json",

            Authorization: "Bearer " + localStorage.getItem("token")

        },

        body: JSON.stringify({

            name: newCategory.value

        })

    });

    newCategory.value = "";

    loadCategories();

}

/* ================= TASKS ================= */

async function loadTasks() {

    const res = await fetch(API + "/tasks", {

        headers: {

            Authorization: "Bearer " + localStorage.getItem("token")

        }

    });

    let tasks = await res.json();

    /* FILTRES */

    if (filterCategory.value) {

        tasks = tasks.filter(t => t.category === filterCategory.value);

    }

    if (filterStatus.value) {

        tasks = tasks.filter(t => t.status === filterStatus.value);

    }

    if (filterPriority.value) {

        tasks = tasks.filter(t => t.priority === filterPriority.value);

    }

    /* TRI PAR DEADLINE */

    tasks.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

    tasksDiv.innerHTML = tasks.map(t => {

        const late = t.deadline && new Date(t.deadline) < new Date() && t.status !== "terminé";

        return `

        <div style="
            border:1px solid #ccc;
            padding:12px;
            margin:10px;
            border-radius:8px;
            background:${t.status==="terminé" ? "#d4edda" : (late ? "#ffe5e5" : "#ffffff")}
        ">

            <h3>${t.title}</h3>

            <p>${t.description || ""}</p>

            <p><strong>Deadline :</strong>
            ${
                t.deadline
                    ? new Date(t.deadline).toLocaleDateString("fr-FR")
                    : "Aucune"
            }
            </p>

            <p><strong>Priorité :</strong>
            ${
                t.priority === "high"
                    ? "Haute"
                    : t.priority === "medium"
                    ? "Moyenne"
                    : "Basse"
            }
            </p>

            <p><strong>Catégorie :</strong> ${t.category || "Aucune"}</p>

            <p><strong>Statut :</strong>
            ${
                t.status==="à faire"
                    ? "À faire"
                    : t.status==="en cours"
                    ? "En cours"
                    : "Terminée"
            }
</p>

            ${
                t.status === "à faire"
                    ? `
                        <button onclick="startTask('${t._id}')">
                            Commencer
                        </button>
                    `
                    : ""
            }

            ${
                t.status !== "terminé"
                    ? `
                        <button onclick="startFocus('${t.title}')">
                            Focus
                        </button>

                        <button onclick="setDone('${t._id}')">
                            Terminée
                        </button>
                    `
                    : `
                        <p style="color:green;font-weight:bold;">
                            ✔ Terminée
                        </p>
                    `
            }

        </div>

        `;

    }).join("");

}

async function createTask() {

    if (
        title.value.trim() === "" ||
        deadline.value === "" ||
        priority.value === "" ||
        categorySelect.value === ""
    ) {

        alert("Veuillez remplir tous les champs.");

        return;

    }

    await fetch(API + "/tasks", {

        method: "POST",

        headers: {

            "Content-Type": "application/json",

            Authorization: "Bearer " + localStorage.getItem("token")

        },

        body: JSON.stringify({

            title: title.value,

            description: desc.value,

            category: categorySelect.value,

            priority: priority.value,

            deadline: deadline.value,

            status: "à faire"

        })

    });

    title.value = "";
    desc.value = "";
    deadline.value = "";
    priority.selectedIndex = 0;
    categorySelect.selectedIndex = 0;

    alert("Tâche créée ✔");

    loadTasks();

}

async function startTask(id) {

    await fetch(API + "/tasks/" + id, {
        method: "PUT",
        headers: {
            "Content-Type":"application/json",
            Authorization:"Bearer "+localStorage.getItem("token")
        },
        body: JSON.stringify({ status: "en cours" })
    });

    loadTasks();
}

async function setDone(id) {

    await fetch(API + "/tasks/" + id, {
        method: "PUT",
        headers: {
            "Content-Type":"application/json",
            Authorization:"Bearer "+localStorage.getItem("token")
        },
        body: JSON.stringify({ status: "terminé" })
    });

    loadTasks();
}

/* ================= FOCUS ================= */

function startFocus(task) {

    currentTask = task;

    focusBox.style.display = "block";
    focusTaskEl.innerText = task;

    seconds = 0;
    clearInterval(timer);

    const interval = parseInt(document.getElementById("interval").value || 1) * 60;

    timer = setInterval(() => {

        seconds++;

        focusTimerEl.innerText =
            String(Math.floor(seconds/60)).padStart(2,"0") + ":" +
            String(seconds%60).padStart(2,"0");

        if (seconds % interval === 0 && Notification.permission === "granted") {
            new Notification("FocusTask", {
                body: "Es-tu toujours sur : " + currentTask
            });
        }

    }, 1000);
}

function stopFocus() {
    clearInterval(timer);
    focusBox.style.display = "none";
}

function logout(){

    if(confirm("Voulez-vous vraiment vous déconnecter ?")){

        localStorage.removeItem("token");

        location.reload();

    }

}

window.onload = function(){

    const token = localStorage.getItem("token");

    if(token){

        document.getElementById("auth").style.display="none";

        document.getElementById("app").style.display="block";

        document.getElementById("logoutZone").style.display="block";

        loadCategories();

        loadTasks();

    }

}