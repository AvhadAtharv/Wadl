import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  credentials = {
    email: 'atharv.avhad@example.com',
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
      this.errorMessage = 'Enter a valid email and password.';
      this.statusMessage = '';
      return;
    }

    const result = this.authService.login(
      this.credentials.email,
      this.credentials.password
    );

    if (!result.success) {
      this.errorMessage = result.message;
      this.statusMessage = '';
      return;
    }

    this.errorMessage = '';
    this.statusMessage = result.message;
    this.router.navigate(['/profile']);
  }
}
