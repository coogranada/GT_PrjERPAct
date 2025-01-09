import { Component, OnInit } from '@angular/core';
import { ImagenesBannerServices } from '../../../../../Services/Maestros/imagenes-banner.service';
declare var $: any;
@Component({
  selector: 'app-banner-imagen-modal',
  templateUrl: './banner-imagen-modal.component.html',
  styleUrls: ['./banner-imagen-modal.component.css'],
  providers: [ImagenesBannerServices],
  standalone : false
})
export class BannerImagenModalComponent implements OnInit {
  public bannerArray: any[] = [];
  constructor(private ImagenesBannerServices: ImagenesBannerServices) { }

  ngOnInit() {
    this.ConsultarImagenesBanner();
    $('.carousel').carousel({
      interval: 2000
    });
  }

  ConsultarImagenesBanner() {
    this.ImagenesBannerServices.getImagenesBanner().subscribe((result : any[]) => {
          this.bannerArray = result;
    });
  }
  IrArriba() {
    $('html, body').animate({ scrollTop: 0 }, 'slow');
    return false;
  }
}
