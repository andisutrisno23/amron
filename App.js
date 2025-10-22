// --- DATA SIMPANAN ---
let users = JSON.parse(localStorage.getItem("users")) || [
  { username: "admin", password: "admin123", role: "admin" }
];
let gallery = JSON.parse(localStorage.getItem("gallery")) || [];
let members = JSON.parse(localStorage.getItem("members")) || [];
let currentUser = JSON.parse(sessionStorage.getItem("currentUser")) || null;

// --- LOGIN ---
function login() {
  const u = document.getElementById("username").value;
  const p = document.getElementById("password").value;
  const user = users.find(x => x.username === u && x.password === p);
  
  if (!user) return alert("Username atau password salah!");

  sessionStorage.setItem("currentUser", JSON.stringify(user));
  if (user.role === "admin") location.href = "dashboard_admin.html";
  else location.href = "dashboard_anggota.html";
}

// --- REGISTER ---
function register() {
  const username = prompt("Masukkan username:");
  const password = prompt("Masukkan password:");
  if (!username || !password) return alert("Isi data dengan benar!");

  users.push({ username, password, role: "anggota" });
  localStorage.setItem("users", JSON.stringify(users));
  alert("Akun berhasil dibuat! Silakan login.");
}

// --- LOGOUT ---
function logout() {
  sessionStorage.clear();
  location.href = "login.html";
}

// --- ADMIN: Tambah Anggota ---
function addMember() {
  const name = document.getElementById("newName").value;
  const visi = document.getElementById("newVisi").value;
  if (!name) return alert("Nama tidak boleh kosong");

  members.push({ name, visi, foto: "default.jpg" });
  localStorage.setItem("members", JSON.stringify(members));
  alert("Anggota ditambahkan!");
  location.reload();
}

// --- ADMIN: Upload Galeri ---
function uploadGallery() {
  const input = document.getElementById("galleryUpload");
  for (let file of input.files) {
    const reader = new FileReader();
    reader.onload = (e) => {
      gallery.push(e.target.result);
      localStorage.setItem("gallery", JSON.stringify(gallery));
      alert("Foto berhasil diupload!");
    };
    reader.readAsDataURL(file);
  }
}

// --- TAMPILKAN GALERI & ANGGOTA DI INDEX ---
window.onload = () => {
  const galeriContainer = document.getElementById("galeri-container");
  if (galeriContainer) {
    gallery.forEach(img => {
      const image = document.createElement("img");
      image.src = img;
      galeriContainer.appendChild(image);
    });
  }

  const anggotaContainer = document.getElementById("anggota-container");
  if (anggotaContainer) {
    members.forEach(m => {
      const div = document.createElement("div");
      div.innerHTML = `<img src="${m.foto}" alt="${m.name}"><h4>${m.name}</h4><p>${m.visi}</p>`;
      anggotaContainer.appendChild(div);
    });
  }
};

// --- ANGGOTA: Edit Profil ---
function saveProfile() {
  const name = document.getElementById("editName").value;
  const visi = document.getElementById("editVisi").value;
  const fotoInput = document.getElementById("editFoto");

  const user = JSON.parse(sessionStorage.getItem("currentUser"));
  if (!user) return alert("Login dulu!");

  const reader = new FileReader();
  reader.onload = () => {
    const foto = fotoInput.files.length ? reader.result : "default.jpg";
    members.push({ name, visi, foto });
    localStorage.setItem("members", JSON.stringify(members));
    alert("Profil berhasil disimpan!");
  };
  if (fotoInput.files.length) reader.readAsDataURL(fotoInput.files[0]);
  else reader.onload();
}
