import fetch from 'node-fetch';

async function testLogin() {
  console.log("🧪 Probando login localmente en http://localhost:3000...\n");
  
  try {
    const response = await fetch('http://localhost:3000/api/trpc/auth.login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@eterbox.com',
        password: 'Admin123!'
      })
    });

    const data = await response.json();
    
    console.log("📊 Respuesta del servidor:");
    console.log("   Status:", response.status);
    console.log("   Data:", JSON.stringify(data, null, 2));
    
    if (response.ok) {
      console.log("\n✅ Login exitoso!");
    } else {
      console.log("\n❌ Login falló");
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

testLogin();
