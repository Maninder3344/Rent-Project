
import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonCard,
  IonCardContent,
  IonItem,
  IonLabel,
  IonInput,
  IonList,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  ToastController,
  IonButtons,
  IonModal
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';

import {
  addCircleOutline,
  trashOutline,
  createOutline,
  arrowBackOutline
} from 'ionicons/icons';

import { ApiService } from '../../services/api';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonModal,
    IonButtons,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButton,
    IonCard,
    IonCardContent,
    IonItem,
    IonLabel,
    IonInput,
    IonList,
    IonIcon,
    IonGrid,
    IonRow,
    IonCol
  ]
})
export class RoomComponent implements OnInit {

  rooms: any[] = [];
  properties: any[] = [];

  propertyId!: string;

  isModalOpen = false;

  room = {
    roomNo: '',
    floor: 1,
    rent: 0,
    propertyId: ''
  };

  constructor(
    private api: ApiService,
    private toast: ToastController,
    private route: ActivatedRoute,
    private location: Location,
    private router: Router
  ) {
    addIcons({
      addCircleOutline,
      trashOutline,
      createOutline,
      arrowBackOutline
    });
  }

  ngOnInit() {

    this.propertyId = this.route.snapshot.paramMap.get('id')!;

    console.log('Property ID:', this.propertyId);

    this.getRooms();
    this.getProperties();
  }

  // OPEN MODAL
  openModal() {
    this.isModalOpen = true;
  }

  // CLOSE MODAL
  closeModal() {
    this.isModalOpen = false;
  }

  // BACK BUTTON
  goBack() {
    this.location.back();
  }

  // GET ROOMS
  getRooms() {

    this.api.GetRoomById(this.propertyId).subscribe({

      next: (res: any) => {

        console.log('ROOM RESPONSE:', res);

        this.rooms = Array.isArray(res.data)
          ? res.data
          : [];

      },

      error: (err) => {
        console.error('GET ROOMS ERROR:', err);
      }

    });

  }

  // GET PROPERTIES
  getProperties() {

    this.api.GetAllProperties().subscribe({

      next: (res: any) => {
        this.properties = res.data || [];
      },

      error: (err) => {
        console.error('GET PROPERTIES ERROR:', err);
      }

    });

  }

  // GROUP ROOMS FLOOR WISE
  get groupedFloors() {

    const floorMap = new Map<number, any[]>();

    this.rooms.forEach((room: any) => {

      const floor = Number(room.floor);

      if (!floorMap.has(floor)) {
        floorMap.set(floor, []);
      }

      floorMap.get(floor)!.push(room);

    });

    return Array.from(floorMap.entries())

      .sort((a, b) => a[0] - b[0])

      .map(([floor, rooms]) => ({

        floor,

        rooms: rooms.sort((a, b) =>

          String(a.roomNo).localeCompare(
            String(b.roomNo),
            undefined,
            { numeric: true }
          )

        )

      }));

  }

  // ADD ROOM
  async addRoom() {

    if (!this.room.roomNo || !this.room.floor || this.room.rent < 0) {

      const t = await this.toast.create({
        message: 'Please enter valid room details!',
        duration: 2000,
        color: 'warning'
      });

      await t.present();
      return;

    }

    this.room.propertyId = this.propertyId;

    this.api.CreateRoom(this.room).subscribe({

      next: async (res: any) => {

        const t = await this.toast.create({
          message: res.message || 'Room added successfully!',
          duration: 1500,
          color: 'success'
        });

        await t.present();

        this.room = {
          roomNo: '',
          floor: 1,
          rent: 0,
          propertyId: this.propertyId
        };

        this.closeModal();

        this.getRooms();

      },

      error: async (err) => {

        console.error('CREATE ROOM ERROR:', err);

        const t = await this.toast.create({
          message: err.error?.message || 'Something went wrong!',
          duration: 2000,
          color: 'danger'
        });

        await t.present();

      }

    });

  }

  // DELETE ROOM
  async deleteRoom(id: string) {

    const t = await this.toast.create({
      message: 'Deleting room...',
      duration: 1000,
      color: 'medium'
    });

    await t.present();

    this.api.DeleteRoom(id).subscribe({

      next: async () => {

        const successToast = await this.toast.create({
          message: 'Room deleted successfully!',
          duration: 1500,
          color: 'success'
        });

        await successToast.present();

        this.getRooms();

      },

      error: async (err) => {

        console.error('DELETE ROOM ERROR:', err);

        const errorToast = await this.toast.create({
          message: err.error?.message || 'Unable to delete room!',
          duration: 2000,
          color: 'danger'
        });

        await errorToast.present();

      }

    });

  }

  // GO TO TENANT PAGE
  goToTenant(room: any) {

    console.log('ROOM:', room);

    if (!room?._id) {
      console.error('Room ID not found');
      return;
    }

    this.router.navigate(['/tenant', room._id]);

  }

}
