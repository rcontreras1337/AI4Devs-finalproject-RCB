import { Injectable, ElementRef, Renderer2, RendererFactory2 } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { CartSummary, ProductCart } from '@core/models/productCart.model';

@Injectable({
  providedIn: 'root'
})
export class PdfGeneratorService {
  private renderer: Renderer2;
  private modalElement: HTMLElement | null = null;
  private resolveUserNamePromise: ((value: string) => void) | null = null;

  constructor(
    private toast: ToastrService,
    private rendererFactory: RendererFactory2
  ) {
    this.renderer = this.rendererFactory.createRenderer(null, null);
  }

  // Configuración para el PDF
  private readonly config = {
    MAX_ITEMS_PER_PAGE: 5,
    MAX_ITEMS_LAST_PAGE: 4,
    MARGIN: 10,
    BACKGROUND_COLOR: '#0a191d',
    RGB_BACKGROUND: [10, 25, 29],
    BACKGROUND_RED: '#ff183b',
  };

  /**
   * Genera y descarga un PDF con la cotización
   * @param products Lista de productos en el carrito
   * @param cartSummary Resumen de totales del carrito
   * @param nombreUsuario Nombre del usuario para quien es la cotización
   * @returns Promise<void>
   */
  async generateShoppingPDF(products: ProductCart[], cartSummary: CartSummary, nombreUsuario?: string): Promise<void> {
    if (products.length === 0) {
      this.toast.warning('No hay productos para descargar', 'HypeV4ult');
      return;
    }

    if (!nombreUsuario) {
      // Obtener el nombre del usuario mediante un modal de Bootstrap
      try {
        nombreUsuario = await this.showUserNameModal();
      } catch (error) {
        // El usuario canceló la operación
        return;
      }
    }

    this.toast.info('Generando PDF, por favor espera...', 'HypeV4ult');

    try {
      // Crear el documento PDF
      const pdf = this.createPdfDocument();
      const fileName = this.generateFileName(nombreUsuario);

      // Obtener dimensiones del documento
      const dimensions = this.getPdfDimensions(pdf);

      // Configurar primera página
      this.setPageBackground(pdf, dimensions);

      // Variables para el control de paginación
      const paginationControl: {
        currentPage: number;
        yPosition: number;
        itemsInCurrentPage: number;
        productLinks: Array<{url: string, name: string, index: number, position?: {x: number, y: number, width: number, height: number, page: number}}>;
      } = {
        currentPage: 1,
        yPosition: this.config.MARGIN,
        itemsInCurrentPage: 0,
        productLinks: [] // Para almacenar los enlaces de cada producto
      };

      // Generar y añadir el encabezado
      const headerCanvas = await this.generateHeaderCanvas(nombreUsuario);
      this.addImageToPdf(
        pdf,
        headerCanvas,
        paginationControl,
        dimensions.contentWidth,
        this.config.MARGIN
      );
      paginationControl.yPosition += 10; // Espacio después del encabezado

      // Guarda las URLs de los productos para añadir enlaces después
      const productLinks = products.map((product, index) => {
        // Verificar URLs para debugging
        const url = product.urlOriginal || product.link || '#';
        console.log(`Producto #${index + 1}: "${product.productName}" - URL: ${url}`);

        return {
          url: url,
          name: product.productName,
          index
        };
      });
      paginationControl.productLinks = productLinks;

      // Generar canvases para productos
      const productCanvases = await this.generateProductCanvases(products);

      // Calcular páginas necesarias
      const totalProducts = productCanvases.length;
      const totalPagesNeeded = this.calculateTotalPages(totalProducts);

      // Crear páginas para los productos
      this.addProductsToPdf(
        pdf,
        productCanvases,
        paginationControl,
        dimensions,
        totalPagesNeeded,
        products
      );

      // Generar y añadir el resumen
      const summaryCanvas = await this.generateSummaryCanvas(cartSummary);

      // Verificar si el resumen cabe en la página actual
      if (paginationControl.itemsInCurrentPage >= this.config.MAX_ITEMS_LAST_PAGE ||
          paginationControl.currentPage < totalPagesNeeded) {
        this.addNewPage(pdf, paginationControl, dimensions);
      }

      this.addImageToPdf(
        pdf,
        summaryCanvas,
        paginationControl,
        dimensions.contentWidth,
        this.config.MARGIN
      );

      // Añadir enlaces clickeables a los productos
      this.addLinksToProducts(pdf, paginationControl.productLinks);

      // Guardar el PDF
      pdf.save(fileName);
      this.toast.success('PDF descargado con éxito', 'HypeV4ult');
    } catch (error) {
      console.error('Error al generar el PDF:', error);
      this.toast.error('Error al generar el PDF', 'HypeV4ult');
    }
  }

  /**
   * Muestra un modal Bootstrap para solicitar el nombre del usuario
   * @returns Promise<string> Nombre del usuario
   */
  private showUserNameModal(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.resolveUserNamePromise = resolve;

      // Crear el modal
      const modal = this.renderer.createElement('div');
      this.renderer.setAttribute(modal, 'class', 'modal fade show');
      this.renderer.setAttribute(modal, 'id', 'userNameModal');
      this.renderer.setAttribute(modal, 'tabindex', '-1');
      this.renderer.setAttribute(modal, 'role', 'dialog');
      this.renderer.setAttribute(modal, 'aria-labelledby', 'modalLabel');
      this.renderer.setStyle(modal, 'display', 'block');
      this.renderer.setStyle(modal, 'background-color', 'rgba(0,0,0,0.5)');

      // Estructura del modal con Bootstrap
      modal.innerHTML = `
        <div class="modal-dialog modal-dialog-centered" role="document">
          <div class="modal-content" style="background-color: var(--color-3); color: var(--color-5); border: none;">
            <div class="modal-header" style="border-bottom: 1px solid var(--color-2);">
              <h5 class="modal-title" id="modalLabel">Personalizar Cotización</h5>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <div class="mb-3">
                <label for="userName" class="form-label">¿Para quién es esta cotización?</label>
                <input type="text" class="form-control" id="userName" placeholder="Nombre del cliente"
                  style="background-color: var(--color-3); color: var(--color-5); border-color: var(--color-2);">
              </div>
            </div>
            <div class="modal-footer" style="border-top: 1px solid var(--color-2);">
              <button type="button" class="btn btn-outline-danger" id="cancelButton">Cancelar</button>
              <button type="button" class="btn btn-success" id="confirmButton">Generar PDF</button>
            </div>
          </div>
        </div>
      `;

      // Añadir el modal al body
      this.renderer.appendChild(document.body, modal);
      this.modalElement = modal;

      // Configurar eventos
      const confirmButton = modal.querySelector('#confirmButton');
      const cancelButton = modal.querySelector('#cancelButton');
      const closeButton = modal.querySelector('.btn-close');
      const inputField = modal.querySelector('#userName') as HTMLInputElement;

      // Enfocar el campo de entrada
      inputField.focus();

      // Confirmar al pulsar Enter
      inputField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.handleConfirm();
        }
      });

      confirmButton?.addEventListener('click', () => {
        this.handleConfirm();
      });

      cancelButton?.addEventListener('click', () => {
        this.handleCancel(reject);
      });

      closeButton?.addEventListener('click', () => {
        this.handleCancel(reject);
      });
    });
  }

  /**
   * Maneja la confirmación del modal
   */
  private handleConfirm(): void {
    if (this.modalElement && this.resolveUserNamePromise) {
      const inputField = this.modalElement.querySelector('#userName') as HTMLInputElement;
      const userName = inputField.value.trim() || 'Cliente';

      // Resolver la promesa con el nombre
      this.resolveUserNamePromise(userName);

      // Eliminar el modal
      this.removeModal();
    }
  }

  /**
   * Maneja la cancelación del modal
   */
  private handleCancel(reject: (reason?: any) => void): void {
    reject('Usuario canceló la operación');
    this.removeModal();
  }

  /**
   * Elimina el modal del DOM
   */
  private removeModal(): void {
    if (this.modalElement) {
      this.renderer.removeChild(document.body, this.modalElement);
      this.modalElement = null;
      this.resolveUserNamePromise = null;
    }
  }

  /**
   * Crea un nuevo documento PDF
   */
  private createPdfDocument(): jspdf {
    return new jspdf({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
  }

  /**
   * Genera un nombre de archivo único con fecha y hora
   */
  private generateFileName(nombreUsuario: string): string {
    const now = new Date();
    const dateTimeString = `${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}_${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}${now.getSeconds().toString().padStart(2, '0')}`;
    return `Cotizacion_HypeV4ult_${this.generateFileNameWithSpaces(nombreUsuario)}_${dateTimeString}.pdf`;
  }

  // Funcion para generar el nombre de archivo con el nombre del usuario con los espacios reemplazados por guiones
  private generateFileNameWithSpaces(nombreUsuario: string): string {
    return nombreUsuario.replace(/\s+/g, '_');
  }

  /**
   * Obtiene las dimensiones del documento PDF
   */
  private getPdfDimensions(pdf: jspdf): { pdfWidth: number, pdfHeight: number, contentWidth: number } {
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const contentWidth = pdfWidth - (this.config.MARGIN * 2);

    return { pdfWidth, pdfHeight, contentWidth };
  }

  /**
   * Establece el fondo de la página
   */
  private setPageBackground(pdf: jspdf, dimensions: { pdfWidth: number, pdfHeight: number }): void {
    pdf.setFillColor(this.config.RGB_BACKGROUND[0], this.config.RGB_BACKGROUND[1], this.config.RGB_BACKGROUND[2]);
    pdf.rect(0, 0, dimensions.pdfWidth, dimensions.pdfHeight, 'F');
  }

  /**
   * Genera el encabezado del PDF
   */
  private async generateHeaderCanvas(nombreUsuario: string): Promise<HTMLCanvasElement> {
    const headerElement = document.createElement('div');
    headerElement.style.backgroundColor = this.config.BACKGROUND_COLOR;
    headerElement.style.color = 'white';
    headerElement.style.padding = '15px';
    headerElement.style.width = '550px';
    headerElement.style.textAlign = 'center';
    headerElement.style.fontFamily = 'var(--font-family-1)';

    const now = new Date();
    headerElement.innerHTML = `
      <div style="font-family: 'Teko', sans-serif; text-align: center;">
        <img src="assets/hypeV4ault.png" alt="HypeV4ult Logo" style="width: 90px; height: auto; margin: 0 auto 0px auto; display: block;">
        <h1 style="margin: 0 0 0px 0; color: white; font-family: 'Teko', sans-serif; font-size: 28px;">Cotización HypeV4ult</h1>
        <p style="margin: 0; color: white; font-family: 'Teko', sans-serif; font-size: 16px;">${nombreUsuario} - ${now.toLocaleDateString()}</p>
      </div>
    `;

    document.body.appendChild(headerElement);

    try {
      const canvas = await html2canvas(headerElement, this.getHtml2CanvasOptions());
      return canvas;
    } finally {
      document.body.removeChild(headerElement);
    }
  }

  /**
   * Genera los canvas para cada producto
   */
  private async generateProductCanvases(products: ProductCart[]): Promise<HTMLCanvasElement[]> {
    console.log(`Generando canvases para ${products.length} productos`);
    const promises = products.map((product, index) => this.generateProductCanvas(product, index));
    const results = await Promise.all(promises);

    return results
      .sort((a, b) => a.index - b.index)
      .map(result => result.canvas);
  }

  /**
   * Genera un canvas para un producto específico
   */
  private async generateProductCanvas(product: ProductCart, index: number): Promise<{ index: number, canvas: HTMLCanvasElement }> {
    const productElement = document.createElement('div');
    productElement.style.backgroundColor = this.config.BACKGROUND_COLOR;
    productElement.style.color = 'white';
    productElement.style.padding = '15px';
    productElement.style.borderRadius = '10px';
    productElement.style.marginBottom = '10px';
    productElement.style.width = '550px';
    productElement.style.fontFamily = 'var(--font-family-1)';

    // URL para el enlace, usar la urlOriginal si existe, sino usar el link del producto
    const productUrl = product.urlOriginal || product.link || '#';
    console.log(`Canvas producto #${index + 1}: "${product.productName}" - URL: ${productUrl}`);

    productElement.innerHTML = `
      <div style="display: flex; align-items: center; font-family: 'Teko', sans-serif;">
        <img src="${product.urlImagen}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px; margin-right: 15px;">
        <div style="flex-grow: 1;">
          <h3 style="margin: 0; color: white; font-family: 'Teko', sans-serif;">
            <a href="${productUrl}" style="color: white; text-decoration: underline; font-family: 'Teko', sans-serif;" target="_blank">${product.productName}</a>
          </h3>
          <p style="margin: 5px 0; color: white; font-family: 'Teko', sans-serif;">Talla: ${product.selectedSize} - Color: ${product.color}</p>
          <p style="margin: 5px 0; color: white; font-family: 'Teko', sans-serif;">Cantidad: ${product.quantityAddedCart}</p>
        </div>
        <div style="text-align: right;">
          <p style="margin: 0; color: white; font-family: 'Teko', sans-serif;">Precio original: <span style="text-decoration: line-through;">${product.price.toLocaleString('es-CL', {style: 'currency', currency: 'CLP'})}</span></p>
          <p style="margin: 0; color: white; font-family: 'Teko', sans-serif;"><strong>Precio Hype: ${product.precioHype.toLocaleString('es-CL', {style: 'currency', currency: 'CLP'})}</strong></p>
          <p style="margin: 0; color: ${this.config.BACKGROUND_RED}; font-family: 'Teko', sans-serif;">Ahorro: ${(product.price - product.precioHype).toLocaleString('es-CL', {style: 'currency', currency: 'CLP'})}</p>
        </div>
      </div>
    `;

    document.body.appendChild(productElement);

    try {
      const canvas = await html2canvas(productElement, this.getHtml2CanvasOptions());
      return { index, canvas };
    } finally {
      document.body.removeChild(productElement);
    }
  }

  /**
   * Genera el canvas para el resumen
   */
  private async generateSummaryCanvas(cartSummary: CartSummary): Promise<HTMLCanvasElement> {
    console.log('Generando canvas del resumen con datos de transferencia');
    const summaryElement = document.createElement('div');
    summaryElement.style.backgroundColor = this.config.BACKGROUND_COLOR;
    summaryElement.style.color = 'white';
    summaryElement.style.padding = '15px';
    summaryElement.style.borderRadius = '10px';
    summaryElement.style.marginBottom = '15px';
    summaryElement.style.width = '550px';
    summaryElement.style.fontFamily = 'var(--font-family-1)';

    summaryElement.innerHTML = `
      <div style="font-family: 'Teko', sans-serif;">
        <div style="display: flex; gap: 20px; margin-bottom: 10px;">
          <!-- Título Datos de Transferencia -->
          <div style="flex: 0.4; text-align: center;">
            <h3 style="margin: 0; color: white; font-family: 'Teko', sans-serif; font-size: 20px; font-weight: bold;">Datos Transferencia</h3>
          </div>

          <!-- Título Resumen -->
          <div style="flex: 0.6; text-align: right;">
            <h3 style="margin: 0; color: white; font-family: 'Teko', sans-serif; font-size: 20px; font-weight: bold;">Resumen del Pedido</h3>
          </div>
        </div>

        <div style="display: flex; gap: 20px;">
          <!-- Columna 1: Datos de Transferencia -->
          <div style="flex: 0.4; text-align: left; padding: 15px; position: relative; background-color: rgba(255, 255, 255, 0.05); border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.1); box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <p style="margin: 3px 0; color: white; font-family: 'Teko', sans-serif; font-size: 13px;"><strong>Nombre:</strong> Rubén Nicolás del Carmen Contreras Bustamante</p>
            <p style="margin: 3px 0; color: white; font-family: 'Teko', sans-serif; font-size: 13px;"><strong>RUT:</strong> 187856701</p>
            <p style="margin: 3px 0; color: white; font-family: 'Teko', sans-serif; font-size: 13px;"><strong>Banco:</strong> Mercado Pago</p>
            <p style="margin: 3px 0; color: white; font-family: 'Teko', sans-serif; font-size: 13px;"><strong>Tipo de cuenta:</strong> Cuenta Vista</p>
            <p style="margin: 3px 0; color: white; font-family: 'Teko', sans-serif; font-size: 13px;"><strong>Número de cuenta:</strong> 1033432213</p>
            <p style="margin: 3px 0; color: white; font-family: 'Teko', sans-serif; font-size: 13px;"><strong>Email:</strong> ruben4tip@gmail.com</p>
          </div>

          <!-- Columna 2: Resumen de Totales -->
          <div style="flex: 0.6; text-align: right; padding-left: 15px;">
            <h4 style="margin: 3px 0; color: white; font-family: 'Teko', sans-serif; font-size: 15px;"><strong>Sub Total: </strong>
              <span style="text-decoration: line-through;">${cartSummary.totalOriginalPrice.toLocaleString('es-CL', {style: 'currency', currency: 'CLP'})}</span>
            </h4>
            ${cartSummary.shippingCost > 0 ?
              `<h4 style="margin: 3px 0; color: white; font-family: 'Teko', sans-serif; font-size: 15px;"><strong>Costo de Envío: </strong>${cartSummary.shippingCost.toLocaleString('es-CL', {style: 'currency', currency: 'CLP'})}</h4>` : ''}
            <h5 style="margin: 3px 0; color: ${this.config.BACKGROUND_RED}; font-family: 'Teko', sans-serif; font-size: 15px;"><strong>Ahorrado: </strong>${cartSummary.totalSaved.toLocaleString('es-CL', {style: 'currency', currency: 'CLP'})}</h5>
            <h4 style="margin: 3px 0; color: white; font-family: 'Teko', sans-serif; font-size: 15px;"><strong>Total Transferencia: </strong>${cartSummary.totalAmount.toLocaleString('es-CL', {style: 'currency', currency: 'CLP'})}</h4>
            <h4 style="margin: 3px 0; color: ${this.config.BACKGROUND_RED}; font-family: 'Teko', sans-serif; font-size: 15px;"><strong>Total Crédito (6 cuotas sin interés): </strong>${cartSummary.totalAmountCredit.toLocaleString('es-CL', {style: 'currency', currency: 'CLP'})}</h4>
            ${cartSummary.shippingCost === 0 ?
              `<h4 style="margin: 3px 0; color: ${this.config.BACKGROUND_RED}; font-family: 'Teko', sans-serif; font-size: 15px;"><strong>Envío Gratis</strong></h4>` : ''}
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(summaryElement);

    try {
      const options = this.getHtml2CanvasOptions();
      options.height = summaryElement.offsetHeight + 50;
      console.log('Altura del elemento de resumen:', summaryElement.offsetHeight);
      const canvas = await html2canvas(summaryElement, options);
      console.log('Canvas del resumen generado correctamente con altura:', canvas.height);
      return canvas;
    } finally {
      document.body.removeChild(summaryElement);
    }
  }

  /**
   * Obtiene las opciones comunes para html2canvas
   */
  private getHtml2CanvasOptions(): any {
    return {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: this.config.BACKGROUND_COLOR,
      logging: false,
      onclone: (clonedDoc: Document) => {
        const style = clonedDoc.createElement('style');
        style.textContent = `
          @import url('https://fonts.googleapis.com/css2?family=Teko:wght@300;400;500;600;700&display=swap');
          body { font-family: 'Teko', sans-serif; }
          a { color: white; text-decoration: underline; }
        `;
        clonedDoc.head.appendChild(style);
      }
    };
  }

  /**
   * Añade una imagen al PDF
   */
  private addImageToPdf(
    pdf: jspdf,
    canvas: HTMLCanvasElement,
    paginationControl: { yPosition: number, currentPage: number, itemsInCurrentPage: number },
    contentWidth: number,
    margin: number
  ): void {
    const imgData = canvas.toDataURL('image/jpeg', 1.0);
    const imgHeight = (canvas.height * contentWidth) / canvas.width;
    console.log(`Añadiendo imagen al PDF - Altura: ${imgHeight}mm, Posición Y: ${paginationControl.yPosition}mm`);

    // Verificar si la imagen cabe en la página actual
    const pageHeight = pdf.internal.pageSize.getHeight();
    if (paginationControl.yPosition + imgHeight > pageHeight - margin) {
      console.log(`La imagen no cabe en la página actual. Añadiendo nueva página.`);
      pdf.addPage();
      paginationControl.currentPage++;
      this.setPageBackground(pdf, {
        pdfWidth: pdf.internal.pageSize.getWidth(),
        pdfHeight: pageHeight
      });
      paginationControl.yPosition = margin;
    }

    pdf.addImage(
      imgData,
      'JPEG',
      margin,
      paginationControl.yPosition,
      contentWidth,
      imgHeight
    );

    paginationControl.yPosition += imgHeight + 5;
    console.log(`Nueva posición Y después de añadir la imagen: ${paginationControl.yPosition}mm`);
  }

  /**
   * Añade una nueva página al PDF
   */
  private addNewPage(
    pdf: jspdf,
    paginationControl: { yPosition: number, currentPage: number, itemsInCurrentPage: number },
    dimensions: { pdfWidth: number, pdfHeight: number }
  ): void {
    pdf.addPage();
    paginationControl.currentPage++;
    this.setPageBackground(pdf, dimensions);
    paginationControl.yPosition = this.config.MARGIN;
    paginationControl.itemsInCurrentPage = 0;
  }

  /**
   * Añade los productos al PDF
   */
  private addProductsToPdf(
    pdf: jspdf,
    productCanvases: HTMLCanvasElement[],
    paginationControl: {
      yPosition: number,
      currentPage: number,
      itemsInCurrentPage: number,
      productLinks: Array<{url: string, name: string, index: number, position?: {x: number, y: number, width: number, height: number, page: number}}>
    },
    dimensions: { pdfWidth: number, pdfHeight: number, contentWidth: number },
    totalPagesNeeded: number,
    products: ProductCart[]
  ): void {
    console.log(`Iniciando proceso para añadir ${productCanvases.length} productos al PDF`);

    // Reiniciar enlaces para evitar problemas de posición previos
    paginationControl.productLinks.forEach(link => {
      link.position = undefined;
    });

    for (let i = 0; i < productCanvases.length; i++) {
      // Determinar si estamos en la última página
      const isLastPage = paginationControl.currentPage === totalPagesNeeded;

      // Calcular cuántos productos deben ir en la página actual
      const maxItemsInCurrentPage = isLastPage
        ? this.config.MAX_ITEMS_LAST_PAGE
        : this.config.MAX_ITEMS_PER_PAGE;

      // Si ya completamos los productos de esta página, pasar a la siguiente
      if (paginationControl.itemsInCurrentPage >= maxItemsInCurrentPage) {
        this.addNewPage(pdf, paginationControl, dimensions);
      }

      const canvas = productCanvases[i];

      // Calcular dimensiones de la imagen
      const imgHeight = (canvas.height * dimensions.contentWidth) / canvas.width;

      // Verificar si hay espacio en la página actual
      if (paginationControl.yPosition + imgHeight > dimensions.pdfHeight - this.config.MARGIN) {
        this.addNewPage(pdf, paginationControl, dimensions);
      }

      // Guardar la posición actual para el enlace
      console.log(`Producto #${i+1}: "${products[i].productName}" - Posición: página ${paginationControl.currentPage}, y=${paginationControl.yPosition}`);

      // Registrar la posición del título del producto para el enlace
      if (paginationControl.productLinks[i]) {
        paginationControl.productLinks[i].position = {
          x: this.config.MARGIN, // Desde el inicio de la tarjeta
          y: paginationControl.yPosition + 15, // Ajustado para caer en el área del título
          width: dimensions.contentWidth / 1.5, // Mayor ancho para mejor área clickeable
          height: 30, // Altura suficiente para cubrir título y parte de la descripción
          page: paginationControl.currentPage // Guardamos la página actual
        };

        console.log(`Enlace #${i+1} configurado: "${paginationControl.productLinks[i].name}" - Página: ${paginationControl.currentPage}`);
      }

      // Añadir imagen del producto al PDF
      this.addImageToPdf(
        pdf,
        canvas,
        paginationControl,
        dimensions.contentWidth,
        this.config.MARGIN
      );

      paginationControl.itemsInCurrentPage++;
    }

    console.log('Finalizada la adición de productos al PDF');
  }

  /**
   * Añade enlaces clickeables a los productos en el PDF
   */
  private addLinksToProducts(pdf: jspdf, productLinks: Array<{url: string, name: string, index: number, position?: {x: number, y: number, width: number, height: number, page: number}}>): void {
    console.log(`Iniciando adición de enlaces para ${productLinks.length} productos`);

    if (!productLinks || productLinks.length === 0) {
      console.warn('No hay enlaces de productos para añadir al PDF');
      return;
    }

    // Iterar sobre cada producto para añadir su enlace
    // Primero agrupamos los enlaces por página
    const linksByPage: {[page: number]: Array<{url: string, name: string, x: number, y: number, width: number, height: number}>} = {};

    productLinks.forEach((product, idx) => {
      if (product.position && product.url && product.url !== '#') {
        const { x, y, width, height, page } = product.position;

        if (!linksByPage[page]) {
          linksByPage[page] = [];
        }

        linksByPage[page].push({
          url: product.url,
          name: product.name,
          x, y, width, height
        });

        console.log(`Enlace #${idx+1}: "${product.name}" configurado para página ${page}`);
      } else {
        console.warn(`Producto #${idx+1} "${product.name}" - Sin posición o URL válida`);
      }
    });

    // Ahora procesamos página por página
    const totalPages = pdf.getNumberOfPages();
    console.log(`PDF tiene ${totalPages} páginas en total`);

    // Procesar cada página
    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
      // Ir a esa página específica
      pdf.setPage(pageNum);

      const pageLinks = linksByPage[pageNum] || [];
      console.log(`Procesando página ${pageNum}: ${pageLinks.length} enlaces`);

      // Añadir los enlaces de esa página
      pageLinks.forEach((link, idx) => {
        try {
          console.log(`Añadiendo enlace #${idx+1} en página ${pageNum}: "${link.name}" en posición: x=${link.x}, y=${link.y}`);

          // Añadir el enlace principal
          pdf.link(link.x, link.y, link.width, link.height, { url: link.url });

          // Añadir área clickeable adicional más grande (por seguridad)
          const pageHeight = pdf.internal.pageSize.getHeight();
          const pageWidth = pdf.internal.pageSize.getWidth();
          const extraHeight = 40; // Área más grande

          if (link.y + extraHeight <= pageHeight) {
            pdf.link(link.x, link.y, link.width, extraHeight, { url: link.url });
            console.log(`   Enlace adicional añadido con altura ${extraHeight}`);
          }
        } catch (error) {
          console.error(`Error al añadir enlace en página ${pageNum} para "${link.name}":`, error);
        }
      });
    }

    console.log('Finalizada la adición de enlaces a los productos');
  }

  /**
   * Calcula el número total de páginas necesarias
   */
  private calculateTotalPages(totalProducts: number): number {
    if (totalProducts <= this.config.MAX_ITEMS_LAST_PAGE) {
      // Si hay 4 o menos productos, todo cabe en una página
      return 1;
    } else {
      // Calculamos cuántas páginas completas de 5 productos tenemos
      const fullPages = Math.floor(totalProducts / this.config.MAX_ITEMS_PER_PAGE);

      // Calculamos cuántos productos quedarían para la última página
      const remainingProducts = totalProducts % this.config.MAX_ITEMS_PER_PAGE;

      if (remainingProducts === 0) {
        // Si es múltiplo exacto de 5, la última página tendría 5 productos
        // Debido a que queremos que la última tenga máximo 4, necesitamos una página adicional
        return fullPages + 1;
      } else if (remainingProducts <= this.config.MAX_ITEMS_LAST_PAGE) {
        // Si lo que sobra cabe en la última página (4 o menos), usamos las páginas calculadas
        return fullPages + 1;
      } else {
        // Si sobran más de 4 productos, necesitamos dividir en dos páginas adicionales
        return fullPages + 2;
      }
    }
  }
}
