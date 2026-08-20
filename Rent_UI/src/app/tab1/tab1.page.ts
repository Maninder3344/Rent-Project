import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonIcon,
  IonTab,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonTitle,
  IonToolbar,
  ModalController,
  IonButton,
  IonLabel,
} from '@ionic/angular/standalone';
import {
  IonCard,
  IonCardContent,
} from '@ionic/angular/standalone';
import {
  trashOutline,
  createOutline,
  addOutline,
  homeSharp,
  logOutOutline,
  addCircleOutline,
  peopleSharp,
} from 'ionicons/icons';

import { IonSearchbar } from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import { library, radio, search, home } from 'ionicons/icons';
import { ModalComponent } from './property/property.component';
import { ApiService } from '../services/api';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [
    IonLabel,
    IonButton,
    IonContent,
    IonHeader,
    IonIcon,
    IonTab,
    IonTabBar,
    IonTabButton,
    IonTabs,
    IonTitle,
    IonToolbar,
    FormsModule,
    IonCard,
    IonCardContent,
    IonSearchbar,
    CommonModule,
  ],
})
export class Tab1Page {
  searchText: string = '';
  properties: any[] = [];
  filteredProperties: any[] = [];

  constructor(
    private modalCtrl: ModalController,
    private api: ApiService,
    private alertController: AlertController,
    private router: Router,
  ) {
    addIcons({
      library,
      radio,
      search,
      home,
      trashOutline,
      createOutline,
      addOutline,
      homeSharp,
      logOutOutline,
      addCircleOutline,
      peopleSharp
    });
  }
  async openModal() {
    const modal = await this.modalCtrl.create({
      component: ModalComponent,
    });
    modal.present();

    const { role } = await modal.onWillDismiss();

    // Reload after adding property
    if (role === 'confirm') {
      this.getProperties();
    }
  }

  async openEditModal(property: any) {
    const modal = await this.modalCtrl.create({
      component: ModalComponent,
      componentProps: {
        property: property,
      },
    });

    await modal.present();

    const { role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      this.getProperties();
    }
  }

  ngOnInit() {
    this.getProperties();
  }

  async confirmDelete(id: string) {
    const alert = await this.alertController.create({
      header: 'Delete Property',
      message: 'Are you sure you want to delete this property?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            this.deleteProperty(id);
          },
        },
      ],
    });

    await alert.present();
  }

  getProperties() {
    this.api.GetAllProperties().subscribe({
      next: (res: any) => {
        console.log(res);

        // If API returns array
        //this.properties = res;

        // If API returns {success:true,data:[...]}
        // this.properties = res.data;

        if (Array.isArray(res)) {
          this.properties = res;
          this.filteredProperties = [...this.properties];
        } else if (Array.isArray(res.data)) {
          this.properties = res.data;
          this.filteredProperties = [...this.properties];
        } else {
          console.error('Response does not contain an array:', res);
          this.properties = [];
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  filterProperties() {
    const search = this.searchText.toLowerCase().trim();

    if (!search) {
      this.filteredProperties = [...this.properties];
      return;
    }

    this.filteredProperties = this.properties.filter(
      (property: any) =>
        property.name.toLowerCase().includes(search) ||
        property.address.toLowerCase().includes(search) ||
        property.UnitPrice.toString().includes(search),
    );
  }

  deleteProperty(id: string) {
    this.api.DeleteProperty(id).subscribe({
      next: (res: any) => {
        console.log(res);
        this.getProperties(); // Refresh the list
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  logout() {
    this.api.LogoutUser().subscribe({
      next: () => {
        sessionStorage.removeItem('isLoggedIn');
        sessionStorage.removeItem('user');

        this.router.navigateByUrl('/login', {
          replaceUrl: true,
        });
      },
      error: () => {
        sessionStorage.removeItem('isLoggedIn');
        sessionStorage.removeItem('user');

        this.router.navigateByUrl('/login', {
          replaceUrl: true,
        });
      },
    });
  }

  goToRoom(property: any) {
    this.router.navigate(['/room',property._id]);
  }

  goToTenant() {
  this.router.navigate(['/tenant']);
}
}


