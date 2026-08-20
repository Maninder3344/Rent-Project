import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

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
  IonToggle,
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

  propertyId: string;

  roomId: string;

  name: string;

  phone: string;

  isVerified: boolean;

  adhaarCardNumber: string;

  members: number;

  vehicleNumber?: string;

  createdAt?: string;

  updatedAt?: string;
}

// =====================================================
// Room Interface
// =====================================================

interface Room {
  _id: string;

  roomNo: string;

  floor: number;

  rent: number;

  propertyId: string | any;

  createdAt?: string;

  updatedAt?: string;
}

// =====================================================
// Property Interface
// =====================================================

interface Property {
  _id: string;

  name: string;

  address?: string;

  UnitPrice?: number;
}

// =====================================================
// Component
// =====================================================

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
    IonToggle,
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
  // Route ID
  // =====================================================

  routeId: string | null = null;

  // =====================================================
  // Rooms
  // =====================================================

  rooms: Room[] = [];

  // Rooms filtered according to selected property
  filteredRooms: Room[] = [];

  // =====================================================
  // Properties
  // =====================================================

  properties: Property[] = [];

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

    propertyId: '',

    roomId: '',

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

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
  ) {
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

  ngOnInit(): void {
    // Route:
    // /tenant/:id

    this.routeId = this.route.snapshot.paramMap.get('id');

    console.log('Tenant Route ID:', this.routeId);

    this.getUsers();

    this.getTenants();

    this.getRooms();

    this.getProperties();
  }

  // =====================================================
  // Get All Users
  // =====================================================

  getUsers(): void {
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
  // Get Rooms
  // =====================================================

  getRooms(): void {
    this.api.GetAllRooms().subscribe({
      next: (response: any) => {
        console.log('========== GET ALL ROOMS RESPONSE ==========');

        console.log(response);

        const rooms = response?.data || response?.rooms || response;

        if (Array.isArray(rooms)) {
          this.rooms = rooms;

          console.log('========== ROOMS LOADED ==========');

          console.log('Total rooms:', this.rooms.length);

          console.log('Rooms:', this.rooms);

          // Filter rooms if property is already selected
          if (this.tenant.propertyId) {
            this.filterRoomsByProperty();
          } else {
            this.filteredRooms = [];
          }
        } else {
          console.error('GetAllRooms did not return an array:', response);

          this.rooms = [];

          this.filteredRooms = [];
        }
      },

      error: (error: any) => {
        console.error('GET ALL ROOMS ERROR:', error);

        this.rooms = [];

        this.filteredRooms = [];
      },
    });
  }

  // =====================================================
  // Get All Properties
  // =====================================================

  getProperties(): void {
    this.api.GetAllProperties().subscribe({
      next: (response: any) => {
        console.log('Get Properties Response:', response);

        if (Array.isArray(response)) {
          this.properties = response;
        } else if (Array.isArray(response?.data)) {
          this.properties = response.data;
        } else if (Array.isArray(response?.properties)) {
          this.properties = response.properties;
        } else {
          this.properties = [];
        }

        console.log('Properties:', this.properties);
      },

      error: (error: any) => {
        console.error('Get properties error:', error);

        this.properties = [];
      },
    });
  }

  // =====================================================
  // Property Changed
  // =====================================================

  onPropertyChange(): void {
    console.log('Selected Property:', this.tenant.propertyId);

    // Important:
    // When property changes, remove previously selected room

    this.tenant.roomId = '';

    // Filter rooms
    this.filterRoomsByProperty();
  }

  // =====================================================
  // Filter Rooms By Property
  // =====================================================

  filterRoomsByProperty(): void {
    if (!this.tenant.propertyId) {
      this.filteredRooms = [];

      return;
    }

    const selectedPropertyId = String(this.tenant.propertyId);

    this.filteredRooms = this.rooms.filter((room: Room) => {
      let roomPropertyId: string = '';

      // Case 1:
      // propertyId is normal string

      if (typeof room.propertyId === 'string') {
        roomPropertyId = room.propertyId;
      }

      // Case 2:
      // propertyId is ObjectId/object
      // Example:
      // propertyId: { _id: "123", name: "Property 1" }
      else if (room.propertyId?._id) {
        roomPropertyId = room.propertyId._id;
      }

      // Compare IDs

      return String(roomPropertyId) === selectedPropertyId;
    });

    console.log('Selected Property ID:', selectedPropertyId);

    console.log('Filtered Rooms:', this.filteredRooms);
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

  getTenants(): void {
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

  openTenantModal(): void {
    this.isEditMode = false;

    this.tenant = {
      userId: '',

      propertyId: '',

      roomId: '',

      name: '',

      phone: '',

      isVerified: false,

      adhaarCardNumber: '',

      members: 1,

      vehicleNumber: '',
    };

    // Clear filtered rooms
    this.filteredRooms = [];

    this.isModalOpen = true;
  }

  // =====================================================
  // Edit Tenant
  // =====================================================

  editTenant(tenant: Tenant): void {
    this.isEditMode = true;

    this.tenant = {
      _id: tenant._id,

      userId: tenant.userId,

      propertyId: tenant.propertyId,

      roomId: tenant.roomId,

      name: tenant.name,

      phone: tenant.phone,

      isVerified: tenant.isVerified,

      adhaarCardNumber: tenant.adhaarCardNumber,

      members: tenant.members ?? 1,

      vehicleNumber: tenant.vehicleNumber ?? '',

      createdAt: tenant.createdAt,

      updatedAt: tenant.updatedAt,
    };

    // Filter rooms for tenant's property
    this.filterRoomsByProperty();

    this.isModalOpen = true;
  }

  // =====================================================
  // Close Modal
  // =====================================================

  closeModal(): void {
    this.isModalOpen = false;
  }

  // =====================================================
  // User Selected
  // =====================================================

  onUserChange(): void {
    const selectedUser = this.users.find(
      (user) => user._id === this.tenant.userId,
    );

    if (!selectedUser) {
      return;
    }

    // Fill name automatically

    if (selectedUser.name) {
      this.tenant.name = selectedUser.name;
    }

    // Fill phone automatically

    if (selectedUser.phone) {
      this.tenant.phone = selectedUser.phone;
    }
  }

  // =====================================================
  // Save Tenant
  // =====================================================

  saveTenant(): void {
    // =================================================
    // Validate User
    // =================================================

    if (!this.tenant.userId) {
      alert('Please select a user');

      return;
    }

    // =================================================
    // Validate Property
    // =================================================

    if (!this.tenant.propertyId) {
      alert('Please select a property');

      return;
    }

    // =================================================
    // Validate Room
    // =================================================

    if (!this.tenant.roomId) {
      alert('Please select a room');

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

    if (!this.tenant.members || Number(this.tenant.members) < 1) {
      alert('Members must be at least 1');

      return;
    }

    // =================================================
    // UPDATE TENANT
    // =================================================

    if (this.isEditMode) {
      if (!this.tenant._id) {
        alert('Tenant ID is missing');

        return;
      }

      const updateTenant = {
        _id: this.tenant._id,

        userId: this.tenant.userId,

        propertyId: this.tenant.propertyId,

        roomId: this.tenant.roomId,

        name: this.tenant.name.trim(),

        phone: this.tenant.phone.trim(),

        isVerified: this.tenant.isVerified,

        adhaarCardNumber: this.tenant.adhaarCardNumber.trim(),

        members: Number(this.tenant.members),

        vehicleNumber: this.tenant.vehicleNumber?.trim() || '',
      };

      console.log('Updating Tenant:', updateTenant);

      this.api.UpdateTenant(updateTenant).subscribe({
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
    // CREATE TENANT
    // =================================================

    const newTenant = {
      userId: this.tenant.userId,

      propertyId: this.tenant.propertyId,

      roomId: this.tenant.roomId,

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

  deleteTenant(id?: string): void {
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

  goBack(): void {
    history.back();
  }
}
