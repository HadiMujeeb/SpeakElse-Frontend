import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { filterField } from '../../FieldConfigs/filterField';
import { FormField } from '../../models/form-field.interface';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.css'
})
export class FilterComponent {
@Output() room = new EventEmitter<void>();
filterFields:FormField[]=filterField;

filters:any = {
  language: '',
  profession: '',
  country: '',
  level: '',
  topic: '',
};

constructor() {}

ngOnInit(): void {

}



applyFilters() {

  console.log('Filters applied:', this.filters);
}

clearFilter(fieldName: string) {

}

createRoom() {

  this.room.emit();
}
}
