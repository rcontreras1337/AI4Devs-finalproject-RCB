import { NgIf } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-contact-page',
  standalone: true,
  imports: [NgIf],
  templateUrl: './contact-page.component.html',
  styleUrl: './contact-page.component.css'
})
export class ContactPageComponent {
  // Información para la página de contacto
  public logoUrl = '/public/assets/hypeV4ault.png'; // Reemplazar con la URL de tu logo
  public instagramUrl = 'https://www.instagram.com/HypeV4ault'; // Reemplazar con tu cuenta de Instagram
  public story = 'Bienvenidos a nuestra página de contacto. Somos un equipo apasionado que comenzó esta plataforma con la visión de proporcionar productos Nike originales y con descuentos a nuestros clientes. Nuestro objetivo es ofrecer una experiencia de compra única y personalizada. ¡Gracias por visitarnos y ser parte de nuestra historia!';
}
