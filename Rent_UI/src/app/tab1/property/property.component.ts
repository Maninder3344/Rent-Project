import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import {
  IonInput,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonTitle,
  IonToolbar,
  ModalController,
  IonIcon,
} from '@ionic/angular/standalone';

import {
  close,
  business,
  homeOutline,
  locationOutline,
  cashOutline,
  checkmarkCircle,
  addCircle,
} from 'ionicons/icons';

import { ApiService } from '../../services/api';

@Component({
  selector: 'app-property',
  templateUrl: './property.component.html',
  styleUrls: ['./property.component.scss'],
  standalone: true,
  imports: [
    IonIcon,
    FormsModule,
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonItem,
    IonTitle,
    IonToolbar,
    IonInput,
  ],
})
export class ModalComponent implements OnInit {

  @Input() property: any;

  name = '';
  address = '';
  UnitPrice: number | null = null;

  isLoading = false;
  isEdit = false;

  constructor(
    private modalCtrl: ModalController,
    private api: ApiService
  ) {
    addIcons({
      close,
      business,
      homeOutline,
      locationOutline,
      cashOutline,
      checkmarkCircle,
      addCircle,
    });
  }

  ngOnInit() {
    if (this.property) {
      this.isEdit = true;

      this.name = this.property.name;
      this.address = this.property.address;
      this.UnitPrice = this.property.UnitPrice;
    }
  }

  cancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    if (!this.name || !this.address || this.UnitPrice == null) {
      alert('Please fill all fields.');
      return;
    }

    if (this.isEdit) {
      this.updateProperty();
    } else {
      this.createProperty();
    }
  }

  createProperty() {
    const data = {
      name: this.name,
      address: this.address,
      UnitPrice: this.UnitPrice,
    };

    this.isLoading = true;

    this.api.CreateProperty(data).subscribe({
      next: async (res: any) => {
        this.isLoading = false;
        await this.modalCtrl.dismiss(res, 'confirm');
      },
      error: (err) => {
        this.isLoading = false;
        console.error(err);
        alert('Something went wrong.');
      },
    });
  }

  updateProperty() {
    const data = {
      _id: this.property._id,
      name: this.name,
      address: this.address,
      UnitPrice: this.UnitPrice,
    };

    this.isLoading = true;

    this.api.UpdateProperty(this.property._id, data).subscribe({
      next: async (res: any) => {
        this.isLoading = false;
        await this.modalCtrl.dismiss(res, 'confirm');
      },
      error: (err) => {
        this.isLoading = false;
        console.error(err);
        alert('Something went wrong.');
      },
    });
  }
}