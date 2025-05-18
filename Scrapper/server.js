const express = require("express");
const { chromium } = require("playwright"); // Requerimos Playwright
const cors = require("cors"); // CORS para permitir solicitudes desde otros dominios

const app = express();
const port = 3002;

app.use(cors()); // Habilitar CORS para todas las rutas

app.get("/scrape-product", async (req, res) => {
  const productUrl = req.query.url;

  if (!productUrl) {
    return res.status(400).send("Falta la URL del producto");
  }

  try {
    // Iniciar el navegador de Playwright (sin headless para ver el proceso)
    const browser = await chromium.launch({ headless: false });

    // Crear un contexto de navegador y configurar el User-Agent en el contexto
    const context = await browser.newContext({
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36",
    });

    // Crear una nueva página en el contexto
    const page = await context.newPage();

    // Navegar a la URL del producto
    await page.goto(productUrl, { waitUntil: "domcontentloaded" });

    // Esperar a que un selector específico esté presente en la página (ajusta según sea necesario)
    await page.waitForSelector("pre"); // Esto es para asegurarnos que el contenido del producto se cargue

    // Tomar una captura de pantalla para verificar visualmente
    await page.screenshot({ path: "example.png" });

    // Obtener el contenido en formato JSON de la página
    const jsonString = await page.$eval("pre", (el) => el.textContent);

    // Cerrar el navegador
    await browser.close();

    // Devolver el contenido JSON parseado
    const jsonData = JSON.parse(jsonString); // Parsea el JSON obtenido
    // Extraer el campo "data" del objeto recibido
      const productData = JSON.parse(jsonData.queryData[0].data);
    res.json(productData.product); // Devolver el JSON como respuesta
  } catch (error) {
    console.error("Error al obtener los datos del producto:", error.message);
    res.status(500).send("Error al obtener los datos del producto");
  }
});

// Levantar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
