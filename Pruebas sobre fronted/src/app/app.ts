import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './evaluacion-component/evaluacion-component.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'PanchezDarwin';
}
