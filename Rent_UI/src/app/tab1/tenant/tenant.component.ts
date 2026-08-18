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
  IonList,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonBadge,
  IonModal,
  IonItem,
  IonLabel,
  IonInput,
  IonSelect,
  IonSelectOption,
} from '@ionic/angular/standalone';

import {
  addOutline,
  arrowBackOutline,
  peopleOutline,
  cardOutline,
  carOutline,
  createOutline,
  trashOutline,
  saveOutline,
  addCircleOutline,
} from 'ionicons/icons';

import { addIcons } from 'ionicons';

import { ApiService } from '../../services/api';

// =====================================================
// User Interface
// =====================================================

interface User {
  _id: string;

  name?: string;

  email?: string;

  phone?: string;
}

// =====================================================
// Tenant Interface
// =====================================================

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

  standalone: true,

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

    IonList,

    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,

    IonBadge,

    IonModal,

    IonItem,
    IonLabel,
    IonInput,

    IonSelect,
    IonSelectOption,
  ],
})
export class TenantComponent implements OnInit {
  // =====================================================
  // Users
  // =====================================================

  users: User[] = [];

  // =====================================================
  // Tenants
  // =====================================================

  tenants: Tenant[] = [];

  // =====================================================
  // Search
  // =====================================================

  searchText = '';

  // =====================================================
  // Modal
  // =====================================================

  isModalOpen = false;

  isEditMode = false;

  // =====================================================
  // Tenant Form
  // =====================================================

  tenant: Tenant = {
    userId: '',

    name: '',

    phone: '',

    isVerified: false,

    adhaarCardNumber: '',

    members: 1,

    vehicleNumber: '',
  };

  // =====================================================
  // Constructor
  // =====================================================

  constructor(private api: ApiService) {
    addIcons({
      addOutline,

      arrowBackOutline,

      peopleOutline,

      cardOutline,

      carOutline,

      createOutline,

      trashOutline,

      saveOutline,

      addCircleOutline,
    });
  }

  // =====================================================
  // On Init
  // =====================================================

  ngOnInit() {
    this.getUsers();

    this.getTenants();
  }

  // =====================================================
  // Get Users
  // =====================================================

  getUsers() {
    this.api.GetAllUsers().subscribe({
      next: (response: any) => {
        console.log('Get Users Response:', response);

        if (Array.isArray(response)) {
          this.users = response;
        } else if (Array.isArray(response?.data)) {
          this.users = response.data;
        } else if (Array.isArray(response?.users)) {
          this.users = response.users;
        } else {
          this.users = [];
        }

        console.log('Users:', this.users);
      },

      error: (error: any) => {
        console.error('Get users error:', error);

        this.users = [];
      },
    });
  }

  // =====================================================
  // Filter Tenants
  // =====================================================

  get filteredTenants(): Tenant[] {
    const search = this.searchText.trim().toLowerCase();

    if (!search) {
      return this.tenants;
    }

    return this.tenants.filter(
      (tenant) =>
        tenant.name?.toLowerCase().includes(search) ||
        tenant.phone?.toLowerCase().includes(search) ||
        tenant.adhaarCardNumber?.toLowerCase().includes(search) ||
        tenant.vehicleNumber?.toLowerCase().includes(search),
    );
  }

  // =====================================================
  // Get All Tenants
  // =====================================================

  getTenants() {
    this.api.GetAllTenants().subscribe({
      next: (response: any) => {
        console.log('Get Tenants Response:', response);

        if (Array.isArray(response)) {
          this.tenants = response;
        } else if (Array.isArray(response?.data)) {
          this.tenants = response.data;
        } else if (Array.isArray(response?.tenants)) {
          this.tenants = response.tenants;
        } else {
          this.tenants = [];
        }

        console.log('Tenants:', this.tenants);
      },

      error: (error: any) => {
        console.error('Get tenants error:', error);

        this.tenants = [];
      },
    });
  }

  // =====================================================
  // Open Add Tenant Modal
  // =====================================================

  openTenantModal() {
    this.isEditMode = false;

    this.tenant = {
      userId: '',

      name: '',

      phone: '',

      isVerified: false,

      adhaarCardNumber: '',

      members: 1,

      vehicleNumber: '',
    };

    this.isModalOpen = true;
  }

  // =====================================================
  // Edit Tenant
  // =====================================================

  editTenant(tenant: Tenant) {
    this.isEditMode = true;

    this.tenant = {
      _id: tenant._id,

      userId: tenant.userId,

      name: tenant.name,

      phone: tenant.phone,

      isVerified: tenant.isVerified,

      adhaarCardNumber: tenant.adhaarCardNumber,

      members: tenant.members ?? 1,

      vehicleNumber: tenant.vehicleNumber ?? '',

      createdAt: tenant.createdAt,

      updatedAt: tenant.updatedAt,
    };

    this.isModalOpen = true;
  }

  // =====================================================
  // Close Modal
  // =====================================================

  closeModal() {
    this.isModalOpen = false;
  }

  // =====================================================
  // User Selected
  // =====================================================

  onUserChange() {
    const selectedUser = this.users.find(
      (user) => user._id === this.tenant.userId,
    );

    if (!selectedUser) {
      return;
    }

    /*
     * Automatically fill tenant information
     * from selected User if available.
     */

    if (selectedUser.name) {
      this.tenant.name = selectedUser.name;
    }

    if (selectedUser.phone) {
      this.tenant.phone = selectedUser.phone;
    }
  }

  // =====================================================
  // Save Tenant
  // =====================================================

  saveTenant() {
    // =================================================
    // Validate User
    // =================================================

    if (!this.tenant.userId) {
      alert('Please select a user');

      return;
    }

    // =================================================
    // Validate Name
    // =================================================

    if (!this.tenant.name?.trim()) {
      alert('Please enter tenant name');

      return;
    }

    // =================================================
    // Validate Phone
    // =================================================

    if (!this.tenant.phone?.trim()) {
      alert('Please enter phone number');

      return;
    }

    // =================================================
    // Validate Aadhaar
    // =================================================

    if (!this.tenant.adhaarCardNumber?.trim()) {
      alert('Please enter Aadhaar number');

      return;
    }

    // =================================================
    // Validate Members
    // =================================================

    if (!this.tenant.members || this.tenant.members < 1) {
      alert('Members must be at least 1');

      return;
    }

    // =================================================
    // UPDATE
    // =================================================

    if (this.isEditMode) {
      if (!this.tenant._id) {
        alert('Tenant ID is missing');

        return;
      }

      this.api.UpdateTenant(this.tenant).subscribe({
        next: (response: any) => {
          console.log('Tenant updated:', response);

          this.closeModal();

          this.getTenants();
        },

        error: (error: any) => {
          console.error('Update tenant error:', error);

          alert(error?.error?.message || 'Failed to update tenant');
        },
      });

      return;
    }

    // =================================================
    // CREATE
    // =================================================

    const newTenant = {
      // IMPORTANT
      // User ID comes from User collection

      userId: this.tenant.userId,

      name: this.tenant.name.trim(),

      phone: this.tenant.phone.trim(),

      adhaarCardNumber: this.tenant.adhaarCardNumber.trim(),

      members: Number(this.tenant.members),

      vehicleNumber: this.tenant.vehicleNumber?.trim() || '',

      isVerified: this.tenant.isVerified,
    };

    console.log('Creating Tenant:', newTenant);

    this.api.CreateTenant(newTenant).subscribe({
      next: (response: any) => {
        console.log('Tenant created:', response);

        this.closeModal();

        this.getTenants();
      },

      error: (error: any) => {
        console.error('Create tenant error:', error);

        alert(error?.error?.message || 'Failed to create tenant');
      },
    });
  }

  // =====================================================
  // Delete Tenant
  // =====================================================

  deleteTenant(id?: string) {
    if (!id) {
      console.error('Tenant ID is undefined');

      return;
    }

    const confirmed = confirm('Are you sure you want to delete this tenant?');

    if (!confirmed) {
      return;
    }

    this.api.DeleteTenant(id).subscribe({
      next: (response: any) => {
        console.log('Tenant deleted:', response);

        this.getTenants();
      },

      error: (error: any) => {
        console.error('Delete tenant error:', error);

        alert(error?.error?.message || 'Failed to delete tenant');
      },
    });
  }

  // =====================================================
  // Go Back
  // =====================================================

  goBack() {
    history.back();
  }
}
