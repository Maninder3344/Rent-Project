import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonButton,
  IonIcon,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonModal,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonText,
  IonSpinner,
  NavController,
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import {
  addOutline,
  createOutline,
  trashOutline,
  peopleOutline,
  arrowBackOutline,
  addCircleOutline,
} from 'ionicons/icons';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,

    IonButton,
    IonIcon,
    IonList,
    IonItem,
    IonLabel,
    IonInput,
    IonModal,
    IonCard,
    IonCardHeader,
    IonCardTitle,

    IonText,
    IonSpinner,
  ],
})
export class MemberComponent implements OnInit {
  private apiUrl = 'http://localhost:8081';

  tenantId = '';

  members: any[] = [];

  memberName = '';
  phone = '';

  editingId: string | null = null;

  isModalOpen = false;
  isLoading = false;

  constructor(
    private http: HttpClient,
    private navCtrl: NavController,
    private route: ActivatedRoute,
  ) {
    addIcons({
      addOutline,
      createOutline,
      trashOutline,
      peopleOutline,
      arrowBackOutline,
      addCircleOutline,
    });
  }

  ngOnInit() {
  this.tenantId = this.route.snapshot.paramMap.get('id') || '';

  console.log('Tenant ID:', this.tenantId);

  if (this.tenantId) {
    this.getMembers();
  } else {
    console.error('Tenant ID not found in route');
  }
}
getMembers() {
  this.isLoading = true;

  this.http
    .get<any>(`${this.apiUrl}/GetTenantMemberById`, {
      params: {
        Id: this.tenantId,
      },
      withCredentials: true,
    })
    .subscribe({
      next: (res) => {
        this.members = res.data || [];
        this.isLoading = false;

        console.log('Tenant ID:', this.tenantId);
        console.log('Members:', this.members);
      },
      error: (err) => {
        console.error('Failed to fetch members:', err.error || err);
        this.members = [];
        this.isLoading = false;
      },
    });
}
  openAddModal() {
    this.editingId = null;
    this.memberName = '';
    this.phone = '';
    this.isModalOpen = true;
  }

  openEditModal(member: any) {
    this.editingId = member._id;
    this.memberName = member.memberName;
    this.phone = member.phone || '';
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  saveMember() {
    if (!this.memberName.trim()) {
      alert('Member name is required');
      return;
    }

    if (!this.tenantId) {
      alert('Tenant ID is missing');
      return;
    }

    const data = {
      tenantId: this.tenantId,
      memberName: this.memberName.trim(),
      phone: this.phone.trim(),
    };

    if (this.editingId) {
      this.http
        .put(
          `${this.apiUrl}/UpdateTenantMember`,
          {
            _id: this.editingId,
            ...data,
          },
          {
            withCredentials: true,
          },
        )
        .subscribe({
          next: () => {
            this.closeModal();
            this.getMembers();
          },
          error: (err) => {
            console.error(err);
            alert('Failed to update member');
          },
        });
    } else {
      this.http
        .post(`${this.apiUrl}/CreateTenantMember`, data, {
          withCredentials: true,
        })
        .subscribe({
          next: () => {
            this.closeModal();
            this.getMembers();
          },
          error: (err) => {
            console.error(err);
            alert('Failed to add member');
          },
        });
    }
  }

  deleteMember(member: any) {
    if (!confirm(`Delete ${member.memberName}?`)) {
      return;
    }

    this.http
      .delete(`${this.apiUrl}/DeleteTenantMember`, {
        body: {
          _id: member._id,
        },
        withCredentials: true,
      })
      .subscribe({
        next: () => {
          this.getMembers();
        },
        error: (err) => {
          console.error(err);
          alert('Failed to delete member');
        },
      });
  }
  goBack() {
    (document.activeElement as HTMLElement)?.blur();

    setTimeout(() => {
      this.navCtrl.back();
    }, 0);
  }
}
