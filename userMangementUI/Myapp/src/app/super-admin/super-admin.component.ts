import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-super-admin',
  templateUrl: './super-admin.component.html',
  styleUrls: ['./super-admin.component.css']
})
export class SuperAdminComponent implements OnInit {
  userId: number | null = 1;   // Initialize userId with default value of 1

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idString = params.get('id');
      if (idString) {
        const parsedId = Number(idString); // Convert string to number using Number constructor
        if (!isNaN(parsedId)) {
          this.userId = parsedId;
          console.log('User ID from route:', this.userId);
          // Add additional logic or service calls here if needed
        } else {
          console.error('Invalid ID format:', idString);
        }
      }
    });
  }
}
