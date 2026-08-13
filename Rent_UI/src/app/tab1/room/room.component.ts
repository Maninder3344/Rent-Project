import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  IonButtons, IonModal } from '@ionic/angular/standalone';
import { Location } from '@angular/common';
import { addIcons } from 'ionicons';
import {
  addCircleOutline,
  trashOutline,
  createOutline,
  arrowBackOutline,
} from 'ionicons/icons';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss'],
  imports: [IonModal, 
    IonButtons,
    CommonModule,
    FormsModule,
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
  ],
})
export class RoomComponent implements OnInit {
  rooms: any[] = [];
  properties: any[] = [];

  isModalOpen = false;

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }
  room = {
    roomNo: '',
    floor: 1,
    rent: 0,
    propertyId: 'id',
  };

  constructor(
    private api: ApiService,
    private toast: ToastController,
    private route: ActivatedRoute,
    private location: Location,
     private router: Router,
  ) {
    addIcons({
      addCircleOutline,
      trashOutline,
      createOutline,
      arrowBackOutline,
    });
  }
  propertyId!: string;
  ngOnInit() {
    this.propertyId = this.route.snapshot.paramMap.get('id')!;
    console.log(this.propertyId);

    this.getRooms();
    this.getProperties();
  }

  goBack() {
    this.location.back();
  }

  // getRooms() {
  //   this.api.GetRoomById(this.propertyId).subscribe({
  //     next: (res: any) => {
  //       this.rooms = res.data;
  //     },
  //   });
  // }


  getRooms() {
  this.api.GetRoomById(this.propertyId).subscribe({
    next: (res: any) => {
      console.log('========== ROOM RESPONSE ==========');
      console.log(res);
      console.log('res.data:', res.data);
      console.log('Is array:', Array.isArray(res.data));

      if (Array.isArray(res.data)) {
        res.data.forEach((room: any, index: number) => {
          console.log(`Room ${index}:`, room);
          console.log(`Room ${index} _id:`, room?._id);
        });
      }

      this.rooms = res.data;
    },
    error: (err) => {
      console.error('GET ROOMS ERROR:', err);
    }
  });
}

  getProperties() {
    this.api.GetAllProperties().subscribe({
      next: (res: any) => {
        this.properties = res.data;
      },
    });
  }

  addRoom() {
    this.room.propertyId = this.propertyId;
    this.api.CreateRoom(this.room).subscribe({
      next: async (res: any) => {
        const t = await this.toast.create({
          message: res.message,
          duration: 1500,
          color: 'success',
        });

        await t.present();

        this.room = {
          roomNo: '',
          floor: 1,
          rent: 0,
          propertyId: '',
        };

        this.getRooms();
      },
      error: async (err) => {
        console.log(err);
        console.log(err.error);
        console.log(err.error?.message);

        const t = await this.toast.create({
          message: err.error?.message || 'Something went wrong!',
          duration: 2000,
          color: 'danger',
        });

        await t.present();
      },
    });
  }

  deleteRoom(id: string) {
    this.api.DeleteRoom(id).subscribe(() => {
      this.getRooms();
    });
  }

goToTenant(room: any) {
  console.log('========== TENANT CLICK ==========');
  console.log('Room received:', room);
  console.log('Room JSON:', JSON.stringify(room, null, 2));
  console.log('Room keys:', Object.keys(room || {}));

  if (!room?._id) {
    console.error('❌ _id DOES NOT EXIST');
    return;
  }

  console.log('✅ Navigating with ID:', room._id);

  this.router.navigate(['/tenant', room._id]);
}
}

