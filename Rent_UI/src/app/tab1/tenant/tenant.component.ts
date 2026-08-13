import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonTitle,
  IonContent,
  IonSearchbar,
  IonList,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonBadge
} from '@ionic/angular/standalone';

import {
  addOutline,
  arrowBackOutline,
  peopleOutline,
  cardOutline,
  carOutline,
  createOutline,
  trashOutline
} from 'ionicons/icons';

import { addIcons } from 'ionicons';


interface Tenant {
  _id?: string;
  userId: string;
  name: string;
  phone: string;
  isVerified: boolean;
  adhaarCardNumber: string;
  members: number;
  vehicleNumber?: string;
  createdAt?: string;
  updatedAt?: string;
}

@Component({
  selector: 'app-tenant',
  templateUrl: './tenant.component.html',
  styleUrls: ['./tenant.component.scss'],
  imports: [
    CommonModule,
    FormsModule,

    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonIcon,
    IonTitle,
    IonContent,
    IonSearchbar,
    IonList,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonBadge
  ]
})
export class TenantComponent  implements OnInit {
  
tenants: Tenant[] = [];

  searchText = '';

  constructor() { addIcons({
      addOutline,
      arrowBackOutline,
      peopleOutline,
      cardOutline,
      carOutline,
      createOutline,
      trashOutline
    });
 }

  ngOnInit() { this.getTenants();}

    get filteredTenants(): Tenant[] {

    const search = this.searchText
      .trim()
      .toLowerCase();

    if (!search) {
      return this.tenants;
    }

    return this.tenants.filter(tenant =>
      tenant.name.toLowerCase().includes(search) ||
      tenant.phone.includes(search) ||
      tenant.adhaarCardNumber.includes(search) ||
      tenant.vehicleNumber?.toLowerCase().includes(search)
    );
  }

  getTenants() {

    // Replace with:
    // this.api.GetTenants().subscribe(...)

    console.log('Get tenants');

  }

  openTenantModal() {

    console.log('Open tenant modal');

  }

  editTenant(tenant: Tenant) {

    console.log('Edit tenant', tenant);

  }

  deleteTenant(id?: string) {

    if (!id) {
      return;
    }

    console.log('Delete tenant', id);

  }

  goBack() {
    history.back();
  }

}
