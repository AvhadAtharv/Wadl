import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  formData = {
    fullName: 'Atharv Avhad',
    email: 'atharv.avhad@example.com',
    phone: '9876543210',
    rollNo: 'TEIT314458',
    course: 'TE Information Technology',
    password: 'Atharv@123'
  };

  statusMessage = '';
  errorMessage = '';

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  onSubmit(form: NgForm): void {
    if (form.invalid) {
      this.errorMessage = 'Please complete all fields before submitting.';
      this.statusMessage = '';
      return;
    }

    const result = this.authService.register(this.formData);

    if (!result.success) {
      this.errorMessage = result.message;
      this.statusMessage = '';
      return;
    }

    this.errorMessage = '';
    this.statusMessage = result.message;
    form.resetForm({
      fullName: '',
      email: '',
      phone: '',
      rollNo: '',
      course: 'TE Information Technology',
      password: ''
    });
    this.router.navigate(['/login']);
  }
}
