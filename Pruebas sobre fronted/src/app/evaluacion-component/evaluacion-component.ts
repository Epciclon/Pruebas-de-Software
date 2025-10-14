import { Component } from '@angular/core';

@Component({
  selector: 'app-evaluacion-component',
  imports: [],
  templateUrl: './evaluacion-component.html',
  styleUrl: './evaluacion-component.css'
})
export class EvaluacionComponent {
  nombre: string = '';
  nota1: number = 0;
  nota2: number = 0;
  textareaContent: string = '';
  dado(): boolean {
    const num = Math.floor(Math.random() * 100);
    
    if (num % 2){
      return num % 2 === 0;
    }
    else 
    return num === 1;
  }
}
