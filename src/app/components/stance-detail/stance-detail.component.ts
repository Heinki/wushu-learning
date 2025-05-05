import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stance-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stance-detail.component.html',
  styleUrl: './stance-detail.component.scss',
})
export class StanceDetailComponent {
  @Input() stance: any;
}
